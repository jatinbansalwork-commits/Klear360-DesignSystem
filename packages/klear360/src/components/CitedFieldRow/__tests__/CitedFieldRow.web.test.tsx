import { fireEvent } from '@testing-library/react';
import userEvents from '@testing-library/user-event';
import React from 'react';
import { CitedFieldRow } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import assertAccessible from '~utils/testing/assertAccessible.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<CitedFieldRow />', () => {
  it('should render column header labels', () => {
    const { getByText } = renderWithTheme(<CitedFieldRow.Header />);
    expect(getByText('Field')).toBeInTheDocument();
    expect(getByText('Value')).toBeInTheDocument();
    expect(getByText('Source')).toBeInTheDocument();
  });

  it('should render label and value', () => {
    const { container, getByText } = renderWithTheme(
      <CitedFieldRow label="MBOL" value="MEDUXYZ123456" />,
    );
    expect(container).toMatchSnapshot();
    expect(getByText('MBOL')).toBeInTheDocument();
    expect(getByText('MEDUXYZ123456')).toBeInTheDocument();
  });

  it('should render an em dash for a missing value', () => {
    const { getByText } = renderWithTheme(<CitedFieldRow label="HBOL" value={null} />);
    expect(getByText('—')).toBeInTheDocument();
  });

  it('should render a source citation chip when grounded', () => {
    const { getByRole } = renderWithTheme(
      <CitedFieldRow label="MBOL" value="MEDUXYZ123456" source={{ label: 'BOL p1' }} />,
    );
    expect(getByRole('button', { name: 'BOL p1' })).toBeInTheDocument();
  });

  it('should not render a chip when ungrounded', () => {
    const { queryByRole } = renderWithTheme(<CitedFieldRow label="Notes" value="Added by hand" />);
    expect(queryByRole('button')).not.toBeInTheDocument();
  });

  it('should call onCiteClick with the source when the chip is clicked', async () => {
    const onCiteClick = jest.fn();
    const source = { label: 'BOL p1' };
    const { getByRole } = renderWithTheme(
      <CitedFieldRow
        label="MBOL"
        value="MEDUXYZ123456"
        source={source}
        onCiteClick={onCiteClick}
      />,
    );

    await userEvents.click(getByRole('button', { name: 'BOL p1' }));

    expect(onCiteClick).toHaveBeenCalledTimes(1);
    expect(onCiteClick).toHaveBeenCalledWith(source);
  });

  it('should disable the chip and not call onCiteClick when cite-muted', () => {
    const onCiteClick = jest.fn();
    const { getByRole } = renderWithTheme(
      <CitedFieldRow
        label="MBOL"
        value="MEDUXYZ123456"
        source={{ label: 'BOL p1' }}
        isCiteMuted
        onCiteClick={onCiteClick}
      />,
    );

    const chip = getByRole('button', { name: 'BOL p1' });
    expect(chip).toBeDisabled();

    fireEvent.click(chip);
    expect(onCiteClick).not.toHaveBeenCalled();
  });

  it('should render success text when validationState is success', () => {
    const { getByText } = renderWithTheme(
      <CitedFieldRow
        label="MBOL"
        value="MEDUXYZ123456"
        validationState="success"
        successText="MBOL format is valid."
      />,
    );
    expect(getByText('MBOL format is valid.')).toBeInTheDocument();
  });

  it('should render error text when validationState is error', () => {
    const { getByText } = renderWithTheme(
      <CitedFieldRow
        label="MBOL"
        value="INVALID"
        validationState="error"
        errorText="MBOL format is invalid."
      />,
    );
    expect(getByText('MBOL format is invalid.')).toBeInTheDocument();
  });

  it('should render control instead of value when editable', () => {
    const { getByTestId, queryByText } = renderWithTheme(
      <CitedFieldRow
        label="MBOL"
        isEditable
        control={<input data-testid="mbol-input" defaultValue="MEDUXYZ123456" />}
      />,
    );
    expect(getByTestId('mbol-input')).toBeInTheDocument();
    expect(queryByText('—')).not.toBeInTheDocument();
  });

  it('should be accessible', async () => {
    const { container } = renderWithTheme(
      <CitedFieldRow label="MBOL" value="MEDUXYZ123456" source={{ label: 'BOL p1' }} />,
    );
    await assertAccessible(container);
  });
});
