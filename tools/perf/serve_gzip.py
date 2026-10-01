#!/usr/bin/env python3
"""Static file server for perf/measure.py that gzip-compresses text assets the
same way prod (nginx/Caddy) does. `python3 -m http.server` serves everything
raw — measured locally that gave byte counts ~2.6x too low for compressible
assets (SVG logos: 143 KB observed vs 377 KB actually served in a clean CI
container with no compression at all) purely from an unrelated local dev-tool
gzip quirk on one machine, neither of which matches prod. This server picks a
fixed, explicit gzip level so the budget gate means the same thing everywhere
it runs.

Usage: python3 perf/serve_gzip.py <directory> <port>
"""
from __future__ import annotations

import gzip
import http.server
import mimetypes
from pathlib import Path
import sys
from urllib.parse import unquote

COMPRESSIBLE = {"image/svg+xml", "text/css", "application/javascript",
                 "text/javascript", "text/html", "application/json", "text/xml"}
GZIP_LEVEL = 6  # matches common nginx/Caddy defaults


class GzipHandler(http.server.BaseHTTPRequestHandler):
    directory = "dist"

    def do_GET(self):
        path = unquote(self.path.split("?", 1)[0].split("#", 1)[0])
        if path.endswith("/"):
            path += "index.html"
        root = Path(self.directory).resolve()
        fs_path = (root / path.lstrip("/")).resolve()
        if not fs_path.is_relative_to(root):
            self.send_error(403)
            return
        if not fs_path.is_file():
            self.send_error(404)
            return
        ctype = mimetypes.guess_type(fs_path)[0] or "application/octet-stream"
        with open(fs_path, "rb") as fh:
            data = fh.read()
        accepts_gzip = "gzip" in (self.headers.get("Accept-Encoding", "") or "")
        if accepts_gzip and ctype in COMPRESSIBLE:
            data = gzip.compress(data, compresslevel=GZIP_LEVEL)
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Encoding", "gzip")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        else:
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)

    def log_message(self, fmt, *args):
        pass  # quiet — perf/measure.py's own output is what matters


if __name__ == "__main__":
    directory = sys.argv[1] if len(sys.argv) > 1 else "dist"
    port = int(sys.argv[2]) if len(sys.argv) > 2 else 4321
    GzipHandler.directory = directory
    http.server.ThreadingHTTPServer(("127.0.0.1", port), GzipHandler).serve_forever()
