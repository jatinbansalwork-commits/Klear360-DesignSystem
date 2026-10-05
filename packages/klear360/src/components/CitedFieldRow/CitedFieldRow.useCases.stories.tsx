import type { Meta, StoryFn } from '@storybook/react-vite';
import React from 'react';
import { CitedFieldRow } from './';
import { Card, CardBody } from '~components/Card';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { CitedFieldRowInlineInput } from './citedFieldRowStoryHelpers';

export default {
  title: 'Components/CitedFieldRow/Use Cases',
  tags: ['autodocs'],
  parameters: {
    controls: { disable: true },
    actions: { disable: true },
    docs: {
      description: {
        component:
          'Field-table rows for extracted data — read-only display, in-row edit via borderless `control` (see **Editable** story), row-level validation (success / error), and citation **chips** (doc, trace, active).',
      },
    },
  },
} as Meta;

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.ReactElement => (
  <Box display="flex" flexDirection="column" gap="spacing.3">
    <Text size="large" weight="semibold" color="feedback.text.information.intense">
      {title}
    </Text>
    <Card>
      <CardBody padding="spacing.0" role="table">
        <CitedFieldRow.Header />
        {children}
      </CardBody>
    </Card>
  </Box>
);

const EditableRow = ({
  label,
  defaultValue,
  validationState = 'none',
  errorText,
  successText,
}: {
  label: string;
  defaultValue: string;
  validationState?: 'none' | 'error' | 'success';
  errorText?: string;
  successText?: string;
}): React.ReactElement => {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <CitedFieldRow
      label={label}
      isEditable
      validationState={validationState}
      errorText={errorText}
      successText={successText}
      control={<CitedFieldRowInlineInput label={label} value={value} onChange={setValue} />}
    />
  );
};

/**
 * Parallels **TextInput → Showcase - All Variants**: read-only, edit, validation, icons, and chips
 * in one scrollable reference.
 */
export const Showcase: StoryFn = () => (
  <Box display="flex" flexDirection="column" gap="spacing.8" maxWidth="520px">
    <Section title="Read-only (default)">
      <CitedFieldRow label="MBOL" value="MEDUXYZ123456" source={{ label: 'BOL p1' }} />
    </Section>

    <Section title="Input (editable row)">
      <EditableRow label="MBOL" defaultValue="MEDUXYZ123456" />
    </Section>

    <Section title="Success">
      <CitedFieldRow
        label="MBOL"
        value="MEDUXYZ123456"
        validationState="success"
        successText="MBOL matches SCAC + 7 digit format."
        source={{ label: 'BOL p1' }}
      />
      <EditableRow
        label="Vessel"
        defaultValue="EVER GIVEN"
        validationState="success"
        successText="Verified against Track & Trace."
      />
    </Section>

    <Section title="Error">
      <CitedFieldRow
        label="MBOL"
        value="INVALID"
        validationState="error"
        errorText="MBOL format is invalid — expected SCAC plus 7 digits."
        source={{ label: 'BOL p1' }}
      />
      <EditableRow
        label="HBOL"
        defaultValue=""
        validationState="error"
        errorText="HBOL is required before filing."
      />
    </Section>

    <Section title="Chips (citation sources)">
      <CitedFieldRow
        label="MBOL"
        value="MEDUXYZ123456"
        source={{ label: 'BOL p1', variant: 'doc' }}
      />
      <CitedFieldRow
        label="Vessel"
        value="EVER GIVEN"
        source={{ label: 'Track & Trace', variant: 'trace' }}
      />
      <CitedFieldRow
        label="Shipper"
        value="ACME Exports Inc."
        source={{ label: 'BOL p1', variant: 'doc', isActive: true }}
        isCiteTarget
      />
    </Section>
  </Box>
);
Showcase.storyName = 'Showcase — Input, Success, Error, Chips';
