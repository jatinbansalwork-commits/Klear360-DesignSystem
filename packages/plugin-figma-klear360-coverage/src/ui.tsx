import { Button, Container, render, VerticalSpace } from '@create-figma-plugin/ui';
// import { emit } from '@create-figma-plugin/utilities';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
// import { Button } from '@klear/klear360';
import { Button as Klear360Button } from '@klear/klear360/components';

const Plugin = (): JSX.Element => {
  return (
    <div>
      <Container space="medium">
        <VerticalSpace space="small" />
        Hello, Worldddd!
        <VerticalSpace space="large" />
        <Klear360Button variant="secondary">Click</Klear360Button>
        <Button fullWidth>Insert Code</Button>
        <VerticalSpace space="small" />
      </Container>
    </div>
  );
};

export default render(Plugin);
