import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const citedFieldRowPropsCategory = {
  ROW: 'CitedFieldRow',
  SOURCE: 'Source',
  VALIDATION: 'Validation',
  EDITING: 'Editing',
} as const;

const getCitedFieldRowArgTypes = (): Record<string, unknown> => ({
  ...getStyledPropsArgTypes(),
  label: {
    control: 'text',
    description: 'Field name shown in the left column.',
    table: { category: citedFieldRowPropsCategory.ROW, type: { summary: 'string' } },
  },
  value: {
    control: 'text',
    description: 'Read-only value in the right column. Empty values render as an em dash.',
    table: { category: citedFieldRowPropsCategory.ROW, type: { summary: 'React.ReactNode' } },
  },
  isCiteMuted: {
    control: 'boolean',
    description: 'Dims the row and disables the citation chip (consumer-driven filter).',
    table: { category: citedFieldRowPropsCategory.ROW, defaultValue: { summary: 'false' } },
  },
  isCiteTarget: {
    control: 'boolean',
    description: 'Highlights the value cell as the active citation target.',
    table: { category: citedFieldRowPropsCategory.ROW, defaultValue: { summary: 'false' } },
  },
  onCiteClick: {
    description: 'Called when the citation chip is clicked. Receives the `source` object.',
    table: {
      category: citedFieldRowPropsCategory.ROW,
      type: { summary: '(source: CitedFieldRowSource) => void' },
    },
  },
  testID: {
    control: 'text',
    table: { category: citedFieldRowPropsCategory.ROW },
  },
  isEditable: {
    control: 'boolean',
    description: 'Swaps the value for `control` and hides the citation chip.',
    table: { category: citedFieldRowPropsCategory.EDITING, defaultValue: { summary: 'false' } },
  },
  control: {
    control: false,
    description: 'Editable field (e.g. `TextInput`) when `isEditable` is true.',
    table: { category: citedFieldRowPropsCategory.EDITING, type: { summary: 'React.ReactNode' } },
  },
  source: {
    control: 'object',
    description: 'Citation metadata. Omit for ungrounded rows (no chip).',
    table: {
      category: citedFieldRowPropsCategory.SOURCE,
      type: { summary: 'CitedFieldRowSource' },
    },
  },
  validationState: {
    control: 'select',
    options: ['none', 'error', 'success'],
    description: 'Applies feedback styling and hint text to the value cell.',
    table: {
      category: citedFieldRowPropsCategory.VALIDATION,
      defaultValue: { summary: 'none' },
    },
  },
  errorText: {
    control: 'text',
    description: 'Shown under the value when `validationState` is `error`.',
    table: { category: citedFieldRowPropsCategory.VALIDATION },
  },
  successText: {
    control: 'text',
    description: 'Shown under the value when `validationState` is `success`.',
    table: { category: citedFieldRowPropsCategory.VALIDATION },
  },
  showColumnHeader: {
    control: 'boolean',
    description: 'Story-only: renders `CitedFieldRow.Header` above the row in **Default**.',
    table: { category: citedFieldRowPropsCategory.ROW },
  },
});

export { citedFieldRowPropsCategory, getCitedFieldRowArgTypes };
