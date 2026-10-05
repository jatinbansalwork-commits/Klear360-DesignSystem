import type { StoryFn, Meta } from '@storybook/react-vite';
import { within, userEvent, expect, fn } from 'storybook/test';
import React from 'react';
import { CitedFieldRow } from '../';
import { Card, CardBody } from '~components/Card';
import { Box } from '~components/Box';

export default {
  title: 'Components/CitedFieldRow/Tests',
  tags: ['!autodocs'],
  parameters: {
    chromatic: { disableSnapshot: true },
    actions: { disable: true },
    controls: { disable: true },
  },
} as Meta;

const onCiteClick = fn();

export const TestCiteChipClick: StoryFn = () => (
  <Box maxWidth="480px">
    <Card>
      <CardBody padding="spacing.0">
        <CitedFieldRow
          label="MBOL"
          value="MEDUXYZ123456"
          source={{ label: 'BOL p1', accessibilityLabel: 'View MBOL on BOL, page 1' }}
          onCiteClick={onCiteClick}
        />
      </CardBody>
    </Card>
  </Box>
);

TestCiteChipClick.play = async ({ canvasElement }) => {
  onCiteClick.mockClear();
  const canvas = within(canvasElement);
  const chip = canvas.getByRole('button', { name: 'View MBOL on BOL, page 1' });
  await userEvent.click(chip);
  await expect(onCiteClick).toHaveBeenCalledTimes(1);
  await expect(onCiteClick).toHaveBeenCalledWith(expect.objectContaining({ label: 'BOL p1' }));
};

export const TestCiteMutedDisablesChip: StoryFn = () => (
  <Box maxWidth="480px">
    <Card>
      <CardBody padding="spacing.0">
        <CitedFieldRow
          label="MBOL"
          value="MEDUXYZ123456"
          isCiteMuted
          source={{ label: 'BOL p1' }}
          onCiteClick={onCiteClick}
        />
      </CardBody>
    </Card>
  </Box>
);

TestCiteMutedDisablesChip.play = async ({ canvasElement }) => {
  onCiteClick.mockClear();
  const canvas = within(canvasElement);
  const chip = canvas.getByRole('button', { name: 'BOL p1' });
  await expect(chip).toBeDisabled();
  await userEvent.click(chip);
  await expect(onCiteClick).not.toHaveBeenCalled();
};

export const TestValidationErrorA11y: StoryFn = () => (
  <Box maxWidth="480px">
    <Card>
      <CardBody padding="spacing.0">
        <CitedFieldRow
          label="MBOL"
          value="INVALID"
          validationState="error"
          errorText="MBOL format is invalid."
        />
      </CardBody>
    </Card>
  </Box>
);

TestValidationErrorA11y.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const errorText = canvas.getByText('MBOL format is invalid.');
  await expect(errorText).toBeVisible();
  const valueRegion = canvas
    .getByText('INVALID')
    .closest('[data-klear360-component="cited-field-row-value"]');
  await expect(valueRegion).toHaveAttribute('aria-invalid', 'true');
};
