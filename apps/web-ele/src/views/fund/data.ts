const dateList = [
  {
    label: '日',
    value: 1,
  },
  {
    label: '周',
    value: 7,
  },
  {
    label: '月',
    value: 30,
  },
];

const yearList = [
  {
    label: '2',
    value: 2,
  },
  {
    label: '5',
    value: 5,
  },
  {
    label: '10',
    value: 10,
  },
  {
    label: '15',
    value: 15,
  },
  {
    label: '20',
    value: 20,
  },
];

const dataList = [
  {
    label: '天弘沪深300ETF联接A',
    code: '000961',
    purchaseFeeRate: 0.1,
    annualManagementFeeRate: 0.6,
    dailyAmount: 2000,
    annualReturnRate: 6,
    date: 30,
    years: 10,
    id: 'eD9_C8tdDCv_6acWkuALO',
    principal: 240_000,
    purchaseFee: 240,
    managementFee: 8669.53,
    profit: 75_260.63,
    finalAmount: 315_260.63,
    type: '股票',
  },
  {
    label: '易方达中证500ETF联接A',
    code: '007028',
    purchaseFeeRate: 0.05,
    annualManagementFeeRate: 0.2,
    dailyAmount: 1000,
    annualReturnRate: 6,
    date: 30,
    years: 10,
    id: 'MLp2IhfUD6YBTyAEskr-4',
    principal: 120_000,
    purchaseFee: 60,
    managementFee: 1463.59,
    profit: 41_105.17,
    finalAmount: 161_105.17,
    type: '股票',
  },
  {
    label: '摩根标普500指数(QDII)A',
    code: '017641',
    purchaseFeeRate: 0.12,
    annualManagementFeeRate: 0.65,
    dailyAmount: 10,
    annualReturnRate: 6,
    date: 1,
    years: 10,
    id: 'ZjK4LhNpfSjwlhgVqUBnF',
    principal: 36_500,
    purchaseFee: 43.8,
    managementFee: 1425.88,
    profit: 11_308.95,
    finalAmount: 47_808.95,
    type: '海外股票',
  },
  {
    label: '天弘纳斯达克100指数(QDII)A',
    code: '018043',
    purchaseFeeRate: 0.1,
    annualManagementFeeRate: 0.6,
    dailyAmount: 50,
    annualReturnRate: 13,
    date: 1,
    years: 10,
    id: 'fVgqixZLVWbWszsLOGsgF',
    principal: 182_500,
    purchaseFee: 182.5,
    managementFee: 8446.25,
    profit: 163_204.21,
    finalAmount: 345_704.21,
    type: '海外股票',
  },
];

const typeList = ['海外股票', '股票', '债券'];

const columns = [
  {
    prop: 'name',
    label: '基金名称',
    align: 'center',
    slot: 'name',
  },
  {
    prop: 'code',
    label: '基金代码',
    align: 'center',
    slot: 'code',
  },
  {
    prop: 'type',
    label: '基金类型',
    align: 'center',
    slot: 'type',
  },
  {
    prop: 'purchaseFeeRate',
    label: '申购费/次',
    align: 'center',
    slot: 'purchaseFeeRate',
  },
  {
    prop: 'annualManagementFeeRate',
    label: '管理费/年',
    align: 'center',
    slot: 'annualManagementFeeRate',
  },
  {
    prop: 'annualReturnRate',
    label: '年化收益率',
    align: 'center',
    slot: 'annualReturnRate',
  },
  {
    prop: 'dailyAmount',
    label: '定投/金额/年',
    align: 'center',
    slot: 'dailyAmount',
  },
  {
    prop: 'purchaseFee',
    label: '申购费',
    align: 'center',
    slot: 'purchaseFee',
  },
  {
    prop: 'managementFee',
    label: '管理费',
    align: 'center',
    slot: 'managementFee',
  },
  {
    prop: 'principal',
    label: '本金',
    align: 'center',
    slot: 'principal',
  },
  {
    prop: 'profit',
    label: '收益',
    align: 'center',
    slot: 'profit',
  },
  {
    prop: 'finalAmount',
    label: '最终资产',
    align: 'center',
    slot: 'finalAmount',
  },
];

export { columns, dataList, dateList, typeList, yearList };
