# Contributing

Thanks for contributing. This project is intended to be a practical, production-minded open-source reference for building multi-tenant SaaS automation on top of WhatsApp and OpenAI.

## Before You Start

- Read the [README](./README.md) first.
- Use issues for bugs, feature proposals, and architecture discussions before opening large pull requests.
- Keep changes focused. Small, reviewable pull requests are preferred over broad refactors.

## What Contributions Are Most Helpful

- Multi-tenant safety improvements
- Better validation and error handling
- Webhook reliability and idempotency improvements
- Developer experience and docs
- Tests around auth, tenant isolation, and message processing
- UI polish that improves usability without adding unnecessary complexity
- Deployment and observability improvements

## What To Avoid

- Fake integrations or hardcoded secrets
- Major architectural rewrites without prior discussion
- Breaking public behavior without documenting the rationale
- Features that reduce tenant isolation or operational safety
- Code that makes the app more clever but less maintainable

## Development Setup

1. Fork the repo.
2. Clone your fork.
3. Copy `.env.example` to `.env`.
4. Start PostgreSQL locally or with Docker.
5. Run:

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run dev
```

## Pull Request Guidelines

- Keep pull requests scoped to one problem or feature.
- Add or update tests when behavior changes.
- Run the full verification set before submitting:

```bash
npm run lint
npm run test
npm run build
```

- Update the README or docs when setup, behavior, or deployment guidance changes.
- Explain tradeoffs in the PR description when the implementation is not obvious.

## Coding Expectations

- Prefer straightforward, typed code over abstraction-heavy patterns.
- Keep tenant-aware access control in shared server helpers or service layers.
- Validate inputs at the boundary with Zod.
- Avoid silently swallowing failures in integrations.
- Add comments only when they improve clarity.

## Commit Guidance

Good commit messages are short and concrete, for example:

- `Add webhook signature verification`
- `Improve tenant checks in lead updates`
- `Document Docker-based local setup`

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0 included in this repository.
