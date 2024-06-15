<script setup lang="ts"></script>

<template>
  <el-empty>
    <template #image>
      <slot name="image" />
    </template>

    <template #description>
      <slot name="description">
        <p>没有数据！</p>
      </slot>
    </template>

    <template #default>
      <slot name="default" />
    </template>
  </el-empty>
</template>

<style scoped lang="scss"></style>
