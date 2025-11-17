# Audit Playbook

## Unauthorized Contributions
- CI flags (SPDX, DCO, license scan).
- Label PR `blocked:compliance`.
- Require remediation or reject.

## Vulnerability Disclosure
- Follow SECURITY.md timelines.
- Patch privately, release advisory.

## License Conflicts
- Replace incompatible deps.
- Update NOTICE + SBOM.

## Release Checklist
- CI green (build, lint, tests, compliance).
- CHANGELOG updated.
- Signed Git tag.
- SBOM archived.
