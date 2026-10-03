"""Real-browser controls for the DPR=2 image budget, run inside CI."""
import contextlib
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import importlib.util
import io
import json
from pathlib import Path
import random
import struct
import sys
import tempfile
import threading
import unittest
from unittest.mock import patch
import zlib

import measure


def png(width, height):
    rng = random.Random(42)
    rows = b"".join(b"\0" + rng.randbytes(width * 3) for _ in range(height))

    def chunk(kind, data):
        return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data))

    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">2I5B", width, height, 8, 2, 0, 0, 0)) + \
        chunk(b"IDAT", zlib.compress(rows)) + chunk(b"IEND", b"")


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


class BrowserControls(unittest.TestCase):
    def test_mobile_failed_script_is_not_a_successful_sample(self):
        from playwright.sync_api import sync_playwright
        class AbortedScriptHandler(QuietHandler):
            def do_GET(self):
                if self.path == '/broken.js':
                    self.connection.close()
                    return
                super().do_GET()
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / 'index.html').write_text('<meta name="viewport" content="width=device-width,initial-scale=1">'
                '<h1>Failed script control</h1><script src="broken.js"></script>')
            server = ThreadingHTTPServer(('127.0.0.1', 0), partial(AbortedScriptHandler, directory=tmp))
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                with sync_playwright() as p:
                    browser = p.chromium.launch()
                    result = measure.one_run(browser, f'http://127.0.0.1:{server.server_port}/', 'scroll', 4, mobile=True)
                    browser.close()
                self.assertIn('resource transfers failed', result.get('error', ''), result)
                print('RED CONTROL: aborted script transfer invalidates mobile sample')
            finally:
                server.shutdown()
                server.server_close()
                thread.join()

    def test_mobile_observer_failure_is_not_a_zero_measurement(self):
        from playwright.sync_api import sync_playwright
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "index.html").write_text('<h1>Observer control</h1>')
            server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=tmp))
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                with sync_playwright() as p:
                    browser = p.chromium.launch()
                    result = measure.one_run(browser, f"http://127.0.0.1:{server.server_port}/", "scroll", 4, mobile=True)
                    self.assertIn("viewport differs", result.get("error", ""), result)
                    for observer in ("cls", "longtask"):
                        with patch.object(measure, "INIT_JS", measure.INIT_JS + f"\nwindow.__perf.observers.{observer} = false;"):
                            result = measure.one_run(browser, f"http://127.0.0.1:{server.server_port}/", "scroll", 4, mobile=True)
                        self.assertIn("instrumentation unavailable", result.get("error", ""), result)
                    browser.close()
                print("RED: missing CLS/long-task instrumentation produces an error, never zero metrics")
            finally:
                server.shutdown()
                server.server_close()
                thread.join()

    def test_mobile_slow_lazy_image_is_counted_after_scroll(self):
        from playwright.sync_api import sync_playwright
        import time
        class SlowImageHandler(QuietHandler):
            def do_GET(self):
                if self.path == "/late.png":
                    time.sleep(4)
                super().do_GET()
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "late.png").write_bytes(png(600, 600))
            (Path(tmp) / "index.html").write_text('<meta name="viewport" content="width=device-width,initial-scale=1">'
                '<h1>Lazy-image control</h1><div style="height:3500px"></div>'
                '<img width="350" height="350" loading="lazy" src="late.png">')
            server = ThreadingHTTPServer(("127.0.0.1", 0), partial(SlowImageHandler, directory=tmp))
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                with sync_playwright() as p:
                    browser = p.chromium.launch()
                    result = measure.one_run(browser, f"http://127.0.0.1:{server.server_port}/", "scroll", 4, mobile=True)
                    browser.close()
                self.assertNotIn("error", result, result)
                self.assertGreater(result["images_kb"], 1000, result)
                self.assertTrue(any("late.png" in url for url, size in result["_top"]), result)
                print("RED CONTROL: delayed >1000KB lazy image is fully counted after scroll")
            finally:
                server.shutdown()
                server.server_close()
                thread.join()

    def test_mobile_heavy_image_red_then_green(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "hero.png").write_bytes(png(600, 600))
            (root / "index.html").write_text('<meta name="viewport" content="width=device-width,initial-scale=1">'
                '<h1>Mobile control</h1><img width="350" height="350" src="hero.png">')
            server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=tmp))
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            url = f"http://127.0.0.1:{server.server_port}"
            budget, report = root / "budget.json", root / "report.json"
            budget.write_text(json.dumps({"mobile": {"screens": {"home": {"path": "/", "hard": {
                "lcp_ms": 2500, "cls": .1, "tbt_ms": 200, "images_kb": 100, "js_kb": 10}}}}}))
            args = ["measure.py", "--mode", "mobile", "--base-url", url,
                    "--budget", str(budget), "--out", str(report)]
            try:
                with patch.object(sys, "argv", args), contextlib.redirect_stdout(io.StringIO()):
                    status = measure.main()
                data = json.loads(report.read_text())
                self.assertEqual(status, 1, data)
                self.assertTrue(any('images_kb' in e for e in data['failures']))
                self.assertGreater(data['mobile']['home']['median']['images_kb'], 1000)
                self.assertEqual(data['mobile']['home']['runs_ok'], 5)
                for run in data['mobile']['home']['runs']:
                    self.assertEqual(run['viewport']['width'], 393)
                    self.assertEqual(run['viewport']['dpr'], 2)
                print('RED: mobile393/4G/CPU4; five runs; heavy hero >1000KB; CLI exit=1')
                (root / 'hero.png').write_bytes(png(20, 20))
                with patch.object(sys, "argv", args), contextlib.redirect_stdout(io.StringIO()):
                    status = measure.main()
                self.assertEqual(status, 0, report.read_text())
                print('GREEN: same mobile profile; small hero; five runs; CLI exit=0')
            finally:
                server.shutdown()
                server.server_close()
                thread.join()

    def test_dpr2_candidate_budget_and_broken_image(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "small.png").write_bytes(png(20, 20))
            (root / "large.png").write_bytes(png(400, 400))
            (root / "index.html").write_text('<img width="20" height="20" src="small.png" '
                                            'srcset="small.png 1x, large.png 2x">')
            server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=tmp))
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            url = f"http://127.0.0.1:{server.server_port}"
            budget = root / "budget.json"
            budget.write_text(json.dumps({"screens": {"home": {"hard": {
                "images_kb": 10, "images_2x_kb": 10}}}}))
            report = root / "report.json"
            args = ["measure.py", "--base-url", url, "--runs", "1",
                    "--budget", str(budget), "--out", str(report)]
            try:
                with patch.object(sys, "argv", args), contextlib.redirect_stdout(io.StringIO()):
                    status = measure.main()
                data = json.loads(report.read_text())
                self.assertEqual(status, 1, data)
                self.assertLess(data["screens"]["home"]["hard"]["images_kb"], 10)
                self.assertGreater(data["screens"]["home"]["hard"]["images_2x_kb"], 400)
                self.assertTrue(any("images_2x_kb" in f for f in data["failures"]))
                print("RED: DPR=1 <10 KB; oversized DPR=2 >400 KB; CLI exit=1")

                (root / "large.png").write_bytes(png(20, 20))
                with patch.object(sys, "argv", args), contextlib.redirect_stdout(io.StringIO()):
                    status = measure.main()
                self.assertEqual(status, 0)
                print("GREEN: small DPR=2 candidate; CLI exit=0")

                (root / "large.png").unlink()
                with patch.object(sys, "argv", args), contextlib.redirect_stdout(io.StringIO()):
                    status = measure.main()
                data = json.loads(report.read_text())
                self.assertEqual(status, 1)
                self.assertEqual(data["screens"]["home"]["runs_ok"]["dpr2"], 0)
                self.assertTrue(data["screens"]["home"]["errors"]["dpr2"])
                print("RED: missing DPR=2 candidate; dpr2 runs_ok=0; CLI exit=1")
            finally:
                server.shutdown()
                server.server_close()
                thread.join()


if __name__ == "__main__":
    unittest.main(verbosity=2)
