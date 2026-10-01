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
