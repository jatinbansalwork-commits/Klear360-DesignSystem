import type { StoryFn, Meta } from '@storybook/react-vite';
import React from 'react';
import { CitedFieldRow } from './CitedFieldRow';
import type { CitedFieldRowSource } from './types';
import { Card, CardBody } from '~components/Card';
import { Box } from '~components/Box';
import { Text, Code } from '~components/Typography';
import { Switch } from '~components/Switch';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

export default {
  title: 'Components/CitedFieldRow',
  component: CitedFieldRow,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
} as Meta<typeof CitedFieldRow>;

/**
 * A single row, as it's meant to be used: stacked with others inside a `Card`'s `CardBody` to
 * form a field table. `source` makes a value "grounded" and attaches a citation chip - click it
 * (in this story, nothing happens beyond a `console.log`; a real app would scroll to and
 * highlight the cited document). Hover over the row to see the value cell tint.
 */
export const Default: StoryFn = () => (
  <Box maxWidth="480px">
    <Card>
      <CardBody padding="spacing.0">
        <CitedFieldRow
          label="MBOL"
          value="MEDUXYZ123456"
          source={{ label: 'BOL p1', accessibilityLabel: 'View MBOL on BOL, page 1' }}
          // eslint-disable-next-line no-console
          onCiteClick={(source) => console.log('cite clicked', source)}
        />
        <CitedFieldRow
          label="Vessel"
          value="EVER GIVEN"
          source={{
            label: 'Track & Trace',
            variant: 'trace',
            accessibilityLabel: 'View Vessel on Track & Trace',
          }}
          // eslint-disable-next-line no-console
          onCiteClick={(source) => console.log('cite clicked', source)}
        />
      </CardBody>
    </Card>
  </Box>
);

/**
 * A value that hasn't been extracted at all renders as an em dash, in a muted color and regular
 * weight - never a blank cell, which would be easy to misread as a loading state.
 */
export const MissingValue: StoryFn = () => (
  <Box maxWidth="480px">
    <Card>
      <CardBody padding="spacing.0">
        <CitedFieldRow label="HBOL" value={null} />
      </CardBody>
    </Card>
  </Box>
);

/**
 * A row with no `source` at all is "ungrounded" - no citation chip, and the label reads in the
 * same muted color as a missing value, since the row has no provenance to point to.
 */
export const Ungrounded: StoryFn = () => (
  <Box maxWidth="480px">
    <Card>
      <CardBody padding="spacing.0">
        <CitedFieldRow label="Notes" value="Added manually by broker" />
      </CardBody>
    </Card>
  </Box>
);

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
      <Card>
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

/**
 * `isCiteTarget` marks the row whose citation is the one currently being viewed - an accent
 * background and a left accent border on the value cell, so it's clear at a glance which value
 * the document/event on screen belongs to.
 */
export const CiteTarget: StoryFn = () => (
  <Box maxWidth="480px">
    <Card>
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

/**
 * `isEditable` swaps the value cell for `control` - the citation chip only ever applies to the
 * read-only display, so it disappears while a field is being edited.
 */
export const Editable: StoryFn = () => (
  <Box maxWidth="480px">
    <Card>
      <CardBody padding="spacing.0">
        <CitedFieldRow
          label="MBOL"
          isEditable
          control={
            <input
              defaultValue="MEDUXYZ123456"
              style={{ border: 'none', outline: 'none', width: '100%', font: 'inherit' }}
            />
          }
        />
      </CardBody>
    </Card>
  </Box>
);

/**
 * Every modifier state together, and a worked example of `onCiteClick` driving which chip reads
 * as active and which row is the current citation target - exactly the division of labor the
 * component is designed around: it renders and reports clicks, the page owns what "selected"
 * means.
 */
export const AllStates: StoryFn = () => {
  const fields = [
    { label: 'MBOL', value: 'MEDUXYZ123456', source: { label: 'BOL p1' } as CitedFieldRowSource },
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
      <Card>
        <CardBody padding="spacing.0">
          {fields.map((field) => (
            <CitedFieldRow
              key={field.label}
              label={field.label}
              value={field.value}
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
