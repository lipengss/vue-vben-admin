export * from './helpers';
export * from '@vben-core/shared/cache';
export * from '@vben-core/shared/color';
export * from '@vben-core/shared/utils';

const LENGTH = 10_000;
// 当单位大于万时 显示万保留2位小数
export function formatNumber(num: number) {
  if (num >= LENGTH) {
    return `${(num / LENGTH).toFixed(2)}万`;
  }
  return num.toFixed(2);
}
