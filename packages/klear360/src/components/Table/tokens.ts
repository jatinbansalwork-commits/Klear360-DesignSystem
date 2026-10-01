import { AlertCircleIcon, CheckIcon } from '~components/Icons';
import { size } from '~tokens/global';

// Stacking order inside the table's scroll container (isolated as its own stacking context - see
// `Table` in Table.web.tsx - so none of these compete with the refresh overlay outside it):
// - frozen body/footer cells sit above the scrolling cells sliding under them horizontally;
// - frozen *header* cells sit above frozen body cells (which scroll under them vertically) and
//   above scrolling header cells (which scroll under them horizontally).
// Cells that also span rows get one extra level within their group.
const firstColumnStickyZIndex = 2;
const stickyHeaderColumnZIndex = 4;

const refreshWrapperZIndex = 3;

const checkboxCellWidth = size['44'];

const tableBackgroundColor = 'surface.background.gray.intense';
const tableHeader = {
  paddingTop: 'spacing.5',
  paddingBottom: 'spacing.5',
  paddingLeft: 'spacing.4',
  paddingRight: 'spacing.4',
  backgroundColor: 'surface.background.gray.moderate',
  borderBottomAndTopWidth: 'thin',
  borderBottomAndTopColor: 'surface.border.gray.muted',
} as const;

const tableFooter = {
  paddingTop: 'spacing.5',
  paddingBottom: 'spacing.5',
  paddingLeft: 'spacing.4',
  paddingRight: 'spacing.4',
  borderBottomAndTopWidth: 'thin',
  borderBottomAndTopColor: 'surface.border.gray.muted',
  backgroundColor: 'interactive.background.gray.faded',
} as const;

const tableRow = {
  paddingLeft: {
    compact: 'spacing.4',
    normal: 'spacing.4',
    comfortable: 'spacing.4',
  },
  paddingRight: {
    compact: 'spacing.4',
    normal: 'spacing.4',
    comfortable: 'spacing.4',
  },
  minHeight: {
    compact: '36',
    normal: '48',
    comfortable: '60',
  },
  nonStripe: {
    backgroundColor: 'transparent',
    backgroundColorHover: 'interactive.background.gray.default',
    backgroundColorFocus: 'transparent',
    // TODO: Rebranding - on design side: explore pressed state color change, right now both hover & active are same
    backgroundColorActive: 'interactive.background.gray.default',
    backgroundColorSelected: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedHover: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedFocus: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedActive: 'interactive.background.gray.fadedHighlighted',
  },
  nonStripeWrapper: {
    // not used anywhere
    backgroundColor: 'transparent',
    backgroundColorHover: 'transparent',
    backgroundColorFocus: 'transparent',
    backgroundColorActive: 'interactive.background.gray.default',
    backgroundColorSelected: 'transparent',
    backgroundColorSelectedHover: 'transparent',
    backgroundColorSelectedFocus: 'transparent',
    backgroundColorSelectedActive: 'transparent',
  },
  stripe: {
    backgroundColor: 'transparent',
    backgroundColorHover: 'interactive.background.gray.default',
    backgroundColorFocus: 'transparent',
    backgroundColorActive: 'interactive.background.gray.default',
    backgroundColorSelected: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedHover: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedFocus: 'interactive.background.gray.fadedHighlighted',
    backgroundColorSelectedActive: 'interactive.background.gray.fadedHighlighted',
  },
  stripeWrapper: {
    backgroundColor: 'interactive.background.gray.default',
    backgroundColorHover: 'interactive.background.gray.default',
    backgroundColorFocus: 'interactive.background.gray.default',
    backgroundColorActive: 'interactive.background.gray.default',
    backgroundColorSelected: 'interactive.background.gray.default',
    backgroundColorSelectedHover: 'interactive.background.gray.default',
    backgroundColorSelectedFocus: 'interactive.background.gray.default',
    backgroundColorSelectedActive: 'interactive.background.gray.default',
  },
  borderBottomWidth: 'thin',
  borderColor: 'surface.border.gray.muted',
  backgroundColorMotionEasing: 'easing.standard',
  backgroundColorMotionDuration: 'duration.xquick',
  groupHeaderBackgroundColor: 'surface.background.gray.moderate',
} as const;

const tableToolbar = {
  backgroundColor: 'transparent',
  backgroundColorSelected: 'interactive.background.primary.faded',
  backgroundColorMotionEasing: 'easing.standard',
  backgroundColorMotionDuration: 'duration.xquick',
  minHeight: size[37], // 37px to accommodate 1px border, matching TableHeader height
  padding: ['spacing.3', 'spacing.3', 'spacing.3', 'spacing.4'],
} as const;

const tablePagination = {
  defaultPageSize: 10,
  backgroundColor: 'surface.background.gray.moderate',
} as const;

const tableEditableCellRowDensityToInputSizeMap = {
  compact: 'small',
  normal: 'medium',
  comfortable: 'large',
} as const;

const validationStateToInputTrailingIconMap = {
  none: undefined,
  success: CheckIcon,
  error: AlertCircleIcon,
};

const rowDensityToIsTableInputCellMapping = {
  comfortable: false,
  normal: true,
  compact: true,
};

const classes = {
  HOVER_ACTIONS: 'hover-actions',
  HOVER_ACTIONS_LAYER2: 'hover-actions-layer-2',
  HOVER_ACTIONS_LAYER3: 'hover-actions-layer-3',
  HAS_ROW_SPANNING: 'has-row-spanning',
};

export {
  tableHeader,
  tableFooter,
  tableRow,
  tableToolbar,
  tablePagination,
  refreshWrapperZIndex,
  tableBackgroundColor,
  firstColumnStickyZIndex,
  stickyHeaderColumnZIndex,
  checkboxCellWidth,
  tableEditableCellRowDensityToInputSizeMap,
  validationStateToInputTrailingIconMap,
  rowDensityToIsTableInputCellMapping,
  classes,
};
