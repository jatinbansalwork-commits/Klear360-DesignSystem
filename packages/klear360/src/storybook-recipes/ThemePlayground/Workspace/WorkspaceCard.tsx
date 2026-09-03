import { Box, Checkbox, Heading } from '../../../components';
import { WorkspaceShell } from './WorkspaceShell';
import { TextInput } from '~components/Input/TextInput';

const WorkspaceCard = (): React.ReactElement => {
  return (
    <WorkspaceShell>
      <Box padding="spacing.4">
        <Heading marginTop="spacing.3">Workspace settings</Heading>
        <Box display="flex" gap="spacing.6" marginTop="spacing.8">
          <Box flex="2">
            <TextInput label="Workspace name" placeholder="Northwind Studio" />
          </Box>
          <Box flex="1">
            <TextInput label="Handle" placeholder="northwind" />
          </Box>
        </Box>
        <Box display="flex" gap="spacing.6" marginTop="spacing.8">
          <Box flex="2">
            <TextInput label="Owner" placeholder="Maya Chen" />
          </Box>
          <Box flex="1">
            <TextInput label="Region" placeholder="APAC" />
          </Box>
        </Box>
        <Box marginTop="spacing.10">
          <Checkbox defaultChecked>Keep these as default for new projects</Checkbox>
        </Box>
      </Box>
    </WorkspaceShell>
  );
};

export { WorkspaceCard };
