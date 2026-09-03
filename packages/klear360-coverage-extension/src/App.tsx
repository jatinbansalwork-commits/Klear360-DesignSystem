/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-undef */
import type { ReactElement } from 'react';
import { useState } from 'react';
import {
  ActivityIcon,
  Klear360Provider,
  Button,
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Tabs,
  TabList,
  TabItem,
  TabPanel,
  Tooltip,
  InfoIcon,
  TooltipInteractiveWrapper,
  Link,
  Switch,
} from '@klear/klear360/components';
import { klear360Theme } from '@klear/klear360/tokens';
import styled from 'styled-components';
import '@klear/klear360/fonts.css';
import BarChartImg from './bar-chart.png';
import { useMediaQuery } from './useMediaQuery';

const StyledImg = styled.img`
  position: absolute;
  left: 12px;
  bottom: 12px;
  opacity: 0.2;
`;

type Klear360Coverage = {
  klear360Coverage: number;
  totalNodes: number;
  klear360Nodes: number;
};

type A11yCoverage = {
  a11yScore: number;
  a11yFocusScore: number;
  a11yStaticScore: number;
};

const App = (): ReactElement => {
  const [coverage, setCoverage] = useState<Klear360Coverage | undefined>(undefined);
  const [a11yCoverage, setA11yCoverage] = useState<A11yCoverage | undefined>(undefined);
  const [currentTab, setCurrentTab] = useState<string>('klear360');
  const [includeNavbars, setIncludeNavbars] = useState<boolean>(true);
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const getKlear360Coverage = (shouldHighlightNodes: boolean): void => {
    // @ts-expect-error
    chrome?.runtime?.sendMessage?.({
      action: 'executeScript',
      shouldHighlightNodes,
      includeNavbars,
    });
  };

  const getA11yCoverage = (shouldHighlightNodes: boolean): void => {
    // @ts-expect-error
    chrome?.runtime?.sendMessage?.({ action: 'executeAccessibilityScript', shouldHighlightNodes });
  };

  const handleTabChange = (value: string): void => {
    // Clear highlighted nodes from the previous tab
    if (currentTab === 'klear360' && coverage) {
      getKlear360Coverage(false);
    } else if (currentTab === 'a11y' && a11yCoverage) {
      getA11yCoverage(false);
    }
    setCurrentTab(value);
  };

  // @ts-expect-error
  chrome?.runtime?.onMessage?.addListener(
    (message: { action: string; coverage: Klear360Coverage | A11yCoverage }, sender: unknown) => {
      console.log('message and sender in popup js', message, sender);
      if (message.action === 'klear360-coverage') {
        setCoverage(message.coverage as Klear360Coverage);
      }
      if (message.action === 'accessibility-coverage') {
        setA11yCoverage(message.coverage as A11yCoverage);
      }
    },
  );

  return (
    <Klear360Provider themeTokens={klear360Theme} colorScheme={isDarkMode ? 'dark' : 'light'}>
      <Box id="klear360-coverage-extension" height="312px" width="500px">
        <Card
          elevation="lowRaised"
          padding="spacing.7"
          backgroundColor="surface.background.gray.moderate"
        >
          <CardBody>
            <Tabs defaultValue="klear360" onChange={handleTabChange}>
              <TabList>
                <TabItem value="klear360">Klear360 Coverage</TabItem>
                <TabItem value="a11y">Accessibility Score</TabItem>
              </TabList>
              <TabPanel value="klear360">
                <Box
                  width="100%"
                  height="251px"
                  marginBottom="spacing.5"
                  backgroundColor="surface.background.gray.intense"
                  position="relative"
                  alignItems="center"
                  justifyContent="center"
                  display="flex"
                  flexDirection="column"
                  padding="spacing.4"
                >
                  {coverage ? (
                    <>
                      <Heading marginBottom="spacing.5">
                        Klear360 Coverage: {coverage.klear360Coverage}%
                      </Heading>
                      <Text size="medium" marginBottom="spacing.5" weight="regular">
                        Total DOM Nodes: {coverage.totalNodes}
                      </Text>
                      <Text size="medium" weight="regular">
                        Total Klear360 Nodes: {coverage.klear360Nodes}
                      </Text>
                    </>
                  ) : (
                    <Text textAlign="center">
                      Open a page which uses Klear360 then click the calculate Button
                    </Text>
                  )}
                  <StyledImg src={BarChartImg} alt="bar-chart" />
                </Box>
                <Box display="flex" alignItems="center" flexDirection="column" gap="spacing.3">
                  <Text as="label" marginBottom="spacing.3">
                    <Box display="flex" alignItems="center" gap="spacing.3">
                      <Switch
                        accessibilityLabel="Include navbars in coverage calculation"
                        isChecked={includeNavbars}
                        onChange={({ isChecked }) => setIncludeNavbars(isChecked)}
                      />
                      Include Navbars
                    </Box>
                  </Text>
                  <Button
                    icon={ActivityIcon}
                    iconPosition="left"
                    onClick={() => {
                      if (a11yCoverage) {
                        getA11yCoverage(false);
                      }
                      getKlear360Coverage(true);
                    }}
                  >
                    Calculate Klear360 Coverage
                  </Button>
                  <Link
                    variant="button"
                    marginTop="spacing.3"
                    onClick={() => {
                      if (coverage) {
                        getKlear360Coverage(false);
                      }
                    }}
                  >
                    Clear Highlighted Nodes
                  </Link>
                </Box>
              </TabPanel>
              <TabPanel value="a11y">
                <Box
                  width="100%"
                  height="251px"
                  marginBottom="spacing.5"
                  backgroundColor="surface.background.gray.intense"
                  position="relative"
                  alignItems="center"
                  justifyContent="center"
                  display="flex"
                  flexDirection="column"
                  padding="spacing.4"
                >
                  {a11yCoverage ? (
                    <>
                      <Heading marginBottom="spacing.5">
                        Accessibility Score: {a11yCoverage.a11yScore}%
                      </Heading>
                      <Box
                        display="flex"
                        alignItems="center"
                        marginBottom="spacing.5"
                        gap="spacing.2"
                      >
                        <Text size="medium" weight="regular">
                          Focus Coverage Score: {a11yCoverage.a11yFocusScore}%
                        </Text>
                        <Tooltip content="How many of the elements should be focusable vs are focusable">
                          <TooltipInteractiveWrapper>
                            <InfoIcon color="surface.icon.gray.muted" size="medium" />
                          </TooltipInteractiveWrapper>
                        </Tooltip>
                      </Box>
                      <Box display="flex" alignItems="center" gap="spacing.2">
                        <Text size="medium" weight="regular">
                          Static Coverage Score: {a11yCoverage.a11yStaticScore}%
                        </Text>
                        <Tooltip content="How many elements fail static accessibility checks such as Image with alt, Button with no text, etc.">
                          <TooltipInteractiveWrapper>
                            <InfoIcon color="surface.icon.gray.muted" size="medium" />
                          </TooltipInteractiveWrapper>
                        </Tooltip>
                      </Box>
                      <Box marginTop="spacing.5" textAlign="center">
                        <Text>Check browser console to see the accessibility violations</Text>
                      </Box>
                    </>
                  ) : (
                    <Text>Click the button below to check accessibility</Text>
                  )}
                  <StyledImg src={BarChartImg} alt="bar-chart" />
                </Box>
                <Box display="flex" alignItems="center" flexDirection="column" gap="spacing.3">
                  <Button
                    icon={ActivityIcon}
                    iconPosition="left"
                    onClick={() => {
                      if (coverage) {
                        getKlear360Coverage(false);
                      }
                      getA11yCoverage(true);
                    }}
                  >
                    Check Accessibility
                  </Button>
                  <Link
                    variant="button"
                    marginTop="spacing.3"
                    onClick={() => {
                      if (a11yCoverage) {
                        getA11yCoverage(false);
                      }
                    }}
                  >
                    Clear Highlighted Nodes
                  </Link>
                </Box>
              </TabPanel>
            </Tabs>
          </CardBody>
        </Card>
      </Box>
    </Klear360Provider>
  );
};

export default App;
