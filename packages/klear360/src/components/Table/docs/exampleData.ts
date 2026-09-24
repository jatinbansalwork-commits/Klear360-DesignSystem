import type { TableData } from '../types';
import type { BadgeProps } from '~components/Badge';

const pickRandom = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const formatDate = (date: Date | undefined): string | undefined =>
  date?.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

// Modeled on a real "Transaction Manager" table (Actions, Transaction ID, Company Name, ... a
// dozen more columns) - the single dataset shared by every Table doc/example so the design
// system's documentation shows one consistent, realistic data point throughout.
type TransactionTableItem = {
  id: string;
  transactionId: string;
  companyName: string;
  cbpTransactionNumber: string;
  username: string;
  transactionState: string;
  etd: Date;
  vesselName: string;
  filingDate: Date;
  shipmentNumber: string;
  mbl: string;
  hbl: string;
  countryOfExport: string;
  // The fields below aren't needed by most Table docs/examples (hence living after the original
  // set rather than being reshuffled in) - they exist so a genuinely wide table (15-20+ columns,
  // see TableWideDatasetExample) still uses this one shared dataset instead of forking a new one.
  portOfLoading: string;
  portOfDischarge: string;
  containerNumber: string;
  grossWeightKg: number;
  hsCode: string;
  brokerName: string;
  entryType: string;
  invoiceNumber: string;
  currency: string;
  incoterm: string;
};

const transactionStates = ['SENT', 'IN PROCESS', 'REJECTED', 'NEW', 'RETRANSMIT', 'ACCEPTED'];
const companyNames = [
  'TEST COMPANY 1',
  'SHENZHEN BRIGHT PACKAGING',
  'MEKONG EXPORTS LTD',
  'PACIFIC RIM TRADING CO',
  'BASF AGRICULTURAL SOLUTIONS INC',
  'NORTHSTAR LOGISTICS INC',
  'GLOBAL-PAK',
  'ILLUMINATE USA LLC',
];
const usernames = ['ISF OPS', 'KAMAL SINGH', 'RAJA KUMAR', 'MARIA LOPEZ', 'ENTRY AUTOMATION QA'];
const vesselNames = [
  'CMA CGM G. WASHINGTON, 9436722',
  'MAERSK ESSEX, 9632153',
  'EVER ENVOY, 9240500',
  'MSC OSCAR, 9703318',
  'EVER LISSOME, 9593878',
  'APL LE HAVRE, 9350381',
  'WAN HAI 512, 9457822',
];
const countriesOfExport = [
  'KR - Korea, Republic of',
  'TH - Thailand',
  'SG - Singapore',
  'TW - Taiwan',
  'CN - China',
  'IN - India',
  'BE - Belgium',
  'VN - Vietnam',
];
const portsOfLoading = [
  'Busan',
  'Laem Chabang',
  'Singapore',
  'Kaohsiung',
  'Shenzhen',
  'Nhava Sheva',
];
const portsOfDischarge = [
  'Los Angeles',
  'Long Beach',
  'Savannah',
  'New York',
  'Houston',
  'Oakland',
];
const hsCodes = ['8471.30', '6109.10', '9403.60', '3926.90', '8517.62', '4202.92'];
const brokerNames = [
  'Pacific Gateway Brokers',
  'Continental Customs Co',
  'Harborline Trade Services',
];
const entryTypes = ['Formal', 'Informal'];
const currencies = ['USD', 'EUR', 'GBP'];
const incoterms = ['FOB', 'CIF', 'EXW', 'DDP'];

const randomDate = (): Date =>
  new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);

const createTransactionTableNodes = (count: number): TransactionTableItem[] =>
  Array.from({ length: count }, (_, index) => {
    const countryCode = pickRandom(countriesOfExport).slice(0, 2);
    return {
      id: (index + 1).toString(),
      transactionId: `ISF-021D-${index + 1}`,
      companyName: pickRandom(companyNames),
      cbpTransactionNumber: `ISF-${Math.floor(Math.random() * 90000000) + 10000000}`,
      username: pickRandom(usernames),
      transactionState: pickRandom(transactionStates),
      etd: randomDate(),
      vesselName: pickRandom(vesselNames),
      filingDate: randomDate(),
      shipmentNumber: `${countryCode}-${Math.floor(Math.random() * 900) + 100}`,
      mbl: `MEDU${Math.floor(Math.random() * 9000000) + 1000000}`,
      hbl: `SGN${Math.floor(Math.random() * 900000) + 100000}`,
      countryOfExport: pickRandom(countriesOfExport),
      portOfLoading: pickRandom(portsOfLoading),
      portOfDischarge: pickRandom(portsOfDischarge),
      containerNumber: `MSCU${Math.floor(Math.random() * 9000000) + 1000000}`,
      grossWeightKg: Math.floor(Math.random() * 18000) + 500,
      hsCode: pickRandom(hsCodes),
      brokerName: pickRandom(brokerNames),
      entryType: pickRandom(entryTypes),
      invoiceNumber: `INV-${Math.floor(Math.random() * 900000) + 100000}`,
      currency: pickRandom(currencies),
      incoterm: pickRandom(incoterms),
    };
  });

const createTransactionTableData = (count: number): TableData<TransactionTableItem> => ({
  nodes: createTransactionTableNodes(count),
});

const getTransactionStateColor = (state: string): BadgeProps['color'] => {
  if (state === 'ACCEPTED') return 'positive';
  if (state === 'SENT' || state === 'IN PROCESS' || state === 'RETRANSMIT') return 'notice';
  if (state === 'REJECTED') return 'negative';
  return 'neutral';
};

// `label`/`value` pairs for every `transactionStates` entry above - the one place that mapping is
// spelled out, so every example whose `transactionState` column filter renders as a dropdown
// (`filterConfig: { type: 'multiselect' }`) offers the exact same options in the exact same order.
const transactionStateOptions = transactionStates.map((state) => ({
  label: state
    .toLowerCase()
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' '),
  value: state,
}));

export {
  formatDate,
  createTransactionTableNodes,
  createTransactionTableData,
  getTransactionStateColor,
  transactionStateOptions,
};
export type { TransactionTableItem };
