<script lang="ts" setup>
import type { TableColumnCtx } from 'element-plus';

import { ElTableColumn } from 'element-plus';

interface ColumnProps extends TableColumnCtx {
  slot?: string;
}

interface Props {
  column?: ColumnProps;
}
withDefaults(defineProps<Props>(), {
  column: undefined,
});
</script>
<template>
  <ElTableColumn v-if="column" v-bind="column">
    <template #default="{ row }">
      <slot v-if="column.slot" :name="column.slot" :row="row"></slot>
      <template v-else>
        {{ row[column.prop] }}
      </template>
    </template>
  </ElTableColumn>
</template>
