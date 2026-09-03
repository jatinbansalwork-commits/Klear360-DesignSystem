# AutoComplete

A SelectInput where you can type inside the input to filter through the items.


## Design

- [Figma - SelectInput & AutoComplete](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Klear360---Payment-Light?node-id=13590%3A171038&mode=dev)

## Props

> **Note**
>
> Below this section, I have added [examples of common AutoComplete usage](#usage). Check them out to understand usage of these props in details.

| **Props**          | **Description**                                                                                                                             | **Type**                                                        | **Default Value**                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------ |
| label              | label of input                                                                                                                              | string                                                          |                                                  |
| accessibilityLabel | aria-label of input when label is not defined (required when label is not passed)                                                           | string                                                          |                                                  |
| labelPosition      | Label Position like other inputs but with new option `inside-input`. This value new value will be added to `AutoComplete` and `SelectInput` | 'top' \| 'left' \| 'inside-input'                               | 'top'                                            |
| maxRows            | height restrictions of input ([Checkout "Inactive - Active States" Usage](#with-different-inactive---active-states))                        | 'single' \| 'multiple' \| 'expandable'                          | 'multiple'                                       |
| filteredValues     | Controlled state of filtering of items                                                                                                      | string[]                                                        | (by default filtering happens with `startsWith`) |
| inputValue         | Controlled state of the value inside input                                                                                                  | string                                                          |                                                  |
| onInputValueChange | Callback when input value changes                                                                                                           | (inputValue: string) => void                                    |                                                  |
| value              | Controlled state of the selected items ([Checkout "Controlled AutoComplete" Usage](#controlled-autocomplete))                               | string[]                                                        |                                                  |
| onChange           | Callback when selected items change                                                                                                         | ({ name, values }: { name: string; values: string[] } ) => void |                                                  |

_This is a list of unique props to AutoComplete, apart from these all common input props will be supported such as `validationState`, `helpText`, `errorText`, etc_

#### Related Component APIs

- [SelectInput](../../Dropdown/_decisions/decisions.md#selectinput)
- [Dropdown](../../Dropdown/_decisions/decisions.md#dropdown)
- [ActionList](../../Dropdown/_decisions/decisions.md#actionlist)
- [Controlled Dropdown](../../Dropdown/_decisions/controlled-dropdown.md)

## Usage

AutoComplete will be built as a new trigger for existing Dropdown component.

Depending on where and how AutoComplete is used, the API can differ. Checkout examples below on how code will look like for a particular usage.

- [Basic Usage](#basic-usage)
- [Controlled AutoComplete](#controlled-autocomplete)
- [In BottomSheet](#in-bottomsheet)
- [With Tags Outside](#with-tags-outside)
- [With Different Inactive - Active States](#with-different-inactive---active-states)

### Basic Usage

```jsx
<Dropdown selectionType="multiple">
  <AutoComplete label="Select Cities" />
  <DropdownOverlay>
    <ActionList>
      <ActionListItem title="Mumbai" value="mumbai" />
      <ActionListItem title="Pune" value="pune" />
      <ActionListItem title="Hyderabad" value="hyderabad" />
    </ActionList>
  </DropdownOverlay>
</Dropdown>
```

### Controlled AutoComplete

There are 3 controlled states that are relevant to AutoComplete

1. Controlled state of filtering items
2. Controlled state of the Input where user types
3. Controlled state of selected items

```jsx
const allCities = ['Mumbai', 'Pune', 'Bangalore']
const [filteredValues, setFilteredValues] = React.useState(allCities);
const [selections, setSelections] = React.useState([]);

// ...

<AutoComplete
  // For controlling the selections
  value={selections}
  onChange={({ name, values }) => {
    setSelections(values)
  }}
  // For controlling the input value
  inputValue={}
  onInputValueChange={(inputValue) => {
    // Filter and set the state here
    const filteredCityValues = allCities
      .filter((city) => city.includes(inputValue))
      .map((city) => city.toLowerCase());

    setFilteredValues(filteredCityValues);
  }}
  // Control the filtering of items (Make sure to pass array of values here)
  filteredValue={filteredValues}
/>

// ...

<ActionList>
  {allCities.map((city) => <ActionListItem title={city} value={city.toLowerCase()} />)}
</ActionList>
```

Complex flows such as [Adding New Item to ActionList](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Klear360---Payment-Light?node-id=47091%3A711978&mode=dev) should be handled with Controlled API.

Checkout the Changelog to see alternate API and limitations of it

<details>
<summary>Show Full Code</summary>

```jsx
const allCities = [
  {
    title: 'Mumbai',
    value: 'mumbai'
  },
  {
    title: 'Pune',
    value: 'pune'
  },
  {
    title: 'Bangalore',
    value: 'bangalore'
  },
];

const ControlledAutoComplete = () => {
  // Controlled Filtering
  const [filteredValues, setFilteredValues] = React.useState(allCities);
  // Controlled Input Value
  const [currentInputValue, setCurrentInputValue] = React.useState('');
  // Controlled Selections
  const [currentSelections, setCurrentSelections] = React.useState<string[]>([]);

  return (
    <Dropdown>
      <AutoComplete
        label="Select City"
        // Controlled input value
        // Sets the input value of input element in AutoComplete
        inputValue={currentInputValue}
        // Triggers when input value changes
        onInputValueChange={(inputValue) => {
          if (inputValue) {
            // filtering logic
            const allCityValues = allCities.map((city) => city.value);
            const filteredCities = allCityValues.filter((cityValue) => cityValue.includes(inputValue));
            setFilteredValues(filteredCities);
          } else {
            setFilteredValues(allCityValues);
          }
          setCurrentInputValue(inputValue);
        }}
        // Selected Items in AutoComplete
        value={currentSelections}
        onChange={({ values }) => {
          setCurrentSelections(values);
        }}
        // controls the values that should be shown to user
        filteredValues={filteredValues}
      />
      <DropdownOverlay>
        <ActionList>
          {allCities.map((city) => (
            <ActionListItem
              title={city.title}
              value={city.value}
            />
          ))}
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};
```

</details>

### In BottomSheet

> **Note**
>
> We will be turning BottomSheetHeader (and BaseHeader) to a slot to allow adding Input element there. The existing prop will remain and work as is without any breaking change. The children slot will come at the end of the header.


```jsx
<Dropdown selectionType="multiple">
  <SelectInput label="Select Emails" />
  <BottomSheet>
    <BottomSheetHeader title="Do you want this report in an email?">
      <AutoComplete label="Add receiver's email addresses" />
    </BottomSheetHeader>
    <BottomSheetBody>
      <ActionList>
        <ActionListItem title="Mumbai" value="mumbai" />
        <ActionListItem title="Pune" value="pune" />
        <ActionListItem title="Hyderabad" value="hyderabad" />
      </ActionList>
    </BottomSheetBody>
  </BottomSheet>
</Dropdown>
```

### With Tags Outside

When possible selections are more than 10, it is advised to put tags outside of the Input.


**Code**

```jsx
const [selectedItems, setSelectedItems] = React.useState([]);

// ...

<AutoComplete
  label="Status"
  labelPosition="inside-input"
  maxRows="single"
  value={selectedItems}
  onChange={({ values }) => setSelectedItems(values)}
/>


// Somewhere outside in your UI
<Box>
  {selectedItems.map((selectedItemName, index) =>
    <Tag
      onDismiss={() => removeItem(index)}
    >
      {selectedItemName}
    </Tag>
  )}
</Box>;
```

### With Different Label Positions

While things are flawless when you give visible label (highly recommended), If there are scenarios where you are not able to give label to inputs (questionable but ok), you can use `labelPosition: 'inside-input'` prop.

| **Code**                                                       | **Description**       | **Single Select**                                                                                                | **Multi Select**                                                                                                 |
| -------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `<AutoComplete label="Status" /> `                             | With Label Present    |  |  |
| `<AutoComplete label="Status" labelPosition="inside-input" />` | Without Label Present |  |  |

### With Different Inactive - Active States

> **Note**
>
> Number of items shown in inactive state is auto-calculated based on height and width of the input.

| Code                                    | Description                                                 | Inactive                                                                                                                   | Active                                                                                                                     |
| --------------------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `<AutoComplete maxRows="single" />`     | Input always stays 1 line                                   |  |  |
| `<AutoComplete maxRows="multiple" />`   | Input can go upto 3 lines                                   |  |  |
| `<AutoComplete maxRows="expandable" />` | Input is 1 line initially but expands upto 3 lines on click |  |  |

## Accessibility

AutoComplete will continue to follow [same keyboard navigations as SelectInput](../../Dropdown/_decisions/decisions.md#accessibility).

## Referrences

- [Material UI - AutoComplete](https://mui.com/material-ui/react-autocomplete/)
  - Used for Controlled AutoComplete Inspiration
  - UI / UX Inspirations
- [Primer - AutoComplete](https://primer.style/react/Autocomplete/)
  - Usage of Tags inside AutoComplete Inspiration
- [Ariakit - Combobox Filtering](https://ariakit.org/examples/combobox-filtering)
  - Used for Controlled Filtering Inspiration
- [React Select](https://react-select.com/home)
  - Used for Accessibility and Keyboard Navigations Inspiration

## Open Questions

- **Q1:** Is everyone sold on `selected` and `onSelectChange` API? It is inconsistent with SelectInput. Might have to change it in SelectInput as well.
  - Ans: Answered in Q4's answer. Its not inconsistent anymore
- **Q2:** What to do with BottomSheetHeader (and BaseHeader)? Should we make it slot like Footer? Should we remove title, subtitle, etc?
  - Ans: Nope we're not removing anything. We will just also start accepting children in header to allow adding AutoComplete
- **Q3:** `rows: '1' | '3' | 'expandable'` vs `numberOfLines: '1' | '3' | 'expandable'`ˀ vs `height: 'single-line' | 'multi-line' | 'expandable'`
  - Ans: We're going with `maxRows: 'single' | 'multiple' | 'expandable'`
- **Q4:** `onSelectChange` vs `onSelectionChange` vs `onItemSelectionChange`
  - Ans: We're calling it `onChange` and we're changing input value's change to `onInputValueChange`
