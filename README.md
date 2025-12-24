# Deployment
sanity build
npm run graphql:deploy (or `npm run graphql:deploy:dev` to target development)
sanity deploy

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
