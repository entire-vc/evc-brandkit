"""Preview-server containment checks, including a valid gzip response."""
import gzip
from contextlib import closing
import http.client
from http.server import ThreadingHTTPServer
from pathlib import Path
import tempfile
import threading
import unittest

from serve_gzip import GzipHandler


class ServerTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        root = Path(self.tmp.name)
        self.dist = root / "dist"
        self.dist.mkdir()
        (self.dist / "index.html").write_text("<h1>valid preview</h1>")
        sibling = root / "dist-secret"
        sibling.mkdir()
        (sibling / "leak.txt").write_text("private fixture")
        (self.dist / "escape.txt").symlink_to(sibling / "leak.txt")
        handler = type("Handler", (GzipHandler,), {"directory": str(self.dist)})
        self.server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.thread.join()
        self.tmp.cleanup()

    def request(self, path):
        with closing(http.client.HTTPConnection("127.0.0.1", self.server.server_port, timeout=5)) as connection:
            connection.request("GET", path, headers={"Accept-Encoding": "gzip"})
            response = connection.getresponse()
            return response.status, response.getheader("Content-Encoding"), response.read()

    def test_valid_html_is_compressed(self):
        status, encoding, data = self.request("/")
        self.assertEqual(status, 200)
        self.assertEqual(encoding, "gzip")
        self.assertEqual(gzip.decompress(data), b"<h1>valid preview</h1>")

    def test_sibling_prefix_traversal_is_forbidden(self):
        self.assertEqual(self.request("/../dist-secret/leak.txt")[0], 403)

    def test_encoded_traversal_is_forbidden(self):
        self.assertEqual(self.request("/%2e%2e/dist-secret/leak.txt")[0], 403)

    def test_symlink_escape_is_forbidden(self):
        self.assertEqual(self.request("/escape.txt")[0], 403)


if __name__ == "__main__":
    unittest.main(verbosity=2)
