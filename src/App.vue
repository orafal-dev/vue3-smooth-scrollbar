<script setup lang="ts">
import SmoothScrollbar from "./SmoothScrollbar.vue"
</script>

<template>
  <div class="smooth-scrollbar-root">
    <SmoothScrollbar>
      <div class="box" />
      <div class="box" />
      <div class="box" />
    </SmoothScrollbar>
  </div>
</template>

<style>
html,
body {
  height: 100%;
}

body {
  margin: 0;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  width: 100%;
}

.box {
  width: 100%;
  height: 800px;
}

.box:nth-child(1) {
  background-color: #8fffe4;
}

.box:nth-child(2) {
  background-color: #e0ceff;
}

.box:nth-child(3) {
  background-color: #ffdd9c;
}
</style>
