import { CitedFieldRow as CitedFieldRowRoot } from './CitedFieldRow';
import { CitedFieldRowHeader } from './CitedFieldRowHeader';

const CitedFieldRow = Object.assign(CitedFieldRowRoot, {
  Header: CitedFieldRowHeader,
});

export { CitedFieldRow, CitedFieldRowHeader };
export * from './types';
