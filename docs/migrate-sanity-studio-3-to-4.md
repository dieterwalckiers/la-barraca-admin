# Sanity Studio v3 to v4 Migration

This document describes the migration of La Barraca Admin from Sanity Studio v3 to v4, completed in December 2024.

## Overview

Sanity Studio v4 is a minimal upgrade with few breaking changes. The primary change involves updating the Node.js runtime requirement. According to Sanity's documentation: "The vast majority of studios and developers won't see a difference."

## Summary of Changes

### Package Updates

| Package | Before | After |
|---------|--------|-------|
| `sanity` | ^3.97.1 | ^4.0.0 |
| `@sanity/vision` | ^3.0.0 | ^4.0.0 |
| `@sanity/ui` | ^2.0.0 | ^3.0.0 |
| `react` | ^18.2.0 | ^19.0.0 |
| `react-dom` | ^18.2.0 | ^19.0.0 |

### Node.js Requirement

| Setting | Before | After |
|---------|--------|-------|
| `engines.node` | >=18.0.0 | >=20.19.0 |

## Migration Steps

### 1. Update Node.js

Ensure Node.js v20.19 or later is installed:

```bash
node --version
# Should output v20.19.0 or higher
```

### 2. Update package.json

Update the `engines` field:

```json
"engines": {
  "node": ">=20.19.0"
}
```

Update dependencies:

```json
{
  "dependencies": {
    "sanity": "^4.0.0",
    "@sanity/vision": "^4.0.0",
    "@sanity/ui": "^3.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Verify Build

```bash
npm run build
```

## Breaking Changes

### Node.js Version

The only breaking change in Sanity v4 is the Node.js requirement. The `sanity` CLI from version 4.0.0 onward requires Node.js v20.19 or later.

**Impact:** Local development environments and CI/CD pipelines must use Node.js v20+.

## React 19 Upgrade

React 19 was upgraded alongside Sanity v4 as it's now the recommended version. Key changes in React 19:

### Removed APIs

These deprecated APIs were removed in React 19:
- `propTypes` and `defaultProps` for functions (use ES6 default parameters instead)
- Legacy Context (`contextTypes`, `getChildContext`)
- String refs (use `createRef` or `useRef`)
- `ReactDOM.findDOMNode` (use refs instead)

### New Features

- **React Compiler** - Automatic memoization (optional)
- **Actions** - New APIs for form handling
- **`use()` hook** - For reading resources in render
- **`ref` as prop** - No need for `forwardRef` in most cases

### If Issues Occur

If React 19 causes compatibility issues with custom components:

1. Check for deprecated API usage (propTypes, string refs, etc.)
2. Review third-party dependencies for React 19 compatibility
3. As a fallback, you can temporarily pin React 18:
   ```json
   "react": "^18.3.1",
   "react-dom": "^18.3.1"
   ```

## @sanity/ui v3 Upgrade

The `@sanity/ui` package was upgraded from v2 to v3 for compatibility with Sanity v4.

**Impact:** Minimal - the API remains largely the same. If you use custom components built with `@sanity/ui`, verify they still render correctly.

## What Doesn't Change

- Studio functionality remains consistent
- Studios continue operating as compiled single-page applications
- No schema changes required
- No configuration changes required
- All custom plugins continue to work
- Content Lake and APIs remain unchanged

## NPM Scripts

All scripts remain unchanged:

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

### Node.js Version Error

**Symptom:** Error about Node.js version requirement

**Solution:** Upgrade Node.js to v20.19 or later:
```bash
# Using nvm
nvm install 20
nvm use 20

# Verify
node --version
```

### Peer Dependency Warnings

**Symptom:** npm warnings about peer dependencies

**Solution:** These are usually safe to ignore. If a specific package causes issues, check for updates:
```bash
npm outdated
npm update <package-name>
```

### React 19 Compatibility

**Symptom:** Component errors after upgrade

**Solution:**
1. Check browser console for specific error messages
2. Look for deprecated React API usage
3. Verify third-party packages support React 19
4. Consider adding the [React 19 codemod](https://react.dev/blog/2024/04/25/react-19-upgrade-guide) for automated fixes

## Verification Checklist

After migration, verify:

- [x] `npm run build` completes without errors
- [x] `npm run dev` starts the development server
- [x] All custom plugins appear in the top bar (Reservaties, Reacties)
- [x] Content editing works correctly
- [x] PerformanceCalendar component renders and saves
- [x] GraphQL deploy works: `npm run graphql:deploy:dev`

## References

- [Sanity v3 to v4 Migration Guide](https://www.sanity.io/docs/help/v3-to-v4)
- [React 19 Upgrade Guide](https://react.dev/blog/2024/04/25/react-19-upgrade-guide)
- [@sanity/ui Changelog](https://github.com/sanity-io/ui/releases)
