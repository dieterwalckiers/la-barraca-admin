# Deployment
sanity build
sanity graphql deploy

(to deploy graphql to a specific dataset (production / development), update the api.dataset in sanity.json)


sanity deploy



restoring datasets
sanity dataset delete development
sanity dataset export production .
sanity dataset import ./production.tar.gz development
