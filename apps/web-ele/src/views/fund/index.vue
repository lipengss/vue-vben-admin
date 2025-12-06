<script setup lang="ts">
import type { TableColumnCtx } from 'element-plus';

import type { VNode } from 'vue';

import { computed, h, onMounted, reactive } from 'vue';

import { Page } from '@vben/common-ui';
import { formatNumber, Local } from '@vben/utils';

import { Delete } from '@element-plus/icons-vue';
import {
  ElButton,
  ElCard,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElOption,
  ElRadioButton,
  ElRadioGroup,
  ElSelect,
  ElSpace,
  ElTable,
  ElTableColumn,
  ElText,
} from 'element-plus';
import { nanoid } from 'nanoid';

import TableHeader from '#/components/TableHeader/index.vue';
import {
  columns,
  dataList,
  dateList,
  typeList,
  yearList,
} from '#/views/fund/data';

import RateChart from './rateChart.vue';

const state = reactive({
  form: {
    label: '',
    code: '',
    type: '',
    purchaseFeeRate: 0.12,
    annualManagementFeeRate: 0.6,
    dailyAmount: 1000,
  },
  tableList: dataList,
  selectedType: 'name',
});

interface DCAParams {
  dailyAmount: number; // 每期投入的金额
  years: number; // 投资年数
  date: number; // 定投频率
  purchaseFeeRate: number; // 申购费（次）
  annualReturnRate: number; // 年化收益率
  annualManagementFeeRate: number; // 年化管理费
  id: string; // 唯一标识
  principal: number; // 本金
  purchaseFee: number; // 申购费
  managementFee: number; // 管理费
  profit: number; // 总收益
  finalAmount: number; // 最终资产
}

interface SummaryMethodProps<
  T extends Record<string, any> = Record<string, any>,
> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

const getSummaries = (param: SummaryMethodProps) => {
  const { columns, data } = param;
  const sums: (string | VNode)[] = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = h('div', {}, ['合计']);
      return;
    }
    const values = data.map((item) => Number(item[column.property]));
    sums[index] = [
      'finalAmount',
      'managementFee',
      'principal',
      'profit',
      'purchaseFee',
    ].includes(column.property)
      ? `${formatNumber(
          (() => {
            let total = 0;
            for (const v of values) {
              const n = Number(v);
              if (!Number.isNaN(n)) {
                total += n;
              }
            }
            return total;
          })(),
        )}`
      : 'N/A';
    // if (!values.every((value) => Number.isNaN(value))) {
    // 	sums[index] = `$ ${values.reduce((prev, curr) => {
    // 		const value = Number(curr)
    // 		if (!Number.isNaN(value)) {
    // 			return prev + curr
    // 		} else {
    // 			return prev
    // 		}
    // 	}, 0)}`
    // } else {
    // 	sums[index] = 'N/A'
    // }
  });

  return sums;
};

function handleAdd() {
  state.tableList.push({
    label: '',
    code: '',
    purchaseFeeRate: 0.12,
    annualManagementFeeRate: 0.6,
    dailyAmount: 1000,
    annualReturnRate: 6,
    date: 30,
    years: 10,
    id: nanoid(),
    principal: 0,
    purchaseFee: 0,
    managementFee: 0,
    profit: 0,
    finalAmount: 0,
    type: '',
  });
  update();
}

function handleDelete(row: DCAParams) {
  state.tableList = state.tableList.filter((item) => item.id !== row.id);
  update();
}

function calculateDCA(row: DCAParams) {
  let {
    dailyAmount,
    years,
    date,
    purchaseFeeRate,
    annualReturnRate,
    annualManagementFeeRate,
  } = row;
  purchaseFeeRate /= 100;
  annualManagementFeeRate /= 100;
  annualReturnRate /= 100;
  const daysPerYear = Math.round(365 / date);
  let principal = 0;
  let totalPurchaseFee = 0;
  let totalManagementFee = 0;
  let asset = 0;
  for (let year = 1; year <= years; year++) {
    const yearlyInvestment = dailyAmount * daysPerYear;
    const yearlyPurchaseFee = yearlyInvestment * purchaseFeeRate;
    const netInvestment = yearlyInvestment - yearlyPurchaseFee;

    principal += yearlyInvestment;
    totalPurchaseFee += yearlyPurchaseFee;

    const assetAtStart = asset;

    // 收益计算（关键修正点）
    const growthFromOld = assetAtStart * annualReturnRate;
    const growthFromNew = netInvestment * annualReturnRate * 0.5;

    const assetBeforeFee =
      assetAtStart + netInvestment + growthFromOld + growthFromNew;

    // 年平均资产收管理费
    const avgAsset = (assetAtStart + assetBeforeFee) / 2;

    const managementFee = avgAsset * annualManagementFeeRate;

    totalManagementFee += managementFee;

    asset = assetBeforeFee - managementFee;
  }
  row.principal = Number(principal.toFixed(2));
  row.purchaseFee = Number(totalPurchaseFee.toFixed(2));
  row.managementFee = Number(totalManagementFee.toFixed(2));
  row.finalAmount = Number(asset.toFixed(2));
  row.profit = Number((asset - principal).toFixed(2));
  update();
}

function update() {
  Local.set('productList', state.tableList);
}

const rateData = computed(() => {
  const list =
    state.selectedType === 'name'
      ? state.tableList.map((n) => n.label)
      : typeList;
  const field = state.selectedType === 'name' ? 'label' : 'type';
  return list
    .map((name: string) => {
      const dataList = state.tableList.filter((item) => item[field] === name);
      let sumByType = 0;
      for (const item of dataList) {
        sumByType += Number(item.dailyAmount) || 0;
      }
      return {
        name,
        value: sumByType,
      };
    })
    .filter((item) => item.value);
});

onMounted(() => {
  if (Local.get('productList')) {
    state.tableList = Local.get('productList');
  }
});
</script>
<template>
  <Page auto-content-height>
    <TableHeader title="基金定投计算" :columns="columns">
      <template #operation>
        <ElButton type="primary" @click="handleAdd">新增基金</ElButton>
      </template>
    </TableHeader>
    <ElTable
      class="mb-4"
      :data="state.tableList"
      style="width: 100%"
      border
      show-summary
      :summary-method="getSummaries"
    >
      <ElTableColumn
        prop="label"
        label="基金名称"
        align="center"
        fixed="left"
        :width="180"
      >
        <template #default="{ row }">
          <ElInput v-model="row.label" size="small" placeholder="基金名称" />
        </template>
      </ElTableColumn>
      <ElTableColumn prop="code" label="基金代码" align="center" :width="100">
        <template #default="{ row }">
          <ElInput v-model="row.code" size="small" placeholder="基金代码" />
        </template>
      </ElTableColumn>
      <ElTableColumn prop="type" label="基金类型" align="center" :width="120">
        <template #default="{ row }">
          <ElSelect v-model="row.type" size="small" placeholder="请选择">
            <ElOption
              v-for="item in typeList"
              :key="item"
              :label="item"
              :value="item"
              @change="calculateDCA(row)"
            />
          </ElSelect>
        </template>
      </ElTableColumn>
      <ElTableColumn
        prop="purchaseFeeRate"
        label="申购费/次"
        align="center"
        :width="120"
      >
        <template #default="{ row }">
          <ElSpace direction="vertical">
            <ElInputNumber
              style="width: 90px"
              v-model="row.purchaseFeeRate"
              size="small"
              controls-position="right"
              :step="0.1"
              :min="0"
              :max="100"
              @change="calculateDCA(row)"
            >
              <template #suffix>%</template>
            </ElInputNumber>
          </ElSpace>
        </template>
      </ElTableColumn>
      <ElTableColumn
        prop="annualManagementFeeRate"
        label="管理费/年"
        align="center"
        :width="120"
      >
        <template #default="{ row }">
          <ElInputNumber
            style="width: 90px"
            v-model="row.annualManagementFeeRate"
            size="small"
            controls-position="right"
            :min="0"
            :max="100"
            :step="0.1"
            @change="calculateDCA(row)"
          >
            <template #suffix>%</template>
          </ElInputNumber>
        </template>
      </ElTableColumn>
      <ElTableColumn label="年化收益" align="center" :width="120">
        <template #default="{ row }">
          <ElInputNumber
            style="width: 90px"
            v-model="row.annualReturnRate"
            size="small"
            controls-position="right"
            :min="0"
            :max="100"
            @change="calculateDCA(row)"
          >
            <template #suffix>%</template>
          </ElInputNumber>
        </template>
      </ElTableColumn>
      <ElTableColumn
        prop="dailyAmount"
        label="定投/金额/年"
        align="center"
        :width="220"
      >
        <template #default="{ row }">
          <ElInput
            v-model.number="row.dailyAmount"
            controls-position="right"
            :min="0"
            :max="1000000"
            size="small"
            @change="calculateDCA(row)"
          >
            <template #prepend>
              <ElSelect
                v-model="row.date"
                style="width: 50px"
                size="small"
                @change="calculateDCA(row)"
              >
                <ElOption
                  v-for="item in dateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </template>
            <template #append>
              <ElSelect
                v-model="row.years"
                style="width: 50px"
                size="small"
                @change="calculateDCA(row)"
              >
                <ElOption
                  v-for="year in yearList"
                  :key="year.value"
                  :label="year.label"
                  :value="year.value"
                />
              </ElSelect>
            </template>
          </ElInput>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="purchaseFee" label="申购费" align="center">
        <template #default="{ row }">
          <ElText type="warning">
            {{ formatNumber(row.purchaseFee) }}
          </ElText>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="managementFee" label="管理费" align="center">
        <template #default="{ row }">
          <ElText type="danger">
            {{ formatNumber(row.managementFee) }}
          </ElText>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="principal" label="本金" align="center">
        <template #default="{ row }">
          <ElText type="info">{{ formatNumber(row.principal) }}</ElText>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="profit" label="收益" align="center">
        <template #default="{ row }">
          <ElText type="primary">{{ formatNumber(row.profit) }}</ElText>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="finalAmount" label="最终资产" align="center">
        <template #default="{ row }">
          <ElText type="success">
            {{ formatNumber(row.finalAmount) }}
          </ElText>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" align="center" :width="60">
        <template #default="{ row }">
          <ElButton
            type="danger"
            circle
            size="small"
            @click="handleDelete(row)"
          >
            <ElIcon>
              <Delete />
            </ElIcon>
          </ElButton>
        </template>
      </ElTableColumn>
    </ElTable>
    <ElCard header="资产配额" shadow="never" header-class="my-header-card">
      <template #header>
        <span>资产配额</span>
        <ElRadioGroup v-model="state.selectedType" size="small">
          <ElRadioButton value="name" label="基金名称" />
          <ElRadioButton value="type" label="资产类型" />
        </ElRadioGroup>
      </template>
      <RateChart :data="rateData" />
    </ElCard>
  </Page>
</template>
<style lang="scss">
.my-header-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px;
}
</style>
