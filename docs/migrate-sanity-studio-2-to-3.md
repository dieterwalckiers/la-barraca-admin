# Sanity Studio v2 to v3 Migration

This document describes the migration of La Barraca Admin from Sanity Studio v2 to v3, completed in December 2024.

## Overview

Sanity Studio v3 is a complete rewrite with breaking changes to the plugin API, configuration, and component architecture. The Content Lake and APIs remain unchanged, so existing data is unaffected.

## Summary of Changes

### Configuration Files

| Old (v2) | New (v3) | Notes |
|----------|----------|-------|
| `sanity.json` | `sanity.config.ts` | Main configuration, now TypeScript |
| `sanity.json` | `sanity.cli.ts` | CLI-specific configuration |
| `deskStructure.js` | `structure.ts` | Desk structure definition |
| `schemas/schema.js` | `schemas/index.ts` | Schema exports |

### Removed Files

- `sanity.json` - Replaced by `sanity.config.ts`
- `deskStructure.js` - Replaced by `structure.ts`
- `schemas/schema.js` - Replaced by `schemas/index.ts`
- `src/dashboardConfig.js` - Netlify widget removed
- `variableOverrides.css` - v2 theming file
- `plugins/shared/MaterialTableIcons.tsx` - No longer needed

### Removed Packages

These deprecated v2 packages were removed:

- `@sanity/base`
- `@sanity/components`
- `@sanity/core`
- `@sanity/dashboard`
- `@sanity/default-layout`
- `@sanity/default-login`
- `@sanity/desk-tool`
- `@sanity/rich-date-input`
- `@sanity/block-tools` (dev)
- `@sanity/schema` (dev)
- `sanity-plugin-dashboard-widget-netlify`
- `material-table` (replaced with @mui/material Table)
- `@material-ui/core` (deprecated, was dependency of material-table)
- `@mui/styles` (deprecated)

### Added/Updated Packages

- `sanity` - v3.97.1 (core package)
- `@sanity/vision` - v3 (GROQ query tool)
- `@sanity/ui` - v2 (UI components)
- `react` - Upgraded to ^18.2.0
- `react-dom` - Upgraded to ^18.2.0
- `styled-components` - ^6.1.15

## Breaking Changes

### 1. Part System Removed

The v2 `part:` import system was completely removed. All imports were migrated:

| v2 Import | v3 Replacement |
|-----------|----------------|
| `part:@sanity/base/client` | `useClient` hook from `sanity` |
| `part:@sanity/base/router` | `useRouter` hook from `sanity/router` |
| `part:@sanity/base/schema-creator` | Direct schema array export |
| `part:@sanity/components/loading/spinner` | `Spinner` from `@sanity/ui` |
| `part:@sanity/form-builder/patch-event` | `set()`, `unset()` from `sanity` |
| `withRouterHOC` | `useRouter()` hook |
| `StateLink` | `router.navigate()` |

### 2. Plugin Architecture

Custom plugins (bookings, reactions, stats) were converted from v2 tool format to v3 `definePlugin`:

```typescript
// v2
export default {
  title: "Reservaties",
  name: "bookings",
  router: route("/:selectedProductionSheetId"),
  icon: BookingsIcon,
  component: Bookings,
};

// v3
export const bookingsTool = definePlugin({
  name: 'bookings-tool',
  tools: [{
    name: 'bookings',
    title: 'Reservaties',
    icon: BookingsIcon,
    component: Bookings,
  }],
});
```

### 3. Schema Custom Input Components

The `inputComponent` property was replaced with `components.input`:

```javascript
// v2
{
  name: "performanceCalendar",
  type: "string",
  inputComponent: PerformanceCalendar,
}

// v3
{
  name: "performanceCalendar",
  type: "string",
  components: {
    input: PerformanceCalendar,
  },
}
```

### 4. CSS Modules

Vite (used by Sanity v3) requires CSS modules to have `.module.css` extension:

- `ProductionInfoPlugin.css` → `ProductionInfoPlugin.module.css`
- `performanceCalendar.css` → `performanceCalendar.module.css`
- `Performance.css` → `Performance.module.css`
- `ReactionsOverview.css` → `ReactionsOverview.module.css`

### 5. JSX File Extensions

Vite requires proper file extensions for JSX content:

- All `.js` files containing JSX were renamed to `.tsx`
- This includes schema files with preview components, icon files, etc.

### 6. Environment Detection

`import.meta.env.DEV` only works during Vite bundling, not in CLI commands. Changed to use `process.env`:

```typescript
// Use SANITY_STUDIO_DATASET env var for dataset selection
dataset: process.env.SANITY_STUDIO_DATASET || 'production',
```

## Risky Changes

### 1. material-table Replacement

**Risk Level: Medium**

The `material-table` package was replaced with native `@mui/material` Table components because:
- `material-table` depends on deprecated `@material-ui/pickers` which doesn't work with modern bundlers
- The package is no longer maintained

**Impact:**
- `ReactionsOverview.tsx` - Now uses read-only MUI Table (was editable)
- `Performance.tsx` - Uses MUI Table with dialog-based editing instead of inline editing

**If issues occur:**
- The edit/add/delete functionality in Performance.tsx uses dialogs instead of inline editing
- Verify that the `onUpdateVisitors` callback receives the correct data format

### 2. Router Changes

**Risk Level: Medium**

The routing system changed from HOC-based (`withRouterHOC`) to hook-based (`useRouter`).

**Impact:**
- `ProductionTree` now receives `onSelectProduction` prop instead of using `StateLink`
- Parent components (`Bookings.tsx`, `Reactions.tsx`) handle navigation

**If navigation doesn't work:**
- Check that `router.navigate()` is being called with correct state object
- Verify the router state is being read correctly: `(router.state as Record<string, string>)?.selectedProductionSheetId`

### 3. Custom Input Component API

**Risk Level: Low-Medium**

`PerformanceCalendar` was migrated to v3 custom input API.

**Changes:**
- Props changed from `{ value, onChange, type }` to `StringInputProps`
- `PatchEvent.from(set(value))` → `onChange(set(value))`

**If the calendar doesn't save:**
- Check browser console for errors
- Verify the `onChange` callback is being called with `set()` or `unset()`

### 4. React 18 Upgrade

**Risk Level: Low**

React was upgraded from 17 to 18.

**Potential issues:**
- Strict mode double-rendering in development
- Legacy lifecycle methods warnings

## NPM Scripts

```bash
# Development (uses development dataset)
npm run dev

# Production build
npm run build

# Deploy studio
npm run deploy

# Deploy GraphQL API (production)
npm run graphql:deploy

# Deploy GraphQL API (development)
npm run graphql:deploy:dev
```

## Troubleshooting

### "import.meta is not available" Error

**Symptom:** Error when running CLI commands like `sanity graphql deploy`

**Solution:** Use `process.env.SANITY_STUDIO_DATASET` instead of `import.meta.env.DEV`

### CSS Module Not Found

**Symptom:** Build error about missing CSS export

**Solution:** Ensure CSS files use `.module.css` extension and imports match

### JSX Parse Error

**Symptom:** "Failed to parse source for import analysis because the content contains invalid JS syntax"

**Solution:** Rename file from `.js` to `.tsx` if it contains JSX

### Port Already in Use

**Symptom:** "Error: Port 3333 is already in use"

**Solution:** Kill the existing process or use a different port:
```bash
sanity dev --port 3334
```

### Plugin Not Appearing

**Symptom:** Custom tool doesn't show in studio

**Solution:**
1. Verify plugin is imported in `sanity.config.ts`
2. Verify plugin is added to `plugins` array
3. Check browser console for errors

### GraphQL Deploy Fails

**Symptom:** `sanity graphql deploy` fails with configuration error

**Solution:**
1. Ensure `sanity.cli.ts` exists with correct projectId/dataset
2. Use environment variable: `SANITY_STUDIO_DATASET=development sanity graphql deploy`

### Spinner/Loading Component Error

**Symptom:** Import error for Spinner component

**Solution:** Use `@sanity/ui` components:
```typescript
import { Spinner, Flex, Text } from "@sanity/ui";

<Flex align="center" justify="center">
  <Spinner muted />
  <Text muted>Loading...</Text>
</Flex>
```

## File Structure After Migration

```
la-barraca-admin/
├── sanity.config.ts          # Main configuration
├── sanity.cli.ts             # CLI configuration
├── structure.ts              # Desk structure
├── global.d.ts               # TypeScript declarations
├── tsconfig.json             # TypeScript config
├── schemas/
│   ├── index.ts              # Schema exports
│   ├── production.js
│   ├── season.js
│   └── ...
├── components/
│   ├── PerformanceCalendar.tsx
│   ├── ApolloClientProvider.tsx
│   ├── config.ts
│   └── performanceCalendar.module.css
└── plugins/
    ├── bookings/
    │   ├── index.ts          # definePlugin export
    │   ├── Bookings.tsx
    │   └── performanceSet/
    ├── reactions/
    │   ├── index.ts
    │   ├── Reactions.tsx
    │   └── ...
    ├── stats/
    │   ├── index.ts
    │   └── Stats.tsx
    ├── shared/
    │   ├── helpers.js
    │   ├── ProductionTree/
    │   └── ProductionInfoPlugin.module.css
    └── my-studio-logo/
        └── Logo.tsx
```

## References

- [Sanity v3 Migration Guide](https://www.sanity.io/docs/migrating-from-v2)
- [Sanity v3 Plugin API](https://www.sanity.io/docs/developing-plugins)
- [Sanity Custom Input Components](https://www.sanity.io/docs/custom-input-components)
