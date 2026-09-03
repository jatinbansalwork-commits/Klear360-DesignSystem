import type { Meta } from '@storybook/react-vite';
import { RecipeSandbox } from '~utils/storybook/Sandbox/SandpackEditor';
import parameters from '~utils/storybook/recipeParameters';

export function SimpleForm(): JSX.Element {
  return (
    <RecipeSandbox
      title="Klear360 Form"
      codesandboxId="klear360-form-7holu5"
      activeFile="/src/Form.tsx"
    />
  );
}

export default {
  title: 'Recipes/Simple Form',
  component: SimpleForm,
  parameters,
} as Meta;
