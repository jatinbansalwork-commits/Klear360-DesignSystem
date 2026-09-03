import styled from 'styled-components';
import { Heading, Text, Box, Card, CardBody, ChevronRightIcon } from '../../../components';
import { WorkspaceShell } from './WorkspaceShell';
import { makeMotionTime, makeSpace } from '~utils';

const ClickableRow = styled.button(({ theme }) => ({
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  overflow: 'hidden',
  alignItems: 'center',
  display: 'flex',
  flex: 1,
  width: '100%',
  borderBottom: `2px solid ${theme.colors.surface.border.gray.muted}`,
  transition: `background-color ${makeMotionTime(theme.motion.duration.gentle)} ${
    theme.motion.easing.emphasized
  }}`,
  padding: `${makeSpace(theme.spacing[4])} ${makeSpace(theme.spacing[4])}`,
  '&:hover': {
    backgroundColor: theme.colors.interactive.background.primary.faded,
  },
  '&:last-child': {
    borderBottom: 'none',
    borderBottomLeftRadius: theme.border.radius.medium,
    borderBottomRightRadius: theme.border.radius.medium,
  },
  '&:first-child': {
    borderTopLeftRadius: theme.border.radius.medium,
    borderTopRightRadius: theme.border.radius.medium,
  },
}));

const RowMark = styled.div(({ theme }) => ({
  height: '24px',
  width: '24px',
  borderRadius: theme.border.radius.small,
  backgroundColor: theme.colors.surface.background.primary.subtle,
}));

const WorkspaceRow = ({ title }: { title: string }): React.ReactElement => {
  return (
    <ClickableRow>
      <Box paddingRight="spacing.5">
        <RowMark />
      </Box>
      <Text>{title}</Text>
      <Box display="flex" flex={1} alignItems="center" justifyContent="flex-end">
        <ChevronRightIcon size="xlarge" color="surface.icon.primary.normal" />
      </Box>
    </ClickableRow>
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
