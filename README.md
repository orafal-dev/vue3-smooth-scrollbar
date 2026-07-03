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

## API

### Component props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `infiniteLoading` | `boolean` | `false` | Enables infinite-scroll mode. Emits `loading` when the user scrolls near the bottom. |
| `loadThreshold` | `number` | `50` | Distance in pixels from the bottom edge that triggers the `loading` event (only when `infiniteLoading` is `true`). |
| `options` | `SmoothScrollbarOptions` | `{}` | [smooth-scrollbar](https://github.com/idiotWu/smooth-scrollbar) init options. Merged with the library defaults below. |
| `plugins` | `ScrollbarPlugin[]` | `[]` | smooth-scrollbar plugin classes to register before init. See [plugin docs](https://github.com/idiotWu/smooth-scrollbar/blob/develop/docs/plugin.md). |

### `options` prop

Pass these on the `options` prop. Values not provided use the defaults from this package (not necessarily smooth-scrollbar’s own defaults).

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `damping` | `number` | `0.1` | Momentum damping factor between `0` and `1`. Lower = smoother scroll, more paint frames. |
| `thumbMinSize` | `number` | `20` | Minimum scrollbar thumb size in pixels. |
| `renderByPixels` | `boolean` | `true` | Snap scroll position to whole pixels. Can improve performance. |
| `alwaysShowTracks` | `boolean` | `false` | Keep scrollbar tracks visible at all times. |
| `continuousScrolling` | `boolean` | `false` | Allow parent scroll containers to keep scrolling when this scrollbar reaches its edge. |
| `delegateTo` | `EventTarget \| null` | `null` | Element that receives wheel/touch events instead of the scroll container (useful with fixed headers). |
| `plugins` | `Record<string, unknown>` | `{}` | Per-plugin configuration object. Keys are plugin names. |

**Example**

```vue
<SmoothScrollbar
  :options="{
    damping: 0.08,
    alwaysShowTracks: true,
    delegateTo: document.body,
  }"
>
  <!-- content -->
</SmoothScrollbar>
```

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `scroll` | `ScrollStatus` | Fired on every scroll update. `status.offset.x` / `status.offset.y` are current positions; `status.limit.x` / `status.limit.y` are max scroll distances. |
| `loading` | `{ loaded: () => void, completed: () => void }` | Fired when infinite loading should fetch more data. Call `loaded()` when done, or `completed()` when there is no more data. |
| `endy` | — | Fired when vertical scroll reaches the bottom. |
| `endX` | — | Fired when horizontal scroll reaches the right edge. |

### Exposed methods (template ref)

Attach a `ref` to the component to call these methods from your script.

| Method | Arguments | Description |
|--------|-----------|-------------|
| `scrollTo` | `(x?, y?, duration?, options?)` | Scroll to absolute `x` / `y` position. `duration` in ms (default `300`). |
| `scrollIntoView` | `(element, options?)` | Scroll so a DOM element is visible. See [scrollIntoView options](#scrollintoview-options) below. |
| `getOffset` | `(axis?: 'x' \| 'y')` | Current scroll offset on the given axis. |
| `getLimit` | `(axis?: 'x' \| 'y')` | Maximum scroll offset on the given axis. |
| `isVisible` | `(element)` | Whether an element is visible inside the scroll container. |
| `update` | — | Recalculate scrollbar dimensions (call after content size changes). |
| `addListener` | `(listener)` | Add a smooth-scrollbar scroll listener. |
| `removeListener` | `(listener)` | Remove a scroll listener. |
| `removeAllListeners` | — | Remove all scroll listeners added via `addListener`. |
| `setLoaded` | — | Mark infinite loading as finished (used with `infiniteLoading`). |
| `setCompleted` | — | Mark infinite loading as fully completed (no more pages). |
| `resetInfLoad` | — | Reset infinite-loading state. |
| `focus` | — | Focus the scroll container. |
| `blur` | — | Blur the scroll container. |
| `scrollBar` | — | Raw [smooth-scrollbar](https://github.com/idiotWu/smooth-scrollbar) instance (`scrollTop`, `scrollLeft`, etc.). |

#### `scrollIntoView` options

| Option | Type | Description |
|--------|------|-------------|
| `alignToTop` | `boolean` | Align the element to the top of the viewport. |
| `onlyScrollIfNeeded` | `boolean` | Scroll only if the element is not already visible. |
| `offsetTop` | `number` | Extra top offset in pixels (e.g. fixed header height). |
| `offsetLeft` | `number` | Extra left offset in pixels. |
| `offsetBottom` | `number` | Extra bottom offset in pixels. |

#### `scrollTo` options

| Option | Type | Description |
|--------|------|-------------|
| `callback` | `() => void` | Called when the scroll animation finishes. |
| `easing` | `(percent: number) => number` | Custom easing function (`0`–`1`). |

### Examples

#### Scroll to an element on click

```vue
<template>
  <SmoothScrollbar ref="scrollbarRef">
    <button type="button" @click="handleScrollToTarget">Go to section</button>
    <div style="height: 1200px" />
    <section ref="targetRef">Target section</section>
  </SmoothScrollbar>
</template>

<script setup lang="ts">
import { ref } from "vue"
import SmoothScrollbar from "vue3-smooth-scrollbar"
import type { SmoothScrollbarExpose } from "vue3-smooth-scrollbar"

const scrollbarRef = ref<SmoothScrollbarExpose | null>(null)
const targetRef = ref<HTMLElement | null>(null)

const handleScrollToTarget = () => {
  if (!targetRef.value) return

  scrollbarRef.value?.scrollIntoView(targetRef.value, {
    alignToTop: true,
    offsetTop: 0,
  })
}
</script>
```

#### Read vertical scroll position

```vue
<SmoothScrollbar ref="scrollbarRef" @scroll="handleScroll">
  <!-- content -->
</SmoothScrollbar>
```

```ts
import type { ScrollStatus } from "smooth-scrollbar/interfaces/scrollbar"

const scrollY = ref(0)

const handleScroll = (status: ScrollStatus) => {
  scrollY.value = status.offset.y
}

// or read on demand via ref:
const y = scrollbarRef.value?.getOffset("y")
// or:
const y = scrollbarRef.value?.scrollBar?.scrollTop
```

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

- `NPM_TOKEN` — npm **Automation** access token with publish rights for this package

`GITHUB_TOKEN` is provided automatically for release PRs and GitHub releases.

### npm 2FA and CI

If the Release workflow fails with `EOTP` / "requires a one-time password", the npm account has 2FA enabled and the token is not allowed to publish from CI.

Create a new token at [npm → Access Tokens](https://www.npmjs.com/settings/~tokens):

1. **Classic token** → type **Automation** (bypasses 2FA for CI), or
2. **Granular token** → allow **Read and write** for `vue3-smooth-scrollbar`

Then update the GitHub secret:

```bash
gh secret set NPM_TOKEN --repo orafal-dev/vue3-smooth-scrollbar
```

Re-run the failed Release workflow after updating the secret.
