# Project rules

- SOC decisions live in abstract_decisions (draft → confirmed → emailed); the public programme reads accepted talks only via get_public_schedule() once app_config.schedule_published_at is set — keeps unpublished decisions and scores private.
- Unit tests live in tests/ and run with `bun test tests/` — keeps bun:test types out of the app typecheck.
