import styled from 'styled-components';
import { useState } from 'react';
import { makeSpace } from '../../../utils';
import {
  Heading,
  Text,
  Button,
  ChevronDownIcon,
  CloseIcon,
  InfoIcon,
  Box,
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
} from '../../../components';

const StyledHeader = styled.div(({ theme }) => ({
  boxShadow: '0 4px 8px  rgba(23,26,30,.15)',
  backgroundImage: 'linear-gradient(to bottom right,rgba(255,255,255,0.2),rgba(0,0,0,0.2))',
  height: '80px',
  width: '100%',
  backgroundColor: theme.colors.surface.background.primary.intense,
  padding: makeSpace(theme.spacing[4]),
  borderTopLeftRadius: 'medium',
  borderTopRightRadius: 'medium',
  flexDirection: 'row',
  display: 'flex',
  gap: makeSpace(theme.spacing[4]),
  alignItems: 'center',
  zIndex: 2,
}));

const StyledFooter = styled.div(({ theme }) => ({
  boxShadow: `0 -2px 6px  rgba(23,26,30,.15)`,
  borderTop: `1px solid ${theme.colors.surface.border.primary.muted}`,
  zIndex: 2,
  display: 'flex',
  padding: makeSpace(theme.spacing[4]),
  alignItems: 'center',
}));

const WorkspaceAvatar = styled.div(({ theme }) => ({
  height: '46px',
  width: '46px',
  borderRadius: theme.border.radius.small,
  backgroundColor: theme.colors.interactive.background.primary.faded,
  color: theme.colors.interactive.text.onPrimary.normal,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  flexShrink: 0,
}));

const StatusWrapper = styled.div(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  background: 'rgba(255,255,255,0.1 )',
  padding: `${makeSpace(theme.spacing[1])} ${makeSpace(theme.spacing[2])}`,
  cursor: 'pointer',
  borderRadius: theme.border.radius.small,
}));

const LanguageSelector = styled.div(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  background: 'rgba(255,255,255,0.1 )',
  padding: `${makeSpace(theme.spacing[1])} ${makeSpace(theme.spacing[2])}`,
  cursor: 'pointer',
  borderRadius: theme.border.radius.small,
  gap: makeSpace(theme.spacing[2]),
  marginTop: makeSpace(theme.spacing[3]),
}));

const WorkspaceShell = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const [isLanguageSheetOpen, setIsLanguageSheetOpen] = useState(false);
  return (
    <Box
      maxWidth="375px"
      height="640px"
      backgroundColor="surface.background.gray.intense"
      borderWidth="thin"
      borderColor="surface.border.gray.muted"
      borderRadius="medium"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <BottomSheet isOpen={isLanguageSheetOpen} onDismiss={() => setIsLanguageSheetOpen(false)}>
        <BottomSheetHeader title="Choose Language" />
        <BottomSheetBody />
      </BottomSheet>
      <StyledHeader>
        <WorkspaceAvatar>NS</WorkspaceAvatar>
        <Box zIndex={1}>
          <Heading color="interactive.text.onPrimary.normal">Northwind Studio</Heading>
          <StatusWrapper>
            <Text
              marginLeft="spacing.2"
              marginRight="spacing.2"
              size="small"
              color="interactive.text.onPrimary.normal"
            >
              Active workspace
            </Text>
            <InfoIcon size="xsmall" color="interactive.icon.onPrimary.normal" />
          </StatusWrapper>
        </Box>

        <Box display="flex" alignItems="flex-end" flexDirection="column" flex={1}>
          <CloseIcon size="medium" color="interactive.icon.onPrimary.normal" />
          <LanguageSelector onClick={() => setIsLanguageSheetOpen(true)}>
            <Text size="small" color="interactive.text.onPrimary.normal">
              EN
            </Text>
            <ChevronDownIcon size="xsmall" color="interactive.icon.onPrimary.normal" />
          </LanguageSelector>
        </Box>
      </StyledHeader>
      <Box flex={1} overflow="scroll">
        {children}
      </Box>
      <StyledFooter>
        <Box flex={1} flexDirection="column">
          <Text weight="semibold">3 pending updates</Text>
          <Text size="small">Review changes</Text>
        </Box>
        <Box flex={2}>
          <Button size="large" isFullWidth>
            Continue
          </Button>
        </Box>
      </StyledFooter>
    </Box>
  );
};

export { WorkspaceShell };
