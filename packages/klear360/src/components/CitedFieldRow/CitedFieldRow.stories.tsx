import { Title } from '@storybook/addon-docs/blocks';
import type { StoryFn, Meta } from '@storybook/react-vite';
import { within, userEvent, expect, fn } from 'storybook/test';
import React from 'react';
import { CitedFieldRow } from './';
import type { CitedFieldRowProps, CitedFieldRowSource } from './types';
import { getCitedFieldRowArgTypes } from './citedFieldRowStorybook';
import { CitedFieldRowInlineInput } from './citedFieldRowStoryHelpers';
import { Card, CardBody, CardHeader, CardHeaderLeading } from '~components/Card';
import { Box } from '~components/Box';
import { Text, Code } from '~components/Typography';
import { Switch } from '~components/Switch';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';

type CitedFieldRowStoryArgs = CitedFieldRowProps & {
  /** Story-only: show column header row above the playground row. */
  showColumnHeader?: boolean;
};

const Page = (): React.ReactElement => (
  <StoryPageWrapper
    componentName="CitedFieldRow"
    componentDescription="Label/value rows for extracted data with optional document or Track & Trace citations. Stack rows inside a Card to form a field table; use `CitedFieldRow.Header` for column labels and `isEditable` + `control` for in-place editing."
    note="Citation selection (`isCiteTarget`, chip `isActive`) and filters like cite-muted are owned by the page — the row renders state and reports `onCiteClick`."
  >
    <Title>Usage</Title>
    <Sandbox showConsole>
      {`
import { Card, CardBody, CitedFieldRow } from '@klear/klear360/components';

function App() {
  return (
    <Card overflow="hidden">
      <CardBody padding="spacing.0" role="table">
        <CitedFieldRow.Header />
        <CitedFieldRow
          label="MBOL"
          value="MEDUXYZ123456"
          source={{ label: 'BOL p1' }}
          onCiteClick={(source) => scrollToSource(source)}
        />
      </CardBody>
    </Card>
  );
}
      `}
    </Sandbox>
  </StoryPageWrapper>
);

const recipeStoryParameters = {
  controls: { disable: true },
  actions: { disable: true },
} as const;

export default {
  title: 'Components/CitedFieldRow',
  component: CitedFieldRow,
  tags: ['autodocs'],
  args: {
    label: 'MBOL',
    value: 'MEDUXYZ123456',
    isEditable: false,
    isCiteMuted: false,
    isCiteTarget: false,
    validationState: 'none',
    errorText: 'MBOL format is invalid — expected SCAC plus 7 digits.',
    successText: 'MBOL matches SCAC + 7 digit format.',
    showColumnHeader: true,
    source: {
      label: 'BOL p1',
      variant: 'doc',
      isActive: false,
      accessibilityLabel: 'View MBOL on BOL, page 1',
    },
    onCiteClick: fn(),
  },
  argTypes: getCitedFieldRowArgTypes(),
  parameters: {
    docs: { page: Page },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
  },
} as Meta<CitedFieldRowStoryArgs>;

const PlaygroundTemplate: StoryFn<CitedFieldRowStoryArgs> = ({
  isEditable,
  value,
  validationState,
  errorText,
  successText,
  source,
  showColumnHeader = true,
  control: _control,
  ...rowProps
}) => {
  const [editValue, setEditValue] = React.useState(String(value ?? ''));

  React.useEffect(() => {
    setEditValue(String(value ?? ''));
  }, [value]);

  const resolvedSource = source && typeof source === 'object' && source.label ? source : undefined;
  const showError = validationState === 'error' && Boolean(errorText);
  const showSuccess = validationState === 'success' && Boolean(successText);

  return (
    <Box maxWidth="480px">
      <Card overflow="hidden">
        <CardBody padding="spacing.0" role="table">
          {showColumnHeader ? <CitedFieldRow.Header /> : null}
          <CitedFieldRow
            {...rowProps}
            value={isEditable ? undefined : value}
            isEditable={isEditable}
            validationState={validationState}
            errorText={showError ? errorText : undefined}
            successText={showSuccess ? successText : undefined}
            source={isEditable ? undefined : resolvedSource}
            control={
              isEditable ? (
                <CitedFieldRowInlineInput
                  label={rowProps.label}
                  value={editValue}
                  onChange={setEditValue}
                />
              ) : undefined
            }
          />
        </CardBody>
      </Card>
    </Box>
  );
};

/**
 * Interactive playground — use **Controls** for props, **Actions** for `onCiteClick`, and run
 * **Interactions** / **Accessibility** from the addon panels.
 */
export const Default = PlaygroundTemplate.bind({});
Default.storyName = 'Default';

Default.play = async ({ args, canvasElement }) => {
  if (!args.source || args.isEditable || args.isCiteMuted) {
    return;
  }
  const canvas = within(canvasElement);
  const chipName = args.source.accessibilityLabel ?? args.source.label;
  const chip = canvas.getByRole('button', { name: chipName });
  await userEvent.click(chip);
  await expect(args.onCiteClick).toHaveBeenCalled();
};

/**
 * Multiple grounded rows in one table — the common shipping-field pattern.
 */
export const FieldTable: StoryFn = () => (
  <Box maxWidth="480px">
    <Card overflow="hidden">
      <CardBody padding="spacing.0" role="table">
        <CitedFieldRow.Header />
        <CitedFieldRow
          label="MBOL"
          value="MEDUXYZ123456"
          source={{ label: 'BOL p1', accessibilityLabel: 'View MBOL on BOL, page 1' }}
          onCiteClick={fn()}
        />
        <CitedFieldRow
          label="Vessel"
          value="EVER GIVEN"
          source={{
            label: 'Track & Trace',
            variant: 'trace',
            accessibilityLabel: 'View Vessel on Track & Trace',
          }}
          onCiteClick={fn()}
        />
      </CardBody>
    </Card>
  </Box>
);
FieldTable.parameters = recipeStoryParameters;

/**
 * Typical section layout: `CardHeader` names the document or section, `CitedFieldRow.Header`
 * labels the columns, then rows follow. Wrap the header and rows in `role="table"` (as here) so
 * screen readers treat the block as a field table.
 */
export const WithHeader: StoryFn = () => (
  <Box maxWidth="480px">
    <Card overflow="hidden">
      <CardHeader marginBottom="spacing.0" paddingBottom="spacing.3" showDivider={false}>
        <CardHeaderLeading title="Bill of lading" subtitle="Extracted fields" />
      </CardHeader>
      <CardBody padding="spacing.0" role="table">
        <CitedFieldRow.Header />
        <CitedFieldRow
          label="MBOL"
          value="MEDUXYZ123456"
          source={{ label: 'BOL p1', accessibilityLabel: 'View MBOL on BOL, page 1' }}
        />
        <CitedFieldRow
          label="Vessel"
          value="EVER GIVEN"
          source={{ label: 'Track & Trace', variant: 'trace' }}
        />
        <CitedFieldRow label="Notes" value="Added manually by broker" />
      </CardBody>
    </Card>
  </Box>
);
WithHeader.parameters = recipeStoryParameters;

/**
 * A value that hasn't been extracted at all renders as an em dash, in a muted color and regular
 * weight - never a blank cell, which would be easy to misread as a loading state.
 */
export const MissingValue: StoryFn = () => (
  <Box maxWidth="480px">
    <Card overflow="hidden">
      <CardBody padding="spacing.0">
        <CitedFieldRow label="HBOL" value={null} />
      </CardBody>
    </Card>
  </Box>
);
MissingValue.parameters = recipeStoryParameters;

/**
 * A row with no `source` at all is "ungrounded" - no citation chip, and the label reads in the
 * same muted color as a missing value, since the row has no provenance to point to.
 */
export const Ungrounded: StoryFn = () => (
  <Box maxWidth="480px">
    <Card overflow="hidden">
      <CardBody padding="spacing.0">
        <CitedFieldRow label="Notes" value="Added manually by broker" />
      </CardBody>
    </Card>
  </Box>
);
Ungrounded.parameters = recipeStoryParameters;

/**
 * `isCiteMuted` dims a row and disables its chip - driven by a filter elsewhere on the page (e.g.
 * "show only ungrounded fields"), not by the component itself. Toggle the switch below to see it
 * applied to a grounded row.
 */
export const CiteMuted: StoryFn = () => {
  const [isCiteMuted, setIsCiteMuted] = React.useState(true);

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4" maxWidth="480px">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <Box as="label" display="flex" alignItems="center" gap="spacing.2">
        <Switch
          isChecked={isCiteMuted}
          onChange={() => setIsCiteMuted((prev) => !prev)}
          accessibilityLabel="Show only ungrounded fields"
        />
        <Text size="small">Show only ungrounded fields</Text>
      </Box>
      <Card overflow="hidden">
        <CardBody padding="spacing.0">
          <CitedFieldRow
            label="MBOL"
            value="MEDUXYZ123456"
            isCiteMuted={isCiteMuted}
            source={{ label: 'BOL p1' }}
          />
        </CardBody>
      </Card>
    </Box>
  );
};
CiteMuted.parameters = recipeStoryParameters;

/**
 * `isCiteTarget` marks the row whose citation is the one currently being viewed - an accent
 * background and a left accent border on the value cell, so it's clear at a glance which value
 * the document/event on screen belongs to.
 */
export const CiteTarget: StoryFn = () => (
  <Box maxWidth="480px">
    <Card overflow="hidden">
      <CardBody padding="spacing.0">
        <CitedFieldRow label="MBOL" value="MEDUXYZ123456" source={{ label: 'BOL p1' }} />
        <CitedFieldRow
          label="Shipper"
          value="ACME Exports Inc."
          isCiteTarget
          source={{ label: 'BOL p1', isActive: true }}
        />
      </CardBody>
    </Card>
  </Box>
);
CiteTarget.parameters = recipeStoryParameters;

/**
 * When `validationState` is `'error'`, the value cell uses negative feedback styling and
 * `errorText` appears under the value (or under `control` while editing). Citation chips still
 * render for grounded rows so the user can verify the cited source against the invalid value.
 */
export const ValidationError: StoryFn = () => (
  <Box maxWidth="480px">
    <Card overflow="hidden">
      <CardBody padding="spacing.0">
        <CitedFieldRow
          label="MBOL"
          value="MEDUXYZ123456"
          validationState="error"
          errorText="MBOL format is invalid — expected SCAC plus 7 digits."
          source={{ label: 'BOL p1' }}
        />
        <CitedFieldRow
          label="HBOL"
          value={null}
          validationState="error"
          errorText="HBOL is required before filing."
        />
      </CardBody>
    </Card>
  </Box>
);
ValidationError.parameters = recipeStoryParameters;

/**
 * When `validationState` is `'success'`, the value cell uses positive feedback styling,
 * `successText`, and a check icon — aligned with `TextInput` success hints.
 */
export const ValidationSuccess: StoryFn = () => (
  <Box maxWidth="480px">
    <Card overflow="hidden">
      <CardBody padding="spacing.0" role="table">
        <CitedFieldRow.Header />
        <CitedFieldRow
          label="MBOL"
          value="MEDUXYZ123456"
          validationState="success"
          successText="MBOL matches SCAC + 7 digit format."
          source={{ label: 'BOL p1' }}
        />
      </CardBody>
    </Card>
  </Box>
);
ValidationSuccess.parameters = recipeStoryParameters;

/**
 * `isEditable` swaps the value cell for `control` - the citation chip only ever applies to the
 * read-only display, so it disappears while a field is being edited.
 */
export const Editable: StoryFn = () => {
  const [mbol, setMbol] = React.useState('MEDUXYZ123456');

  return (
    <Box maxWidth="480px">
      <Card overflow="hidden">
        <CardBody padding="spacing.0">
          <CitedFieldRow
            label="MBOL"
            isEditable
            control={<CitedFieldRowInlineInput label="MBOL" value={mbol} onChange={setMbol} />}
          />
        </CardBody>
      </Card>
    </Box>
  );
};
Editable.parameters = recipeStoryParameters;

export const EditableValidationError: StoryFn = () => {
  const [hbol, setHbol] = React.useState('');

  return (
    <Box maxWidth="480px">
      <Card overflow="hidden">
        <CardBody padding="spacing.0" role="table">
          <CitedFieldRow.Header />
          <CitedFieldRow
            label="HBOL"
            isEditable
            validationState="error"
            errorText="HBOL is required before filing."
            control={<CitedFieldRowInlineInput label="HBOL" value={hbol} onChange={setHbol} />}
          />
        </CardBody>
      </Card>
    </Box>
  );
};
EditableValidationError.parameters = recipeStoryParameters;

/**
 * Every modifier state together, and a worked example of `onCiteClick` driving which chip reads
 * as active and which row is the current citation target - exactly the division of labor the
 * component is designed around: it renders and reports clicks, the page owns what "selected"
 * means.
 */
export const AllStates: StoryFn = () => {
  const fields = [
    {
      label: 'MBOL',
      value: 'MEDUXYZ123456',
      source: { label: 'BOL p1' } as CitedFieldRowSource,
      validationState: 'error' as const,
      errorText: 'MBOL format is invalid — expected SCAC plus 7 digits.',
    },
    {
      label: 'Vessel',
      value: 'EVER GIVEN',
      source: { label: 'Track & Trace', variant: 'trace' } as CitedFieldRowSource,
    },
    { label: 'HBOL', value: null, source: undefined },
    { label: 'Notes', value: 'Added manually by broker', source: undefined },
  ];
  const [activeLabel, setActiveLabel] = React.useState<string | null>(null);
  const [isCiteMuted, setIsCiteMuted] = React.useState(false);

  return (
    <Box display="flex" flexDirection="column" gap="spacing.4" maxWidth="480px">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <Box as="label" display="flex" alignItems="center" gap="spacing.2">
        <Switch
          isChecked={isCiteMuted}
          onChange={() => setIsCiteMuted((prev) => !prev)}
          accessibilityLabel="Show only ungrounded fields"
        />
        <Text size="small">Show only ungrounded fields</Text>
      </Box>
      <Card overflow="hidden">
        <CardHeader marginBottom="spacing.0" paddingBottom="spacing.3" showDivider={false}>
          <CardHeaderLeading title="Shipment fields" />
        </CardHeader>
        <CardBody padding="spacing.0" role="table">
          <CitedFieldRow.Header />
          {fields.map((field) => (
            <CitedFieldRow
              key={field.label}
              label={field.label}
              value={field.value}
              validationState={'validationState' in field ? field.validationState : undefined}
              errorText={'errorText' in field ? field.errorText : undefined}
              isCiteMuted={isCiteMuted}
              isCiteTarget={activeLabel === field.label}
              source={
                field.source
                  ? { ...field.source, isActive: activeLabel === field.label }
                  : undefined
              }
              onCiteClick={() => setActiveLabel(field.label)}
            />
          ))}
        </CardBody>
      </Card>
      <Text size="small" color="surface.text.gray.muted">
        Click a citation chip above - it becomes <Code size="small">is-active</Code>, and its row
        becomes the <Code size="small">isCiteTarget</Code>.
      </Text>
    </Box>
  );
};
AllStates.parameters = recipeStoryParameters;
