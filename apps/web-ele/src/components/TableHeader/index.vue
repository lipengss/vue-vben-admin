<script setup lang="ts">
import type { TableColumnCtx } from 'element-plus';

import { Setting } from '@element-plus/icons-vue';
import {
  ElButton,
  ElCheckbox,
  ElCheckboxGroup,
  ElIcon,
  ElPopover,
  ElRadioButton,
  ElRadioGroup,
  ElScrollbar,
  ElSpace,
  ElText,
} from 'element-plus';

interface Props {
  title?: string;
  columns?: TableColumnCtx[];
}
const props = withDefaults(defineProps<Props>(), {
  title: '',
  columns: () => [],
});
</script>
<template>
  <div class="table-header flex items-center justify-between">
    <ElSpace>
      <ElText>{{ props.title }}</ElText>
    </ElSpace>
    <ElSpace>
      <slot name="operation"></slot>
      <ElPopover placement="bottom" title="列设置" :width="300">
        <template #reference>
          <ElButton circle>
            <ElIcon>
              <Setting />
            </ElIcon>
          </ElButton>
        </template>
        <ElScrollbar>
          <ElCheckboxGroup>
            <div
              v-for="column in props.columns"
              :key="column.prop"
              class="flex items-center justify-between"
            >
              <ElCheckbox :label="column.label" :value="column.prop" />
              <ElRadioGroup v-model="column.fixed" size="small">
                <ElRadioButton value="left" title="固定到左边">
                  左边
                </ElRadioButton>
                <ElRadioButton value="right" title="固定到右边">
                  右边
                </ElRadioButton>
              </ElRadioGroup>
              <!-- <ElSpace>
                <ElButton size="small" title="固定到左边">左边</ElButton>
                <ElButton size="small" title="固定到右边">右边</ElButton>
              </ElSpace> -->
            </div>
            <!-- <ElSpace
              v-for="column in props.columns"
              :key="column.prop"
              direction="vertical"
            >

              <ElCheckbox :label="column.label" :value="column.prop" />
            </ElSpace> -->
          </ElCheckboxGroup>
        </ElScrollbar>
      </ElPopover>
    </ElSpace>
  </div>
</template>
<style lang="scss" scoped>
.table-header {
  padding: 12px;
  background-color: var(--el-table-header-bg-color);
  border: 1px solid var(--el-table-border);
  border-bottom: none;
}
</style>
