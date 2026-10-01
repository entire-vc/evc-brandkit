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

To upgrade, update both the include ref and `perf/source.json` to the reviewed
commit. To roll back, revert the consumer change to its previous source pin.
