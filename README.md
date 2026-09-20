# wnnaFuk

Invite-only date-scheduling app. Phase 1 ships infrastructure and a styled placeholder at [wnnafuk.robmclaughl.in](https://wnnafuk.robmclaughl.in).

## Local development

Requires Node **≥20.9.0** and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Static export build:

```bash
pnpm build   # output in out/
```

## Production deploy

Infrastructure is provisioned **once, manually** — never by CI:

```bash
chmod +x scripts/bootstrap.sh
./scripts/bootstrap.sh
```

Review the Terraform plan before confirming. Bootstrap sets GitHub Actions repository variables (`AWS_DEPLOY_ROLE_ARN`, `AWS_REGION`, `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`).

Day-to-day deploys: push to `main` → GitHub Actions builds, syncs `out/` to S3, invalidates CloudFront.

## Conventions

See [CLAUDE.md](./CLAUDE.md) for code style, architecture constraints, and product vocabulary.
