<script setup lang="ts">
import { ref } from 'vue'
import { CollectionTag, Link, Menu, Setting, UserFilled } from '@element-plus/icons-vue'

const tabPosition = ref<any>('left')
</script>

<template>
  <div class="setting">
    <el-tabs :tab-position="tabPosition" class="tabs" type="border-card">
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon :size="20">
              <UserFilled />
            </el-icon>
            <span>个人信息</span>
          </span>
        </template>
        <personal-info />
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon :size="20">
              <Menu />
            </el-icon>
            <span>菜单管理</span>
          </span>
        </template>
        <menu-manage />
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon :size="20">
              <CollectionTag />
            </el-icon>
            <span>标签管理</span>
          </span>
        </template>
        <tag-manage />
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon :size="20">
              <Setting />
            </el-icon>
            <span>账户设置</span>
          </span>
        </template>
        <account-setting />
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <span class="custom-tabs-label">
            <el-icon :size="20">
              <Link />
            </el-icon>
            <span>关联账户</span>
          </span>
        </template>
        <associated-account />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped lang="scss">
.setting {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;

  padding: 30px;
}

.tabs {
  width: 800px;
}

.el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

.custom-tabs-label .el-icon {
  vertical-align: middle;
}

.custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
</style>
