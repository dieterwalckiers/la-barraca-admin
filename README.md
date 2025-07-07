# Deployment
sanity build
sanity graphql deploy

(to deploy graphql to a specific dataset (production / development), update the api.dataset in sanity.json)

sanity deploy (make sure that at this point, the dataset is set to production in sanity.json)

# restoring datasets
sanity dataset delete development
sanity dataset export production .
sanity dataset import ./production.tar.gz development

# secret management
DON'T commit .env file (duh)

# studio v2 vs v3
2025-07-07 WIP migration on `upgrade-to-studio-v3` branch
note: when deploying for v2 vs v3, make sure you're using the correct sanity cli

