<template>
  <div class="header">
    <div class="header-left">
     
    </div>
    <div class="header-right">
      <div class="header-right__btn">
        <el-button plain type="primary" @click="() => useNavigateTo('/createCenter')">创作中心</el-button>
      </div>
      <div class="header-right__switch">
        <Switch />
      </div>

      <div class="header-right__login">
        <template v-if="token">
          <Login-Info />
        </template>
        <template v-else>
          <Login />
        </template>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { getToken } from '@/utils/auth';
import { useNavigateTo } from '@/hooks/web/useNavigate'

const token = getToken()
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  background-color: var(--app-header-bg-color);

  &-left,
  &-right {
    display: flex;
    align-items: center;
  }

  &-right {
    &__switch, &__login, &__btn  {
      padding: 0 15px;
    }
  }
}
</style>