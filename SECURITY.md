# Security Policy

## Supported Scope

This repository is an open-source application template and MVP reference. Security fixes are welcome, especially around:

- authentication
- tenant isolation
- webhook verification
- secret handling
- audit logging
- dependency upgrades

## Reporting a Vulnerability

Please do not open public issues for sensitive vulnerabilities.

Instead:

1. Use GitHub private vulnerability reporting if enabled for the repository.
2. If private reporting is unavailable, contact the repository owner directly through GitHub and include:
   - a clear description
   - reproduction steps
   - impact
   - any suggested mitigation

## Response Expectations

- We will try to acknowledge reports quickly.
- We will try to validate impact before discussing remediation publicly.
- Once a fix is ready, the goal is to publish a patch and then disclose enough detail for users to protect themselves.

## Operational Notes

Anyone deploying this project is responsible for:

- setting strong secrets
- protecting production logs
- configuring HTTPS
- validating WhatsApp credentials
- using a real shared rate limiter in multi-instance production
- complying with privacy, data retention, and local regulations

## Out of Scope

The following are usually not treated as library-level vulnerabilities unless they expose a concrete weakness in the codebase:

- insecure local development defaults that are documented as examples
- leaked secrets in someone else's deployment
- Meta, OpenAI, Vercel, or database-provider account misconfiguration outside this repository
