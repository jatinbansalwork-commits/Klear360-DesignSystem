import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

/**
 * Native fallback for KlearTrustIcon.
 *
 * The branded gradients/drop-shadow used on web are not supported by the Klear360 `_Svg`
 * native primitives, so native renders a solid-fill shield silhouette using the standard
 * icon color tokens. The white inner mark is kept as a knockout so the glyph stays legible.
 */
const _KlearTrustIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19.7981 3.96094V15.3838C19.798 16.163 19.4121 16.8915 18.7679 17.3301L12.1311 21.8467L5.49443 17.3301C4.85022 16.8915 4.46425 16.163 4.46415 15.3838V3.96094L12.1311 2.09277L19.7981 3.96094Z"
        fill={iconColor}
      />
      <Path d="M16.2 7.8L10.6 13.4L8.1 10.9L6.7 12.3L10.6 16.2L17.6 9.2L16.2 7.8Z" fill="white" />
    </Svg>
  );
};

const KlearTrustIcon = assignWithoutSideEffects(_KlearTrustIcon, {
  componentId: 'KlearTrustIcon',
});

export default KlearTrustIcon;
