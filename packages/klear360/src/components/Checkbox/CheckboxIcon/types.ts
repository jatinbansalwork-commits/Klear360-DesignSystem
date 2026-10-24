import type { CSSObject } from '~utils/cssObject';

export type FadeProps = {
  show?: boolean;
  children: React.ReactNode;
  styles?: React.CSSProperties | CSSObject;
};
