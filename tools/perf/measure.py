#!/usr/bin/env python3
"""CI perf-budget gate for events-entire-vc (events.entire.vc). Method: skill
`frontend-perf`. Adapted from evc-site's perf/measure.py (same harness on
entire.vc, venture-crew.com, prototypes.ventures).

Measures the built `dist/` (served locally, cold cache) and fails the job when
a HARD metric in perf/budget.json is exceeded. Byte counts and style/layout counts use medians of successful runs; timing
metrics are reported as p75 and only warn. Optional mobile budgets gate five-run
medians at 393px, DPR=2, actual Slow 4G and CPU x4. Every desktop CPU/DPR batch requires at
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
import math
import sys
from urllib.parse import urlsplit
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

SCREENS = [
    # (screen_id, path, interaction)
    ("home", "/", "scroll"),
]

INIT_JS = r"""
(() => {
  const P = window.__perf = {lcp: 0, cls: 0, clsWin: 0, clsWinStart: 0, clsLast: 0, longtasks: [], observers: {lcp:false, cls:false, longtask:false}};
  try { if (!PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) throw new Error('unsupported observer');
        new PerformanceObserver(l => { for (const e of l.getEntries()) {
          P.lcp = e.renderTime || e.loadTime || e.startTime;
          P.lcpElement = {url:e.url, tag:e.element?.tagName, text:e.element?.textContent?.slice(0,120)};
        } })
        .observe({type: 'largest-contentful-paint', buffered: true}); P.observers.lcp = true; } catch (e) {}
  try { if (!PerformanceObserver.supportedEntryTypes.includes('layout-shift')) throw new Error('unsupported observer');
        new PerformanceObserver(l => { for (const e of l.getEntries()) {
          if (e.hadRecentInput) continue;
          if (P.clsWin && e.startTime - P.clsLast < 1000 && e.startTime - P.clsWinStart < 5000) P.clsWin += e.value;
          else { P.clsWin = e.value; P.clsWinStart = e.startTime; }
          P.clsLast = e.startTime; if (P.clsWin > P.cls) P.cls = P.clsWin; } })
        .observe({type: 'layout-shift', buffered: true}); P.observers.cls = true; } catch (e) {}
  try { if (!PerformanceObserver.supportedEntryTypes.includes('longtask')) throw new Error('unsupported observer');
        new PerformanceObserver(l => { for (const e of l.getEntries()) P.longtasks.push([e.startTime, e.duration]); })
        .observe({type: 'longtask', buffered: true}); P.observers.longtask = true; } catch (e) {}
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
        page.mouse.move(min(600, page.viewport_size["width"] // 2), 400)
        for _ in range(8):
            page.mouse.wheel(0, 600)
            page.wait_for_timeout(150)
        page.wait_for_timeout(500)


def one_run(browser, url: str, spec: str, cpu: float, dpr: float = 1.0,
            mobile: bool = False, third_party: bool = False, excluded_resource_paths=()) -> dict:
    options = {"viewport": {"width": 393, "height": 852} if mobile else {"width": 1366, "height": 800},
               "device_scale_factor": 2 if mobile else dpr, "service_workers": "block"}
    if mobile:
        options.update(is_mobile=True, has_touch=True,
            user_agent="Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/" + browser.version + " Mobile Safari/537.36")
    ctx = browser.new_context(**options)
    origin = "/".join(url.split("/")[:3])
    def excluded(request_url):
        return (mobile and not third_party and request_url.startswith(origin + "/")
                and urlsplit(request_url).path in excluded_resource_paths)
    # Block every third-party request instead of relying on the runner having
    # no route to the internet: that was the original assumption (a GitLab
    # runner "obviously" has no egress) and it was wrong — measured live,
    # this CI job pulled down ~90 KB of real Yandex Metrika JS and forced ~90
    # extra RecalcStyle events, exactly the third-party noise this gate is
    # supposed to exclude by design (see budget.json's own comment). Blocking
    # explicitly makes the gate's scope a property of the code, not of
    # whichever network the job happens to run on this week.
    if not third_party:
        ctx.route(lambda u: not u.startswith(origin + "/") or excluded(u), lambda route: route.abort())
    page = ctx.new_page()
    page.set_default_timeout(30000)
    cdp = ctx.new_cdp_session(page)
    cdp.send("Network.enable")
    cdp.send("Network.setCacheDisabled", {"cacheDisabled": True})
    cdp.send("Performance.enable")
    if mobile:
        # Actual CDP throttling, not Lighthouse/Lantern simulation. Slow 4G:
        # 150ms latency, 1.6Mbps down / 750Kbps up (CDP expects bytes/sec).
        cdp.send("Network.emulateNetworkConditions", {"offline": False, "latency": 150,
                 "downloadThroughput": 1600000 / 8, "uploadThroughput": 750000 / 8,
                 "connectionType": "cellular4g"})
    if cpu and cpu > 1:
        cdp.send("Emulation.setCPUThrottlingRate", {"rate": cpu})
    types: dict[str, str] = {}
    urls: dict[str, str] = {}
    per_url: dict[str, int] = {}
    image_errors: list[str] = []
    resource_errors: list[str] = []
    pending: dict[str, str] = {}

    def on_request(p):
        request_url = p.get("request", {}).get("url", "")
        if mobile and p.get("type") in BUCKET and not excluded(request_url) and (third_party or request_url.startswith(origin + "/")):
            pending[p["requestId"]] = request_url
    bytes_by_bucket = {"fonts": 0, "images": 0, "js": 0, "css": 0, "other": 0}

    def on_resp(p):
        types[p["requestId"]] = p.get("type", "")
        response = p.get("response", {})
        urls[p["requestId"]] = response.get("url", "")
        if p["requestId"] in pending and response.get("status", 0) >= 400:
            resource_errors.append(f"HTTP {response['status']}: {response.get('url')}")
        if p.get("type") == "Image" and response.get("url", "").startswith(origin + "/") and response.get("status", 0) >= 400:
            image_errors.append(f"HTTP {response['status']}: {response.get('url')}")

    def on_fin(p):
        pending.pop(p["requestId"], None)
        t = types.get(p["requestId"], "")
        b = p.get("encodedDataLength", 0) or 0
        bucket = BUCKET.get(t, "other")
        bytes_by_bucket[bucket] += b
        if bucket in ("fonts", "images"):
            key = f"{bucket} {urls.get(p['requestId'], '?').replace(origin, '')}"
            per_url[key] = per_url.get(key, 0) + b

    cdp.on("Network.requestWillBeSent", on_request)
    def on_fail(p):
        failed_url = pending.pop(p["requestId"], None)
        if failed_url:
            resource_errors.append(f"{p.get('errorText', 'transfer failed')}: {failed_url}")

    cdp.on("Network.loadingFailed", on_fail)
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
    if mobile:
        observers = page.evaluate("window.__perf && window.__perf.observers")
        if not observers or not all(observers.get(k) for k in ("lcp", "cls", "longtask")):
            ctx.close()
            return {"error": f"mobile instrumentation unavailable: {observers}"}
    if mobile:
        viewport = page.evaluate("({width:innerWidth,height:innerHeight,dpr:devicePixelRatio})")
        if viewport != {"width": 393, "height": 852, "dpr": 2}:
            ctx.close()
            return {"error": f"mobile layout viewport differs from requested profile: {viewport}"}
    wait_quiet(page)
    if mobile:
        try:
            page.wait_for_load_state("load", timeout=60000)
        except Exception:
            ctx.close()
            return {"error": "mobile load did not complete within 60s"}
        # Include delayed analytics and font/image swaps in a repeatable
        # observation window. No scrolling/input before load metrics.
        page.wait_for_timeout(10000)
    if page.evaluate("document.contentType") != "text/html":
        ctx.close()
        return {"error": "preview did not return an HTML document"}
    m0 = metrics_map(cdp)
    load_timing = page.evaluate(COLLECT_JS)
    if mobile and load_timing["lcp"] <= 0:
        ctx.close()
        return {"error": "mobile LCP observer produced no measurement"}
    lcp_element = page.evaluate("window.__perf.lcpElement || null") if mobile else None
    interact(page, spec)
    page.wait_for_timeout(300)
    m1 = metrics_map(cdp)
    wait_quiet(page)
    if mobile:
        # Scroll can start large lazy-image transfers after the load snapshot.
        # Long-task quiet is not network quiet. Count only after every requested
        # static resource has finished (or explicitly fail instead of omitting it).
        deadline = time.monotonic() + 60
        while pending and time.monotonic() < deadline:
            page.wait_for_timeout(100)
        if pending:
            outstanding = list(pending.values())
            ctx.close()
            return {"error": f"mobile resources did not finish within 60s: {outstanding}"}
        if resource_errors:
            ctx.close()
            return {"error": f"mobile resource transfers failed: {resource_errors}"}
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
    if mobile:
        res["viewport"] = page.evaluate("({width:innerWidth,height:innerHeight,dpr:devicePixelRatio})")
        res["lcp_element"] = lcp_element
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

MOBILE_KEYS = ("lcp_ms", "cls", "tbt_ms", "js_kb", "images_kb", "fonts_kb", "css_kb")


def valid_mobile_sample(run):
    if not isinstance(run, dict):
        return {"error": "invalid mobile measurement: expected metric object"}
    if "error" in run:
        return run
    for key in MOBILE_KEYS:
        value = run.get(key)
        if (not isinstance(value, (int, float)) or isinstance(value, bool)
                or not math.isfinite(value) or value < 0 or (key == "lcp_ms" and value == 0)):
            return {**run, "error": f"invalid mobile measurement: {key}={value!r}"}
    return run


def mobile_measure(browser, base_url, config, third_party=False):
    """Five successful cold-cache runs per configured page; absolute budgets."""
    reports, failures = {}, []
    for sid, screen in config["screens"].items():
        url = base_url.rstrip("/") + screen["path"]
        runs = [valid_mobile_sample(one_run(browser, url, "scroll", 4, mobile=True, third_party=third_party,
                excluded_resource_paths=config.get("excluded_resource_paths", []))) for _ in range(5)]
        ok = [r for r in runs if "error" not in r]
        med = {k: median([r[k] for r in ok]) for k in MOBILE_KEYS} if ok else {}
        reports[sid] = {"url": url, "runs": runs, "median": med, "runs_ok": len(ok)}
        if len(ok) != 5:
            failures.append(f"mobile.{sid}: need 5/5 successful runs, got {len(ok)}/5")
        for key, ceiling in screen["hard"].items():
            if key not in med or med[key] is None or not math.isfinite(med[key]) or med[key] > ceiling:
                failures.append(f"mobile.{sid}.{key}: {med.get(key)} > budget ceiling {ceiling}")
    return reports, failures


def validate_mobile(config):
    if not isinstance(config, dict) or not isinstance(config.get("screens"), dict) or not config["screens"]:
        raise ValueError("mobile.screens must contain at least one page")
    excluded = config.get("excluded_resource_paths", [])
    if not isinstance(excluded, list) or any(not isinstance(path, str) or not path.startswith("/")
            or path.startswith("//") or path.endswith("/") or "?" in path or "#" in path
            or ".." in path.split("/") for path in excluded):
        raise ValueError("mobile.excluded_resource_paths must contain exact origin-relative resource paths")
    for sid, screen in config["screens"].items():
        if not isinstance(screen, dict) or not isinstance(screen.get("hard"), dict):
            raise ValueError(f"mobile.{sid}: page and hard ceilings must be objects")
        path = screen.get("path", "")
        if not isinstance(path, str) or not path.startswith("/") or path.startswith("//"):
            raise ValueError(f"mobile.{sid}: origin-relative path required")
        ceilings = screen.get("hard", {})
        for key in ("lcp_ms", "cls", "tbt_ms", "js_kb", "images_kb"):
            if key not in ceilings:
                raise ValueError(f"mobile.{sid}: required ceiling {key} missing")
        for key, value in ceilings.items():
            if key not in MOBILE_KEYS or not isinstance(value, (int, float)) or isinstance(value, bool) or not math.isfinite(value) or value < 0:
                raise ValueError(f"mobile.{sid}: invalid ceiling {key}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", default="http://localhost:4321")
    ap.add_argument("--runs", type=int, default=5)
    ap.add_argument("--budget", default="perf/budget.json")
    ap.add_argument("--out", default="perf/report.json")
    ap.add_argument("--mode", choices=("all", "desktop", "mobile"), default="all")
    ap.add_argument("--third-party", action="store_true", help="Include third-party traffic for live mobile measurements")
    a = ap.parse_args()
    if a.runs < 1:
        ap.error("--runs must be at least 1")

    budget = json.loads(Path(a.budget).read_text())
    mobile_config = budget.get("mobile")
    if a.mode == "mobile" and mobile_config is None:
        ap.error("--mode mobile requires mobile budgets")
    if mobile_config is not None:
        try:
            validate_mobile(mobile_config)
        except ValueError as error:
            ap.error(str(error))
    for sid, _, _ in SCREENS if a.mode != "mobile" else []:
        ceiling = budget.get("screens", {}).get(sid, {}).get("hard", {}).get("images_2x_kb")
        if not isinstance(ceiling, (int, float)) or isinstance(ceiling, bool) or ceiling < 0:
            ap.error(f"{sid}: a non-negative images_2x_kb ceiling is required")
    report = {"screens": {}, "runs_requested": a.runs, "min_success_ratio": MIN_SUCCESS_RATIO}
    failures = []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        for sid, path, spec in SCREENS if a.mode != "mobile" else []:
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

        if mobile_config is not None and a.mode != "desktop":
            report["mobile"], mobile_failures = mobile_measure(browser, a.base_url, mobile_config, a.third_party)
            report["mobile_profile"] = {"browser_version": str(browser.version), "width": 393, "height": 852, "dpr": 2, "cpu": 4,
                "latency_ms": 150, "download_bps": 1600000, "upload_bps": 750000,
                "third_party": a.third_party, "runs": 5, "aggregation": "median", "load_window_ms": 10000}
            report["mobile_profile"]["excluded_resource_paths"] = [] if a.third_party else mobile_config.get("excluded_resource_paths", [])
            failures.extend(mobile_failures)
        browser.close()
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
