<script setup lang="ts">

</script>

<template>
  <div class="loading" role="status" aria-live="polite">
    <div class="box" />
  </div>
</template>

<style scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.1);
}

/* 暗黑模式适配 */
html.dark .loading {
  background-color: rgba(0, 0, 0, 0.3);
}

.box {
  position: relative;
  width: 2em;
  height: 2em;
  border: 3px solid var(--el-color-primary);
  overflow: hidden;
  animation: spin 3s ease infinite;
}

.box::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  width: 2em;
  height: 2em;
  background-color: var(--el-color-primary);
  opacity: 0.75;
  transform-origin: center bottom;
  transform: scaleY(1);
  animation: fill 3s linear infinite;
}

@keyframes spin {

  50%,
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fill {

  25%,
  50% {
    transform: scaleY(0);
  }

  100% {
    transform: scaleY(1);
  }
}
</style>
