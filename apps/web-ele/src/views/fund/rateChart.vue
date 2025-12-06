<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { reactive, ref, watch } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

const props = withDefaults(
  defineProps<{
    data?: { name: string; value: number }[];
  }>(),
  {
    data: () => [],
  },
);

const state: any = reactive({
  title: {
    show: true,
    text: '',
    left: 'center',
    top: '34%',
    textStyle: {
      color: '#666',
      fontSize: 14,
    },
    subtext: '每月定投',
  },
  legend: {
    bottom: '1%',
    left: 'center',
  },
  series: [
    {
      animationDelay() {
        return Math.random() * 100;
      },
      animationEasing: 'exponentialInOut',
      animationType: 'scale',
      avoidLabelOverlap: false,
      color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
      data: props.data,
      emphasis: {
        label: {
          fontSize: '12',
          fontWeight: 'bold',
          show: true,
        },
      },
      itemStyle: {
        borderColor: '#fff',
        borderRadius: 8,
        borderWidth: 6,
      },
      label: {
        formatter: ['{b|{d}%}', '{a|{b}}'].join('\n'),

        rich: {
          b: {
            color: '#666',
          },
          a: {
            lineHeight: 24,
          },
        },
      },
      name: '资产占比',
      radius: ['40%', '65%'],
      type: 'pie',
      bottom: '20%',
    },
  ],
  tooltip: {
    trigger: 'item',
  },
});
const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

watch(
  () => props.data,
  (newData) => {
    const total = newData.reduce((acc, cur) => acc + cur.value, 0);
    state.title.text = `${total} 元`;
    state.series[0].data = newData;
    renderEcharts(state);
  },
  { immediate: true, deep: true },
);
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
