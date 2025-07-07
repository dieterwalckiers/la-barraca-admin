# Sanity V3 Migration Notes

## Completed Steps

1. ✅ Updated all Sanity packages to v3 versions
2. ✅ Created `sanity.config.js` for v3 configuration
3. ✅ Created `sanity.cli.js` for CLI configuration
4. ✅ Migrated desk structure to v3 format
5. ✅ Created schema index file for v3
6. ✅ Updated npm scripts to use v3 commands
7. ✅ Successfully installed dependencies

## Custom Plugins that Need Migration

The following custom plugins are currently in v2 format and need to be migrated to v3:

1. **bookings** - Reservations management plugin
2. **reactions** - Reactions tracking plugin  
3. **stats** - Statistics plugin
4. **my-studio-logo** - Custom studio logo

### Migration Required

These plugins use the old v2 plugin API with:
- `part:@sanity/base/router`
- Component-based plugin structure
- Old import patterns

For v3, they need to be converted to:
- Tool plugins using `definePlugin`
- New routing system
- Updated imports

### Example Migration Pattern

```javascript
// v2 plugin
export default {
  title: "Plugin Name",
  name: "plugin-name",
  router: route("/:param"),
  icon: IconComponent,
  component: MainComponent,
};

// v3 plugin
import {definePlugin} from 'sanity'

export const myPlugin = definePlugin({
  name: 'plugin-name',
  tools: [
    {
      name: 'plugin-name',
      title: 'Plugin Name',
      icon: IconComponent,
      component: MainComponent,
      route: {
        path: ':param'
      }
    }
  ]
})
```

## Next Steps

1. Test the current setup without custom plugins to ensure base functionality works
2. Migrate each custom plugin to v3 format
3. Add the migrated plugins to `sanity.config.js`
4. Test all functionality

## Running the Admin Panel

```bash
# Development
npm run dev

# Build for production
npm run build

# Deploy
npm run deploy
```