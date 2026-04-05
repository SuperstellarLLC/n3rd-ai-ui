# Security Policy

## Supported versions

We support the latest minor version of each published package with security fixes.

| Package        | Supported versions |
| -------------- | ------------------ |
| `@n3rd-ai/ui`  | `0.4.x`            |
| `@n3rd-ai/mcp` | `0.1.x`            |

Earlier versions do not receive security patches. Please upgrade to stay protected.

## Reporting a vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, report privately via one of these channels:

1. **GitHub Security Advisories** (preferred): [Report a vulnerability](https://github.com/SuperstellarLLC/n3rd-ai/security/advisories/new)
2. **Email**: `security@n3rd.ai`

Please include:

- A description of the vulnerability and its impact
- Steps to reproduce (proof-of-concept if available)
- The affected package and version
- Your name and GitHub handle (if you'd like credit)

## Disclosure timeline

We commit to the following response times:

| Phase                          | Target                                                           |
| ------------------------------ | ---------------------------------------------------------------- |
| Initial acknowledgment         | Within **48 hours**                                              |
| Triage and severity assessment | Within **5 business days**                                       |
| Fix development and release    | Within **30 days** for high/critical; **90 days** for medium/low |
| Public disclosure              | Coordinated with reporter after patch is published               |

We follow [coordinated vulnerability disclosure](https://www.first.org/global/sigs/vulnerability-coordination/multiparty/guidelines) and will credit reporters in the release notes (unless anonymity is requested).

## Scope

In scope:

- All source code in `packages/` and `apps/`
- CI/CD workflows in `.github/workflows/`
- Build tooling and release pipeline
- Dependencies declared in `package.json` files

Out of scope:

- Vulnerabilities in upstream dependencies (please report to the upstream project)
- Issues in user-provided configuration (e.g., misconfigured CORS `origin`, weak OAuth issuer)
- Self-XSS or social engineering
- Denial of service via unreasonable request volumes (we provide rate limiting — configure it)

## Secure defaults

`@n3rd-ai/mcp` ships with security-hardened defaults:

- CORS reflects the request `Origin` only when set, otherwise uses `*` for OPTIONS preflight compatibility
- Request body size limited to 4 MB (HTTP 413 on excess)
- Request timeouts: 30s headers, 60s request, 120s idle (slowloris-safe)
- Security headers: `X-Content-Type-Options: nosniff`, `Cache-Control: no-store`
- Session TTL and `maxSessions` cap with 503 backpressure
- Rate limiter bucket cap (100K entries) to prevent memory DoS
- `trustProxy` defaults to `false` (cannot be fooled by spoofed `X-Forwarded-For`)
- Internal error messages are not leaked through `toMcpError`
- Auth header builder escapes `\r`, `\n`, `"`, `\` (CWE-113 safe)

If you discover that one of these defaults is insufficient, that's also a report we want to hear.

## Supply chain

- All published packages are signed with [npm provenance](https://docs.npmjs.com/generating-provenance-statements)
- GitHub Actions workflows pin all third-party actions to commit SHAs
- Dependencies are scanned weekly via the `security.yml` workflow (npm audit, Trufflehog secret scan, SBOM generation, license compliance, OpenSSF Scorecard)
- Build scripts for native deps are explicitly allow-listed via `pnpm.onlyBuiltDependencies`

## PGP key

PGP is not currently supported. Use GitHub Security Advisories or email for confidential reports.
