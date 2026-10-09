# Deployment
Always deploy with `npm run deploy` (not `sanity deploy`): its predeploy check refuses a missing or invalid `SANITY_STUDIO_API_KEY`.
Built/deployed studios always use the production dataset (`sanity.config.ts`); only `npm run dev` uses development.

`SANITY_STUDIO_API_KEY` is baked into the bundle and must equal `API_SHARED_SECRET` on the labarraca-next Netlify site (and the `LABARRACA_API_KEY` GitHub secret used by the reminder cron).
Netlify stores it as a secret, so it cannot be read back (`netlify env:get` prints an error sentence instead). If you don't have the value, rotate it everywhere at once (fish, from `labarraca-next/`):

    set -l k (openssl rand -hex 24)
    netlify env:set API_SHARED_SECRET $k --secret --force --context production deploy-preview branch-deploy
    and env GH_TOKEN=(gh auth token --user dieterwalckiers) gh secret set LABARRACA_API_KEY -R dieterwalckiers/labarraca-next --body $k
    and netlify api createSiteBuild --data '{"site_id":"2c240f40-6964-497b-9fc1-58e4458c42a0"}' | jq -r .id
    and env SANITY_STUDIO_API_KEY=$k npm --prefix ../la-barraca-admin run deploy

Symptom of a key mismatch: bookings/reactions tools get 401 from `www.labarraca.be/api/*` (e.g. clicking a production does nothing).

GraphQL (`npm run graphql:deploy`) is not used by labarraca-next.

# restoring datasets
sanity dataset delete development
sanity dataset export production .
sanity dataset import ./production.tar.gz development

# studio v2 vs v3
2025-07-07 WIP migration on `upgrade-to-studio-v3` branch
note: when deploying for v2 vs v3, make sure you're using the correct sanity cli

# procedure to create sheet (db) for production

Login to drive.google.com with dieter@labarraca.be, navigate to production folder
Ensure season folder exists:
    Get season ID from sanity: open season and get it from URL
    Ensure folder exists in meta file (note 2025-08-01: seasonID-folderID mapping in meta file seems not in use)
Get production key from sanity: season: open Inspect
Create `prod-<production key>` file in season folder, add boilerplate ("meta" tab and empty "reasons" tab)
Grab spreadsheet ID from url, fill it into "Google Sheet ID" field in production in sanity
