#!/usr/bin/env python3
"""CI perf-budget gate for events-entire-vc (events.entire.vc). Method: skill
`frontend-perf`. Adapted from evc-site's perf/measure.py (same harness on
entire.vc, venture-crew.com, prototypes.ventures).

Measures the built `dist/` (served locally, cold cache) and fails the job when
a HARD metric in perf/budget.json is exceeded. Byte counts and style/layout counts use medians of successful runs; timing
metrics are reported as p75 and only warn. Every CPU/DPR batch requires at
least 80% successful runs. Images are gated separately at DPR=1 and DPR=2.

Usage:
  uv run --with playwright python3 perf/measure.py \
      --base-url http://localhost:4321 --runs 5 --out perf/report.json
  (playwright browsers must be installed: `playwright install chromium` —
  already baked into the mcr.microsoft.com/playwright/python CI image)
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

SCREENS = [
    # (screen_id, path, interaction)
    ("home", "/", "scroll"),
]

INIT_JS = r"""
(() => {
  const P = window.__perf = {lcp: 0, cls: 0, clsWin: 0, clsWinStart: 0, clsLast: 0, longtasks: []};
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) P.lcp = e.renderTime || e.loadTime || e.startTime; })
        .observe({type: 'largest-contentful-paint', buffered: true}); } catch (e) {}
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) {
          if (e.hadRecentInput) continue;
          if (P.clsWin && e.startTime - P.clsLast < 1000 && e.startTime - P.clsWinStart < 5000) P.clsWin += e.value;
          else { P.clsWin = e.value; P.clsWinStart = e.startTime; }
          P.clsLast = e.startTime; if (P.clsWin > P.cls) P.cls = P.clsWin; } })
        .observe({type: 'layout-shift', buffered: true}); } catch (e) {}
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) P.longtasks.push([e.startTime, e.duration]); })
        .observe({type: 'longtask', buffered: true}); } catch (e) {}
})();
"""

COLLECT_JS = r"""
(() => {
  const P = window.__perf || {};
  const fcp = (performance.getEntriesByType('paint').find(e => e.name === 'first-contentful-paint') || {}).startTime || 0;
  let tbt = 0;
  for (const [s, d] of (P.longtasks || [])) { if (s >= fcp) tbt += Math.max(0, d - 50); }
  return {lcp: P.lcp || 0, cls: P.cls || 0, tbt};
})();
"""

# CDP Network resource "type" -> budget bucket
BUCKET = {"Font": "fonts", "Image": "images", "Script": "js", "Stylesheet": "css"}


def metrics_map(cdp) -> dict:
    return {m["name"]: m["value"] for m in cdp.send("Performance.getMetrics")["metrics"]}


def wait_quiet(page, cap_s: float = 12.0, quiet_ms: int = 1000) -> None:
    try:
        page.wait_for_load_state("load", timeout=int(cap_s * 1000))
    except Exception:
        pass
    deadline = time.time() + cap_s
    last = -1
    while time.time() < deadline:
        n = page.evaluate("(window.__perf && window.__perf.longtasks.length) || 0")
        if n == last:
            break
        last = n
        page.wait_for_timeout(quiet_ms)


def interact(page, spec: str) -> None:
    if spec == "scroll":
        # Several small wheel steps with waits between, not one big jump — a
        # single wheel(0, 1200) badly undercounts continuous-animation cost
        # (background-position shimmer, etc.): it doesn't dwell long enough
        # for a per-frame-recalc animation to show up in the delta, so a real
        # regression there would pass this gate silently. Matches roughly how
        # long a person actually spends scrolling through a hero section.
        page.mouse.move(600, 400)
        for _ in range(8):
            page.mouse.wheel(0, 600)
            page.wait_for_timeout(150)
        page.wait_for_timeout(500)


def one_run(browser, url: str, spec: str, cpu: float, dpr: float = 1.0) -> dict:
    ctx = browser.new_context(viewport={"width": 1366, "height": 800}, device_scale_factor=dpr, service_workers="block")
    origin = "/".join(url.split("/")[:3])
    # Block every third-party request instead of relying on the runner having
    # no route to the internet: that was the original assumption (a GitLab
    # runner "obviously" has no egress) and it was wrong — measured live,
    # this CI job pulled down ~90 KB of real Yandex Metrika JS and forced ~90
    # extra RecalcStyle events, exactly the third-party noise this gate is
    # supposed to exclude by design (see budget.json's own comment). Blocking
    # explicitly makes the gate's scope a property of the code, not of
    # whichever network the job happens to run on this week.
    ctx.route(lambda u: not u.startswith(origin), lambda route: route.abort())
    page = ctx.new_page()
    page.set_default_timeout(30000)
    cdp = ctx.new_cdp_session(page)
    cdp.send("Network.enable")
    cdp.send("Network.setCacheDisabled", {"cacheDisabled": True})
    cdp.send("Performance.enable")
    if cpu and cpu > 1:
        cdp.send("Emulation.setCPUThrottlingRate", {"rate": cpu})
    types: dict[str, str] = {}
    urls: dict[str, str] = {}
    per_url: dict[str, int] = {}
    image_errors: list[str] = []
    bytes_by_bucket = {"fonts": 0, "images": 0, "js": 0, "css": 0, "other": 0}

    def on_resp(p):
        types[p["requestId"]] = p.get("type", "")
        response = p.get("response", {})
        urls[p["requestId"]] = response.get("url", "")
        if p.get("type") == "Image" and response.get("url", "").startswith(origin + "/") and response.get("status", 0) >= 400:
            image_errors.append(f"HTTP {response['status']}: {response.get('url')}")

    def on_fin(p):
        t = types.get(p["requestId"], "")
        b = p.get("encodedDataLength", 0) or 0
        bucket = BUCKET.get(t, "other")
        bytes_by_bucket[bucket] += b
        if bucket in ("fonts", "images"):
            key = f"{bucket} {urls.get(p['requestId'], '?').replace(origin, '')}"
            per_url[key] = per_url.get(key, 0) + b

    cdp.on("Network.responseReceived", on_resp)
    cdp.on("Network.loadingFinished", on_fin)
    page.add_init_script(INIT_JS)
    try:
        response = page.goto(url, wait_until="domcontentloaded", timeout=45000)
        if response is None or not response.ok:
            raise RuntimeError(f"preview navigation status: {response.status if response else 'no response'}")
    except Exception as e:
        ctx.close()
        return {"error": f"goto: {type(e).__name__}: {e}"}
    wait_quiet(page)
    if page.evaluate("document.contentType") != "text/html":
        ctx.close()
        return {"error": "preview did not return an HTML document"}
    m0 = metrics_map(cdp)
    load_timing = page.evaluate(COLLECT_JS)
    interact(page, spec)
    page.wait_for_timeout(300)
    m1 = metrics_map(cdp)
    wait_quiet(page)
    broken_images = page.evaluate("""() => [...document.images]
        .filter(i => i.currentSrc.startsWith(location.origin + "/") && i.complete && i.naturalWidth === 0)
        .map(i => i.currentSrc)""")
    if image_errors or broken_images:
        ctx.close()
        return {"error": f"broken images at DPR={dpr}: {image_errors + broken_images}"}
    res = {
        "fonts_kb": round(bytes_by_bucket["fonts"] / 1024, 1),
        "images_kb": round(bytes_by_bucket["images"] / 1024, 1),
        "js_kb": round(bytes_by_bucket["js"] / 1024, 1),
        "css_kb": round(bytes_by_bucket["css"] / 1024, 1),
        "cls": round(load_timing["cls"], 4),
        "lcp_ms": round(load_timing["lcp"], 1),
        "tbt_ms": round(load_timing["tbt"], 1),
        "load_recalc_style": m0.get("RecalcStyleCount", 0),
        "load_layouts": m0.get("LayoutCount", 0),
        "act_recalc_style": m1.get("RecalcStyleCount", 0) - m0.get("RecalcStyleCount", 0),
        "act_layouts": m1.get("LayoutCount", 0) - m0.get("LayoutCount", 0),
        # Per-URL weight of the heaviest font/image responses — so a failing
        # fonts_kb/images_kb names the file to look at, not just a total.
        "_top": sorted(((k, round(v / 1024, 1)) for k, v in per_url.items()),
                       key=lambda kv: -kv[1])[:12],
    }
    ctx.close()
    return res


def median(vals):
    vals = sorted(vals)
    n = len(vals)
    if n == 0:
        return None
    mid = n // 2
    return vals[mid] if n % 2 else round((vals[mid - 1] + vals[mid]) / 2, 3)


def pct75(vals):
    vals = sorted(vals)
    if not vals:
        return None
    k = (len(vals) - 1) * 0.75
    f = int(k)
    c = min(f + 1, len(vals) - 1)
    return round(vals[f] + (vals[c] - vals[f]) * (k - f), 1)


HARD_KEYS = ["fonts_kb", "images_kb", "js_kb", "cls", "load_recalc_style", "load_layouts",
             "act_recalc_style", "act_layouts"]
SOFT_KEYS = {"lcp_ms": "lcp_4x_ms", "tbt_ms": "tbt_4x_ms"}

# A median/percentile over a handful of successful runs out of many is not a
# measurement, it's a coin flip that happened to land under budget — 1 ok out
# of 10 used to pass this gate silently (only a 100%-error batch failed it).
# Below this ratio, the run batch is untrustworthy and the job must fail
# regardless of what the surviving runs measured.
MIN_SUCCESS_RATIO = 0.8


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", default="http://localhost:4321")
    ap.add_argument("--runs", type=int, default=5)
    ap.add_argument("--budget", default="perf/budget.json")
    ap.add_argument("--out", default="perf/report.json")
    a = ap.parse_args()
    if a.runs < 1:
        ap.error("--runs must be at least 1")

    budget = json.loads(Path(a.budget).read_text())
    for sid, _, _ in SCREENS:
        ceiling = budget.get("screens", {}).get(sid, {}).get("hard", {}).get("images_2x_kb")
        if not isinstance(ceiling, (int, float)) or isinstance(ceiling, bool) or ceiling < 0:
            ap.error(f"{sid}: a non-negative images_2x_kb ceiling is required")
    report = {"screens": {}, "runs_requested": a.runs, "min_success_ratio": MIN_SUCCESS_RATIO}
    failures = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        for sid, path, spec in SCREENS:
            url = a.base_url.rstrip("/") + path
            runs_1x = [one_run(browser, url, spec, 1.0) for _ in range(a.runs)]
            runs_4x = [one_run(browser, url, spec, 4.0) for _ in range(a.runs)]
            runs_dpr2 = [one_run(browser, url, spec, 1.0, dpr=2.0) for _ in range(a.runs)]
            ok_dpr2 = [r for r in runs_dpr2 if "error" not in r]
            ok_1x = [r for r in runs_1x if "error" not in r]
            ok_4x = [r for r in runs_4x if "error" not in r]
            min_ok = a.runs * MIN_SUCCESS_RATIO
            counts = {"1x": len(ok_1x), "4x": len(ok_4x), "dpr2": len(ok_dpr2)}
            report["screens"][sid] = {"runs_ok": counts,
                "errors": {"1x": [r["error"] for r in runs_1x if "error" in r],
                           "4x": [r["error"] for r in runs_4x if "error" in r],
                           "dpr2": [r["error"] for r in runs_dpr2 if "error" in r]}}
            if any(n < min_ok for n in counts.values()):
                failures.append(f"{sid}: too many failed runs to trust the measurement "
                                 f"(1x ok={len(ok_1x)}/{a.runs}, 4x ok={len(ok_4x)}/{a.runs}, "
                                 f"DPR2 ok={len(ok_dpr2)}/{a.runs}, need >= {min_ok:.1f} each)")
                continue

            hard = {k: median([r[k] for r in ok_1x]) for k in HARD_KEYS}
            hard["images_2x_kb"] = median([r["images_kb"] for r in ok_dpr2])
            soft = {
                "lcp_1x_ms": pct75([r["lcp_ms"] for r in ok_1x]),
                "lcp_4x_ms": pct75([r["lcp_ms"] for r in ok_4x]),
                "tbt_4x_ms": pct75([r["tbt_ms"] for r in ok_4x]),
            }
            spread = {k: [min(r[k] for r in ok_1x), max(r[k] for r in ok_1x)] for k in HARD_KEYS}
            report["screens"][sid].update({"hard": hard, "hard_min_max": spread, "soft_ms": soft,
                                       "top_resources_kb": ok_1x[0]["_top"],
                                       "top_resources_2x_kb": ok_dpr2[0]["_top"]})

            screen_budget = (budget.get("screens", {}) or {}).get(sid, {})
            ceilings = screen_budget.get("hard", {})
            for k, ceiling in ceilings.items():
                val = hard.get(k)
                if val is not None and val > ceiling:
                    over = round(val - ceiling, 4)
                    pct = f", +{round(100 * over / ceiling, 1)}%" if ceiling else ""
                    failures.append(f"{sid}.{k}: measured {val} > budget ceiling {ceiling} "
                                    f"(over by {over}{pct})")

            soft_ceilings = screen_budget.get("soft_ms", {})
            for k, ceiling in soft_ceilings.items():
                val = soft.get(k)
                if val is not None and val > ceiling * 1.15:  # 15% допуск, только warn
                    print(f"WARN (non-gating): {sid}.{k} = {val}ms, budget {ceiling}ms (+15% tolerance)")

    report["failures"] = failures
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)
    Path(a.out).write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(json.dumps(report, ensure_ascii=False, indent=2))

    if failures:
        print("\nPERF BUDGET FAILED:")
        for f in failures:
            print(f"  - {f}")
        return 1
    print("\nperf budget OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
