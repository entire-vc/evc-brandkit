# Lighthouse CI image

This is the single image recipe for the `analytics-lighthouse` jobs in
`entire-vc/evc-site`, `entire-vc/events-entire-vc`,
`venturecrew/venture-crew-com` and `venturecrew/prototypes-ventures`.
It preserves the Node 22 / Debian bookworm / system Chromium environment.

Build a release explicitly for the CI runners, including when building on an
ARM Mac:

```sh
docker buildx build --platform linux/amd64 --load \
  --tag site-lighthouse:<version> .gitlab/images/site-lighthouse
```

Build once, test that image, and publish the same image into each consumer's
own registry namespace as `<project-registry>/ci/lighthouse:<version>`.
Do not assume cross-project job-token pull permission. Verify each published
manifest's digest and `linux/amd64` architecture. Consumers use
`$CI_REGISTRY_IMAGE/ci/lighthouse@sha256:<verified-registry-digest>`, never a
mutable tag. Do not add image builds to ordinary product MR pipelines.

The Node base and Debian package sources are pinned. The Debian snapshot
`20261011T202655Z` and security snapshot `20261011T121237Z` precede the
2026-10-11 21:49 UTC image build. Their indexes contain the exact tested tools:
Chromium `154.0.8037.92-1~deb12u1`, Python `3.11.2-1+b1` and Git
`1:2.39.5-0+deb12u3`; the recipe pins these versions explicitly. Snapshot
sources also freeze dependency resolution. `Check-Valid-Until: no` applies
only to these historical snapshots; Debian signature and TLS checks remain
required. See [Debian snapshot usage](https://snapshot.debian.org/#usage).

This fixes future package selection; it does not claim a byte-identical
rebuild of the previously published image. Existing consumer image digests
continue to identify the tested bytes and are not changed by this recipe.
The resulting image records its package inventory and Node/Chromium versions under
`/usr/local/share/site-lighthouse/`. Retain this inventory, recipe commit,
image ID and registry manifest digest with each release. The build context
excludes repository content, credentials and caches.

Advance the snapshot timestamps and explicit package versions together for
Chromium/Debian security updates and whenever an urgent security fix is
released; also review the pinned Node base. Rebuild once after that change. Validate each
new image with the existing Lighthouse baseline/head comparison, three runs
per variant and the unchanged zero-score-drop gate, plus the original project
contracts. Roll out to evc-site first. Measure runner pull, setup and total
job duration; a larger image pull may offset saved installation time. Preserve
cold/warm observations without deleting shared runner caches. Extend to the
other sites only after the canary passes. Prototype additionally requires its
source-bound compiled-CI fixture from real GitLab CI lint.

Rollback by reverting the consumer image/preflight change to
`node:22-bookworm` and its original apt setup; restore the matching Prototype
compiled-CI fixture too. Retain prior image releases and evidence. No shared
Docker daemon reconfiguration or restart is required.
