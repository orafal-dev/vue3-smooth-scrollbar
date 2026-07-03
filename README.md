# vue3-smooth-scrollbar

[![Test build](https://github.com/rafalolszewski94/vue3-smooth-scrollbar/actions/workflows/test-build.yml/badge.svg)](https://github.com/rafalolszewski94/vue3-smooth-scrollbar/actions/workflows/test-build.yml)

Based on [vue-smooth-scrollbar](https://github.com/BlackBP/vue-smooth-scrollbar)

## Requirements

- Vue 3.5+
- smooth-scrollbar 8.8+

## Installation

```bash
npm install vue3-smooth-scrollbar smooth-scrollbar
# or
bun add vue3-smooth-scrollbar smooth-scrollbar
```

## Usage

### Custom main scrollbar

**App.vue**

```vue
<template>
  <Scrollbar>
    <!-- content -->
  </Scrollbar>
</template>

<script setup lang="ts">
import Scrollbar from "vue3-smooth-scrollbar"
import "vue3-smooth-scrollbar/styles.css"
</script>
```

Add `smooth-scrollbar-body` to `<body>` and `smooth-scrollbar-root` to the element that wraps the scrollbar (for example `#app`):

```html
<body class="smooth-scrollbar-body">
  <div id="app" class="smooth-scrollbar-root"></div>
</body>
```

Or apply the equivalent rules in your own CSS:

```css
body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  height: 100vh;
  width: 100%;
  overflow: auto;
}
```

`smooth-scrollbar` still injects track and thumb styles when the component mounts. You only need a custom setup if you call `SmoothScrollbar.detachStyle()` from `smooth-scrollbar`.

## Development

This project uses [Bun](https://bun.sh) for package management.

### Project setup

```bash
bun install
```

### Dev server with hot reload

```bash
bun run dev
```

### Build library for production

```bash
bun run build
```

### Lint

```bash
bun run lint
```

### Typecheck

```bash
bun run typecheck
```

## Releasing

Releases are managed with [Changesets](https://github.com/changesets/changesets).

1. After your changes are merged, add a changeset:

   ```bash
   bun run changeset
   ```

   Choose the semver bump (`patch`, `minor`, or `major`) and write a short summary.

2. Commit the generated file in `.changeset/` and open a PR.

3. When changesets land on `master`, GitHub Actions opens a **Version Packages** PR that bumps `package.json` and updates `CHANGELOG.md`.

4. Merging that PR triggers the release workflow, which builds and publishes to npm.

Required repository secrets:

- `NPM_TOKEN` — npm access token with publish rights

`GITHUB_TOKEN` is provided automatically for release PRs and GitHub releases.
