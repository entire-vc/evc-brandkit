"""Regression checks for the CLI exit status, with deterministic run results."""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import sys
import tempfile
import types
import unittest
from unittest.mock import MagicMock, patch

# These checks do not launch a browser or require Playwright to be installed.
with patch.dict(sys.modules, {"playwright": types.ModuleType("playwright"),
                              "playwright.sync_api": types.SimpleNamespace(sync_playwright=MagicMock())}):
    spec = importlib.util.spec_from_file_location("measure", Path(__file__).with_name("measure.py"))
    measure = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(measure)


class SuccessRatioTests(unittest.TestCase):
    def run_batch(self, ok_1x, ok_4x, runs=10, ok_dpr2=None, image_2x=0, ceiling_2x=100):
        seen = {1.0: 0, 4.0: 0, "dpr2": 0}
        limits = {1.0: ok_1x, 4.0: ok_4x, "dpr2": runs if ok_dpr2 is None else ok_dpr2}
        good = {k: 0 for k in measure.HARD_KEYS}
        good.update(lcp_ms=0, tbt_ms=0, _top=[])

        def one_run(browser, url, interaction, cpu, dpr=1.0):
            key = "dpr2" if dpr == 2 else cpu
            seen[key] += 1
            result = good.copy()
            if dpr == 2:
                result["images_kb"] = image_2x
            return result if seen[key] <= limits[key] else {"error": "injected navigation failure"}

        with tempfile.TemporaryDirectory() as tmp:
            budget, report = Path(tmp) / "budget.json", Path(tmp) / "report.json"
            budget.write_text(json.dumps({"screens": {"home": {"hard": {"images_kb": 100, "images_2x_kb": ceiling_2x}}}}))
            args = ["measure.py", "--runs", str(runs), "--budget", str(budget), "--out", str(report)]
            with patch.object(sys, "argv", args), patch.object(measure, "one_run", side_effect=one_run), \
                 patch.object(measure, "sync_playwright", MagicMock()), contextlib.redirect_stdout(io.StringIO()) as output:
                status = measure.main()
            return status, output.getvalue()

    def test_nine_failures_in_1x_cpu_batch_fail_job(self):
        status, output = self.run_batch(1, 10)
        self.assertEqual(status, 1, output)
        self.assertIn("PERF BUDGET FAILED", output)

    def test_nine_failures_in_4x_cpu_batch_fail_job(self):
        status, output = self.run_batch(10, 1)
        self.assertEqual(status, 1, output)
        self.assertIn("PERF BUDGET FAILED", output)

    def test_seven_out_of_ten_fail(self):
        self.assertEqual(self.run_batch(7, 10)[0], 1)
        self.assertEqual(self.run_batch(10, 7)[0], 1)

    def test_eight_out_of_ten_pass(self):
        self.assertEqual(self.run_batch(8, 8)[0], 0)

    def test_all_successful_pass(self):
        self.assertEqual(self.run_batch(10, 10)[0], 0)

    def test_small_batch_rounds_up(self):
        self.assertEqual(self.run_batch(1, 2, runs=2)[0], 1)
        self.assertEqual(self.run_batch(2, 2, runs=2)[0], 0)

    def test_nine_failures_in_dpr2_batch_fail_job(self):
        self.assertEqual(self.run_batch(10, 10, ok_dpr2=1)[0], 1)
        self.assertEqual(self.run_batch(10, 10, ok_dpr2=8)[0], 0)

    def test_oversized_2x_candidate_fails_only_2x_budget(self):
        status, output = self.run_batch(10, 10, image_2x=101)
        self.assertEqual(status, 1)
        self.assertIn("home.images_2x_kb", output)
        self.assertEqual(self.run_batch(10, 10, image_2x=100)[0], 0)

    def test_missing_dpr2_ceiling_rejected(self):
        with self.assertRaises(SystemExit) as error, contextlib.redirect_stderr(io.StringIO()):
            self.run_batch(10, 10, ceiling_2x=None)
        self.assertEqual(error.exception.code, 2)

    def test_zero_runs_rejected(self):
        with self.assertRaises(SystemExit) as error, contextlib.redirect_stderr(io.StringIO()):
            self.run_batch(0, 0, runs=0)
        self.assertEqual(error.exception.code, 2)


class MobileBudgetTests(unittest.TestCase):
    def test_metrics_and_incomplete_batch_fail_closed(self):
        config = {"screens": {"heavy": {"path": "/heavy/", "hard": {
            "lcp_ms": 2500, "cls": .1, "tbt_ms": 200, "js_kb": 20, "images_kb": 100}}}}
        good = {k: 0 for k in measure.MOBILE_KEYS}
        good["lcp_ms"] = 2000
        for key, bad in [("lcp_ms", 2501), ("cls", .101), ("tbt_ms", 201),
                         ("js_kb", 21), ("images_kb", 101), ("lcp_ms", float('nan'))]:
            with self.subTest(key=key), patch.object(measure, "one_run", return_value={**good, key: bad}):
                report, errors = measure.mobile_measure(MagicMock(), "http://localhost", config)
                self.assertTrue(errors, report)
                self.assertEqual(len(report["heavy"]["runs"]), 5)
        with patch.object(measure, "one_run", return_value=good):
            self.assertEqual(measure.mobile_measure(MagicMock(), "http://localhost", config)[1], [])
        with patch.object(measure, "one_run", side_effect=[good] * 4 + [{"error": "timeout"}]):
            self.assertIn("need 5/5", measure.mobile_measure(MagicMock(), "http://localhost", config)[1][0])

    def test_one_invalid_sample_cannot_hide_behind_a_valid_median(self):
        config = {"screens": {"home": {"path": "/", "hard": {
            "lcp_ms": 2500, "cls": .1, "tbt_ms": 200, "js_kb": 20, "images_kb": 100}}}}
        good = {k: 0 for k in measure.MOBILE_KEYS}
        good["lcp_ms"] = 2000
        for key in measure.MOBILE_KEYS:
            for bad in (float("nan"), float("inf"), -1, None, True, "0"):
                for index in (0, 2, 4):
                    batch = [good.copy() for _ in range(5)]
                    batch[index][key] = bad
                    with self.subTest(key=key, bad=bad, index=index), patch.object(measure, "one_run", side_effect=batch):
                        report, errors = measure.mobile_measure(MagicMock(), "http://localhost", config)
                        self.assertEqual(report["home"]["runs_ok"], 4)
                        self.assertTrue(any("need 5/5" in error for error in errors))
        for bad in ({}, {**good, "lcp_ms": 0}, None):
            with patch.object(measure, "one_run", side_effect=[good] * 4 + [bad]):
                self.assertEqual(measure.mobile_measure(MagicMock(), "http://localhost", config)[0]["home"]["runs_ok"], 4)

    def test_invalid_or_missing_ceilings_are_rejected(self):
        for hard in [{}, {"lcp_ms": float('nan')}, {"bogus": 100}]:
            with self.assertRaises(ValueError):
                measure.validate_mobile({"screens": {"home": {"path": "/", "hard": hard}}})


if __name__ == "__main__":
    unittest.main(verbosity=2)
