# PostHog Error Tracking

> ⚠️ **Needs your attention**
> - Configure the external production deployment so `POSTHOG_API_KEY` is available as a protected/masked secret during `npm run build`.
> - Provide `POSTHOG_PROJECT_ID` and `NEXT_PUBLIC_POSTHOG_HOST` to that production build under those exact names.
> - Provide `NEXT_PUBLIC_POSTHOG_KEY` to the production Next.js build so the deployed browser bundle initializes analytics.
> - Ensure the production build has release-name and release-version context, either through the checked-out `.git` directory or the deployment provider's repository/branch/commit variables; no deploy pipeline is checked into this repository.

## What you still need to do

1. Create a personal API key with the **Source map upload** preset at [https://us.posthog.com/settings/user-api-keys](https://us.posthog.com/settings/user-api-keys), unless the key already stored in the app environment was created with that preset and has the required Error Tracking write scope.
2. In the settings for the external CI/deployment provider, add `POSTHOG_API_KEY` as a protected/masked secret for the production build. Add `POSTHOG_PROJECT_ID` with value `320658` and `NEXT_PUBLIC_POSTHOG_HOST` with the PostHog host value already configured for this project. Also add `NEXT_PUBLIC_POSTHOG_KEY` so Next.js embeds the public client key during the production build. This repository has no checked-in CI pipeline, so the provider and its exact settings location must be supplied by whoever owns deployment.
3. Make the production build preserve `.git`, or pass the deployment provider's native repository/branch/commit variables through the build so source-map uploads receive release context. If a Docker build is introduced, pass those git variables through the build stage as the appropriate build arguments/environment variables; pass `POSTHOG_API_KEY` only through the builder's secret mechanism, never as a Docker `ARG` or `ENV`.

## What is configured now

- The browser SDK is initialized in `instrumentation-client.ts` and already has exception capture enabled. Uncaught browser errors and unhandled promise rejections are captured by `posthog-js`.
- Next.js framework errors that reach the App Router global boundary are captured in `app/global-error.tsx` with `posthog.captureException(error)`. This complements the SDK's automatic exception capture.
- The project now has the PostHog Next.js build integration in `next.config.ts`, and `@posthog/nextjs-config` is installed. The project started without the PostHog build integration; it now has source-map upload configuration as well as the existing browser SDK.

## Source maps

Source-map upload is wired in these files:

- `next.config.ts`
- `package.json`
- `package-lock.json`

The production build command is `npm run build`. It is set up to generate source maps, inject matching chunk IDs, upload symbol sets, and delete uploaded maps afterward. Every production build will perform that upload once `POSTHOG_API_KEY`, `POSTHOG_PROJECT_ID`, and `NEXT_PUBLIC_POSTHOG_HOST` are available where the build runs. The repository has no checked-in CI or deployment pipeline, so the external deployment must provide those values and release context.

## Release linking

Release linking was not wired because no deploy path or production pipeline could be traced in this repository. Local runs, tests, and pull-request builds are unchanged and do not receive a release ID. The external production deploy should preserve or provide repository/branch/commit context to the source-map upload so the eventual deployment setup can associate errors with the correct release.

## Verify in PostHog

Trigger an error in the deployed app, then inspect the first captured exception at:

[https://us.posthog.com/project/320658/error_tracking](https://us.posthog.com/project/320658/error_tracking)

Uploaded symbol sets appear at:

[https://us.posthog.com/project/320658/error_tracking/configuration](https://us.posthog.com/project/320658/error_tracking/configuration)

After the external production build has run successfully, confirm that the exception has a readable, symbolicated stack trace and that the uploaded symbol set is visible in the Error Tracking configuration.
