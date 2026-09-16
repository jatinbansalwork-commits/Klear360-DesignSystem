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

export {
  formatDate,
  createTransactionTableNodes,
  createTransactionTableData,
  getTransactionStateColor,
};
export type { TransactionTableItem };
