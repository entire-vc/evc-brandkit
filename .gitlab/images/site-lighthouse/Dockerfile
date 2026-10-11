# Canonical recipe: entire-vc/evc-brandkit/.gitlab/images/site-lighthouse.
# Exact node:22-bookworm base observed in both measured Site/Prototypes jobs.
# Build with --platform linux/amd64; publish this ONE image into each consumer's
# own registry namespace. Do not rebuild per project or on every product MR.
FROM node:22-bookworm@sha256:0e5f906573693feaa1e21057ebdcfdb5bd5021f050b2dc7c9deceb629c7da2a8
RUN test "$(dpkg --print-architecture)" = amd64 \
 && printf '%s\n' \
      'Types: deb' \
      'URIs: https://snapshot.debian.org/archive/debian/20261011T202655Z/' \
      'Suites: bookworm bookworm-updates' \
      'Components: main' \
      'Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg' \
      'Check-Valid-Until: no' '' \
      'Types: deb' \
      'URIs: https://snapshot.debian.org/archive/debian-security/20261011T121237Z/' \
      'Suites: bookworm-security' \
      'Components: main' \
      'Signed-By: /usr/share/keyrings/debian-archive-keyring.gpg' \
      'Check-Valid-Until: no' \
      > /etc/apt/sources.list.d/debian.sources \
 && apt-get update \
 && apt-get install -y --no-install-recommends \
      chromium=154.0.8037.92-1~deb12u1 python3=3.11.2-1+b1 git=1:2.39.5-0+deb12u3 \
 && mkdir -p /usr/local/share/site-lighthouse \
 && dpkg-query -W > /usr/local/share/site-lighthouse/packages.txt \
 && node --version > /usr/local/share/site-lighthouse/node-version.txt \
 && chromium --version > /usr/local/share/site-lighthouse/chromium-version.txt \
 && rm -rf /var/lib/apt/lists/*
RUN test "$(node -p 'process.versions.node.split(".")[0]')" = 22 \
 && test "$(command -v chromium)" = /usr/bin/chromium \
 && python3 --version && git --version \
 && chromium --headless --no-sandbox --disable-dev-shm-usage \
      --dump-dom 'data:text/html,<title>site-lighthouse-image-smoke</title>' \
      > /tmp/site-lighthouse-smoke.html 2>/dev/null \
 && grep -q site-lighthouse-image-smoke /tmp/site-lighthouse-smoke.html \
 && rm /tmp/site-lighthouse-smoke.html
# No site checkout, npm token/config, writable dependency cache or artifacts.
# Snapshot URLs freeze dependencies; explicit versions match the tested tools.
# Advance snapshots and versions together for security updates, then revalidate.
