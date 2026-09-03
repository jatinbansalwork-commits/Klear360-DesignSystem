import styled, { keyframes, css } from 'styled-components';
import type { CSSObject } from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';

// Keyframes for slide animations
const slideUp = keyframes`
  0% {
    transform: translateY(30%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideDown = keyframes`
  0% {
    transform: translateY(-30%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

const StyledNumberWrapper = styled(BaseBox)<{
  $width: string;
  $fontFamily: string;
  $fontSize: string;
  $fontWeight: string | number;
}>`
  /* Fixed width so the container's fit-content sizing tracks the digit count
     instead of the input's default intrinsic width */
  flex: none;
  width: ${({ $width }) => $width};
  font-family: ${({ $fontFamily }) => $fontFamily};
  font-size: ${({ $fontSize }) => $fontSize};
  font-weight: ${({ $fontWeight }) => $fontWeight};
  font-variant-numeric: tabular-nums;
`;

const StyledCounterInput = styled(BaseBox)`
  /* Hide focus ring by default */
  &.__klear360-counter-input .focus-ring-wrapper:focus-within {
    outline: none;
  }

  /* Show focus ring only during keyboard navigation */
  &.__klear360-counter-input.counter-input-keyboard-focus .focus-ring-wrapper:focus-within {
    ${({ theme }) => css(getFocusRingStyles({ theme, negativeOffset: true }) as CSSObject)};
  }

  &.__klear360-counter-input .__klear360-base-input-wrapper {
    box-shadow: none;
    background-color: transparent !important;
  }

  /* Animation classes */
  &.__klear360-counter-input .__klear360-counter-input-animate-slide-up {
    animation: ${slideUp} 0.2s ease-out;
  }

  &.__klear360-counter-input .__klear360-counter-input-animate-slide-down {
    animation: ${slideDown} 0.2s ease-out;
  }

  /* Hide number input arrows */
  &.__klear360-counter-input input[type='number']::-webkit-inner-spin-button,
  &.__klear360-counter-input input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &.__klear360-counter-input input[type='number'] {
    -moz-appearance: textfield; /* Firefox */
    font-variant-numeric: tabular-nums;
  }

  /* Remove ProgressBar background */
  &.__klear360-counter-input
    [data-klear360-component='progress-bar']
    .__klear360-progress-bar-track {
    background-color: transparent !important;
  }
`;

export { StyledCounterInput, StyledNumberWrapper };
