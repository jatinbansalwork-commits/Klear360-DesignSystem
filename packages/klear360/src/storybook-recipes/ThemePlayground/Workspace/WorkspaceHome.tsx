import { Heading, Text, Box, Card, CardBody, ChevronRightIcon } from '../../../components';
import { WorkspaceShell } from './WorkspaceShell';
import styles from './WorkspaceHome.module.scss';

const WorkspaceRow = ({ title }: { title: string }): React.ReactElement => {
  return (
    <button type="button" className={styles.clickableRow}>
      <Box paddingRight="spacing.5">
        <div className={styles.rowMark} />
      </Box>
      <Text>{title}</Text>
      <Box display="flex" flex={1} alignItems="center" justifyContent="flex-end">
        <ChevronRightIcon size="xlarge" color="surface.icon.primary.normal" />
      </Box>
    </button>
  );
};

const WorkspaceHome = (): React.ReactElement => {
  return (
    <WorkspaceShell>
      <Box padding="spacing.7" paddingBottom="spacing.8" overflowY="scroll">
        <Heading marginTop="spacing.3" marginBottom="spacing.3">
          Recent projects
        </Heading>
        <Card padding="spacing.0" elevation="none">
          <CardBody>
            <WorkspaceRow title="Brand guidelines" />
            <WorkspaceRow title="Q3 planning board" />
            <WorkspaceRow title="Onboarding checklist" />
          </CardBody>
        </Card>
        <Heading marginTop="spacing.5" marginBottom="spacing.3">
          Team
        </Heading>
        <Card padding="spacing.0" elevation="none">
          <CardBody>
            <WorkspaceRow title="Maya Chen — Design" />
            <WorkspaceRow title="Jordan Hale — Engineering" />
            <WorkspaceRow title="Priya Raman — Research" />
          </CardBody>
        </Card>
        <Heading marginTop="spacing.5" marginBottom="spacing.3">
          Workspace
        </Heading>
        <Card padding="spacing.0" elevation="none">
          <CardBody>
            <WorkspaceRow title="General settings" />
            <WorkspaceRow title="Members and roles" />
            <WorkspaceRow title="Notifications" />
          </CardBody>
        </Card>
      </Box>
    </WorkspaceShell>
  );
};

export { WorkspaceHome };
