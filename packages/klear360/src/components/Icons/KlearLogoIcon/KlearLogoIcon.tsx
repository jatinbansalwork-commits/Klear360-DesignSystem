import { Svg, Path } from '../_Svg';
import type { IconComponent } from '..';
import useIconProps from '../useIconProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _KlearLogoIcon: IconComponent = ({ size, color, ...styledProps }) => {
  const { height, width, iconColor } = useIconProps({ size, color });

  return (
    <Svg {...styledProps} width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 3H8V10.8L15 3H19L11 11.5L19.4 21H15.4L8 12.6V21H5V3Z"
        fill={iconColor}
      />
    </Svg>
  );
};

const KlearLogoIcon = assignWithoutSideEffects(_KlearLogoIcon, {
  componentId: 'KlearLogoIcon',
});

export default KlearLogoIcon;
