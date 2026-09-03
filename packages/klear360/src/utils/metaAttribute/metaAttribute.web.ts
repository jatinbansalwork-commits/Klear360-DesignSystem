import { MetaConstants } from './metaConstants';

const metaAttribute = ({
  name,
  testID,
}: {
  name?: string;
  testID?: string;
}): {
  'data-klear360-component'?: string;
  'data-testid'?: string;
} => {
  return {
    ...(name ? { [`data-${MetaConstants.Component}`]: name } : {}),
    ...(testID ? { [`data-testid`]: testID } : {}),
  };
};

export { metaAttribute };
