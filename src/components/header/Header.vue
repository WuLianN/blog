<template>
  <div class="header">
    <div class="header-left">

    </div>
    <div class="header-right">
      <div class="header-right__search">
        <Search />
      </div>

      <div class="header-right__btn">
        <el-button plain type="primary" v-isBrower @click="writeArticle">写文章</el-button>
      </div>
      <div class="header-right__switch">
        <Switch />
      </div>

      <div class="header-right__picker">
        <theme-picker />
      </div>

      <div class="header-right__login">
        <template v-if="hasUserInfo">
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
import { useNavigateTo } from '@/hooks/web/useNavigate'
import { createDraft } from '@/api/drafts'
import { useUserStore } from '@/store/modules/user'
import { computed } from 'vue'

const store = useUserStore()

const hasUserInfo = computed(() => {
  return store.userInfo.user_name
})

async function writeArticle() {
  const { draft_id: id } = await createDraft()
  useNavigateTo(`/drafts/${id}`)
}

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

    &__search,
    &__switch,
    &__picker,
    &__btn {
      padding: 0 12px;
    }

    &__login {
      padding: 0 50px 0 12px;
    }
  }
}

@media screen and (max-width: 992px) {
  .header-right__login {
    padding: 0 20px 0 12px;
  }
}
</style>