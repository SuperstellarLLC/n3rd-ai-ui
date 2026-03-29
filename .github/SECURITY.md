# Security Policy

## Supported Versions

| Version | Supported                  |
| ------- | -------------------------- |
| 0.x.x   | :white_check_mark: Current |

## Reporting a Vulnerability

Please report security vulnerabilities through GitHub's
private vulnerability reporting feature:

1. Go to the Security tab of this repository
2. Click "Report a vulnerability"
3. Provide details of the issue

Do NOT open a public issue for security vulnerabilities.

Expected response time: 48 hours for acknowledgment,
7 days for a fix or mitigation plan.

## Security Measures

This project uses:

- Signed commits (GPG)
- npm provenance (Sigstore attestation)
- Automated dependency auditing (Dependabot + npm audit)
- Secret scanning with push protection
- CodeQL static analysis
- OpenSSF Scorecard monitoring
- SBOM generation for every release
- License compliance checking
