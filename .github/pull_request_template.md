## Description

<!-- Provide a clear, brief explanation of the changes introduced in this PR -->

## Type of Change

- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Database migration (forward-compatible DDL)
- [ ] Documentation update
- [ ] Refactor or dependency upgrade

## Quality & Verification Checklist

- [ ] **Lint & Typecheck**: `pnpm lint` and `pnpm typecheck` pass with zero warnings or errors.
- [ ] **Unit Tests**: `pnpm test` passes with all tests green.
- [ ] **End-to-End & A11y**: `pnpm test:e2e` passes with zero WCAG 2.2 AA axe violations.
- [ ] **Build Check**: `pnpm build` produces a clean production build without errors.
- [ ] **Security**: No secrets or private keys exposed; RLS enabled on all affected database tables.
- [ ] **Design & Accessibility**: Semantic landmarks, keyboard navigation verified, no information conveyed by color alone.
- [ ] **Documentation**: `README.md`, `.env.example`, or ADRs updated where applicable.
