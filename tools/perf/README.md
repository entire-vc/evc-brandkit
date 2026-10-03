# Static-site performance harness

`measure.py`, `serve_gzip.py`, and `ci/perf-budget.yml` are shared by the four
static sites. Each consumer commits only its budget, a bootstrap, and
`perf/source.json` with the full source commit SHA. Its GitLab include uses the
same SHA. No design-system package release is required.

Run locally with the existing GitLab credentials:

```sh
python3 perf/bootstrap.py test_measure.py
python3 perf/bootstrap.py serve_gzip.py dist 4321
python3 perf/bootstrap.py measure.py --runs 10 --out perf/report.json
```

Each of the CPU 1x, CPU 4x, and DPR=2 batches needs at least 80% successful
runs. DPR=1 hard metrics keep their existing budgets; DPR=2 image bytes use the
required `images_2x_kb` ceiling. Timing remains a warning. Reports retain batch
counts and errors even when insufficient runs prevent computing medians.

`test_browser.py` runs real-browser red/green controls in CI: an oversized 2x
image fails, a small 2x image passes, and a missing 2x image fails. The source
manifest hashes every downloaded Python file; regenerate it after changes.

Optional `mobile.screens` entries add a blocking mobile budget without changing
the desktop budgets. Each entry needs an origin-relative `path` and `hard`
ceilings for `lcp_ms`, `cls`, `tbt_ms`, `js_kb`, and `images_kb`. Each page gets
exactly five cold contexts and must complete all five. Medians gate the job;
raw runs, LCP element, viewport, and resource weights remain in the report.

The mobile profile is 393x852 CSS pixels, DPR=2, touch/mobile emulation, CPU x4,
and actual CDP Slow 4G (150ms latency, 1.6Mbps down, 750Kbps up). Load metrics
are observed through load plus ten seconds, before scrolling. TBT is the
existing harness proxy: long-task blocking time after FCP in that observation
window, rather than a Lighthouse score or field INP. Resource bytes include the
subsequent scroll, so lazy-loaded images are also budgeted.

Use `--mode mobile` for the five-run mobile batch alone, or the default `all`
to run desktop and configured mobile gates together. Third-party traffic stays
blocked in CI. `--third-party` includes it for live measurements; report that
scope separately from the repeatable first-party CI baseline. Browser controls
also prove a >1MB mobile hero fails and the small replacement passes.

To upgrade, update both the include ref and `perf/source.json` to the reviewed
commit. To roll back, revert the consumer change to its previous source pin.

Mobile byte totals drain requested static resources after the scroll workload,
with a 60-second timeout that fails the run rather than omitting in-flight bytes.
Failed static transfers and HTTP errors invalidate the mobile sample. Browser
controls include a delayed, oversized lazy image below the fold and an aborted
script transfer. The report records the actual Chromium version, and the runner
rejects pages whose layout viewport differs from the requested profile.
