import styled from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { makeBorderSize } from '~utils';

const StyledInputGroup = styled(BaseBox)`
  ${({ theme }) => {
    const radius = makeBorderSize(theme.border.radius.small);
    return `
      /* Reset all inputs and their focus ring wrappers */
      & .__klear360-input-row .__klear360-base-input-wrapper,
      & .__klear360-input-row .focus-ring-wrapper {
        border-radius: 0;
      }

      /* Row stacking: elevate entire row on hover/focus to prevent shadow clipping between rows */
      & .__klear360-input-row {
        position: relative;
        z-index: 0;
      }

      & .__klear360-input-row:hover,
      & .__klear360-input-row:focus-within {
        z-index: 1;
      }

      /* Within-row stacking: elevate hovered/focused input above siblings */
      & .__klear360-input-row .__klear360-base-input-wrapper {
        z-index: 0;
      }

      & .__klear360-input-row .__klear360-base-input-wrapper:hover,
      & .__klear360-input-row .__klear360-base-input-wrapper:focus-within {
        z-index: 1;
      }

      /* Multi-row: First row, first column */
      & .__klear360-input-row:first-child > div:first-child .__klear360-base-input-wrapper,
      & .__klear360-input-row:first-child > div:first-child .focus-ring-wrapper {
        border-top-left-radius: ${radius};
      }

      /* Multi-row: First row, last column */
      & .__klear360-input-row:first-child > div:last-child .__klear360-base-input-wrapper,
      & .__klear360-input-row:first-child > div:last-child .focus-ring-wrapper {
        border-top-right-radius: ${radius};
      }

      /* Multi-row: Last row, first column */
      & .__klear360-input-row:last-child > div:first-child .__klear360-base-input-wrapper,
      & .__klear360-input-row:last-child > div:first-child .focus-ring-wrapper {
        border-bottom-left-radius: ${radius};
      }

      /* Multi-row: Last row, last column */
      & .__klear360-input-row:last-child > div:last-child .__klear360-base-input-wrapper,
      & .__klear360-input-row:last-child > div:last-child .focus-ring-wrapper {
        border-bottom-right-radius: ${radius};
      }

      /* Multi-row: First row with only one column */
      & .__klear360-input-row:first-child > div:only-child .__klear360-base-input-wrapper,
      & .__klear360-input-row:first-child > div:only-child .focus-ring-wrapper {
        border-top-left-radius: ${radius};
        border-top-right-radius: ${radius};
      }

      /* Multi-row: Last row with only one column */
      & .__klear360-input-row:last-child > div:only-child .__klear360-base-input-wrapper,
      & .__klear360-input-row:last-child > div:only-child .focus-ring-wrapper {
        border-bottom-left-radius: ${radius};
        border-bottom-right-radius: ${radius};
      }

      /* Single row: Single column */
      & .__klear360-input-row:only-child > div:only-child .__klear360-base-input-wrapper,
      & .__klear360-input-row:only-child > div:only-child .focus-ring-wrapper {
        border-radius: ${radius};
      }

      /* Single row: First column */
      & .__klear360-input-row:only-child > div:first-child:not(:only-child) .__klear360-base-input-wrapper,
      & .__klear360-input-row:only-child > div:first-child:not(:only-child) .focus-ring-wrapper {
        border-top-left-radius: ${radius};
        border-bottom-left-radius: ${radius};
      }

      /* Single row: Last column */
      & .__klear360-input-row:only-child > div:last-child:not(:only-child) .__klear360-base-input-wrapper,
      & .__klear360-input-row:only-child > div:last-child:not(:only-child) .focus-ring-wrapper {
        border-top-right-radius: ${radius};
        border-bottom-right-radius: ${radius};
      }

      /* Single row: Middle columns */
      & .__klear360-input-row:only-child > div:not(:first-child):not(:last-child) .__klear360-base-input-wrapper,
      & .__klear360-input-row:only-child > div:not(:first-child):not(:last-child) .focus-ring-wrapper {
        border-radius: 0;
      }
    `;
  }}
`;

export { StyledInputGroup };
