// All the WAI-ARIA 1.1 role attribute values from https://www.w3.org/TR/wai-aria-1.1/#role_definitions
/**
 * @typedef {'alert' | 'alertdialog' | 'application' | 'article' | 'banner' | 'button' | 'cell' | 'checkbox' | 'columnheader' | 'combobox' | 'complementary' | 'contentinfo' | 'definition' | 'dialog' | 'directory' | 'document' | 'feed' | 'figure' | 'form' | 'grid' | 'gridcell' | 'group' | 'heading' | 'img' | 'link' | 'list' | 'listbox' | 'listitem' | 'log' | 'main' | 'marquee' | 'math' | 'menu' | 'menubar' | 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'meter' | 'navigation' | 'none' | 'note' | 'option' | 'presentation' | 'progressbar' | 'radio' | 'radiogroup' | 'region' | 'row' | 'rowgroup' | 'rowheader' | 'scrollbar' | 'search' | 'searchbox' | 'separator' | 'slider' | 'spinbutton' | 'status' | 'switch' | 'tab' | 'table' | 'tablist' | 'tabpanel' | 'term' | 'textbox' | 'timer' | 'toolbar' | 'tooltip' | 'tree' | 'treegrid' | 'treeitem'} AriaRoles
 */

/**
 * @typedef {keyof AriaAttributes} AccessibilityKeys
 */

/**
 * @typedef {AriaAttributes} AccessibilityProps
 */

/**
 * @typedef {Record<AccessibilityKeys, string>} AccessibilityMap
 */

/**
 * @typedef {Object} AriaAttributes
 * @property {AriaRoles} role
 * @property {string} [activeDescendant] Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application.
 * @property {boolean} [atomic] Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute.
 * @property {'none' | 'inline' | 'list' | 'both'} [autoComplete] Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made.
 * @property {boolean} [busy] Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user.
 * @property {boolean | 'mixed'} [checked] Indicates the current "checked" state of checkboxes, radio buttons, and other widgets. see aria-pressed see aria-selected.
 * @property {number} [colCount] Defines the total number of columns in a table, grid, or treegrid. see aria-colindex.
 * @property {number} [colIndex] Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid. see aria-colcount see aria-colspan.
 * @property {number} [colSpan] Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid. see aria-colindex see aria-rowspan.
 * @property {string} [controls] Identifies the element (or elements) whose contents or presence are controlled by the current element. see aria-owns.
 * @property {boolean | 'page' | 'step' | 'location' | 'date' | 'time'} [current] Indicates the element that represents the current item within a container or set of related elements.
 * @property {string} [describedBy] Identifies the element (or elements) that describes the object. see aria-labelledby
 * @property {string} [details] Identifies the element that provides a detailed, extended description for the object. see aria-describedby.
 * @property {boolean} [disabled] Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable. see aria-hidden see aria-readonly.
 * @property {'none' | 'copy' | 'execute' | 'link' | 'move' | 'popup'} [dropEffect] Indicates what functions can be performed when a dragged object is released on the drop target. (deprecated in ARIA 1.1)
 * @property {string} [errorMessage] Identifies the element that provides an error message for the object. see aria-invalid see aria-describedby.
 * @property {boolean} [expanded] Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed.
 * @property {string} [flowTo] Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order.
 * @property {boolean} [grabbed] Indicates an element's "grabbed" state in a drag-and-drop operation. (deprecated in ARIA 1.1)
 * @property {boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'} [hasPopup] Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element.
 * @property {boolean} [hidden] Indicates whether the element is exposed to an accessibility API. see aria-disabled.
 * @property {boolean | 'grammar' | 'spelling'} [invalid] Indicates the entered value does not conform to the format expected by the application. see aria-errormessage.
 * @property {string} [keyShortcuts] Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element.
 * @property {string} [label] Defines a string value that labels the current element. see aria-labelledby.
 * @property {string} [labelledBy] Identifies the element (or elements) that labels the current element. see aria-describedby.
 * @property {number} [level] Defines the hierarchical level of an element within a structure.
 * @property {'off' | 'assertive' | 'polite'} [liveRegion] Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region.
 * @property {boolean} [modal] Indicates whether an element is modal when displayed.
 * @property {boolean} [multiline] Indicates whether a text box accepts multiple lines of input or only a single line.
 * @property {boolean} [multiSelectable] Indicates that the user may select more than one item from the current selectable descendants.
 * @property {'horizontal' | 'vertical'} [orientation] Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous.
 * @property {string} [owns] Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship. see aria-controls.
 * @property {string} [placeholder] Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format.
 * @property {number} [posInSet] Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. see aria-setsize.
 * @property {boolean | 'mixed'} [pressed] Indicates the current "pressed" state of toggle buttons. see aria-checked see aria-selected.
 * @property {boolean} [readOnly] Indicates that the element is not editable, but is otherwise operable. see aria-disabled.
 * @property {'additions' | 'additions removals' | 'additions text' | 'all' | 'removals' | 'removals additions' | 'removals text' | 'text' | 'text additions' | 'text removals'} [relevant] Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. see aria-atomic.
 * @property {boolean} [required] Indicates that user input is required on the element before a form may be submitted.
 * @property {string} [roleDescription] Defines a human-readable, author-localized description for the role of an element.
 * @property {number} [rowCount] Defines the total number of rows in a table, grid, or treegrid. see aria-rowindex.
 * @property {number} [rowIndex] Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid. see aria-rowcount see aria-rowspan.
 * @property {number} [rowSpan] Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid. see aria-rowindex see aria-colspan.
 * @property {boolean} [selected] Indicates the current "selected" state of various widgets. see aria-checked see aria-pressed.
 * @property {number} [setSize] Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. see aria-posinset.
 * @property {'none' | 'ascending' | 'descending' | 'other'} [sort] Indicates if items in a table or grid are sorted in ascending or descending order.
 * @property {number} [valueMax] Defines the maximum allowed value for a range widget.
 * @property {number} [valueMin] Defines the minimum allowed value for a range widget.
 * @property {number} [valueNow] Defines the current value for a range widget. see aria-valuetext.
 * @property {string} [valueText] Defines the human readable text alternative of aria-valuenow for a range widget.
 */

export {};
