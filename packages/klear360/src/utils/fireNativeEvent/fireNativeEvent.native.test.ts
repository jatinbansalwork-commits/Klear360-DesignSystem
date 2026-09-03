import { fireNativeEvent } from './fireNativeEvent.native';

describe('fireNativeEvent', () => {
  const ref: React.RefObject<HTMLElement> = { current: null };
  it('should throw specific error', () => {
    expect(() => fireNativeEvent(ref, ['change'])).toThrowError(
      '[Klear360: FireNativeEvent]: FireNativeEvent is not supported on react-native',
    );
  });
});
