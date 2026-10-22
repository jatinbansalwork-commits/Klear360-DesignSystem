/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo } from 'react';
import { ComponentRenderer } from '../GenUISchemaRenderer';
import { genUISpacingContract } from '../GenUISpacing';
import type { CardComponent } from '../GenUIComponentTypes';
import { Box } from '~components/Box';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  CardFooter,
  CardFooterLeading,
} from '~components/Card';

const RenderCardComponent = memo(({ title, description, footer, children }: CardComponent) => {
  const hasHeader = title || description;

  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      gap={genUISpacingContract.compactCardRowGap}
    >
      <Card width="100%" height="100%" padding={genUISpacingContract.compactCardPadding}>
        {hasHeader ? (
          <CardHeader>
            <CardHeaderLeading title={title || ''} subtitle={description || ''} />
          </CardHeader>
        ) : null}

        {children && children.length > 0 ? (
          <CardBody height="100%">
            <Box display="flex" flexDirection="column" gap={genUISpacingContract.compactCardRowGap}>
              {children.map((child, index) => {
                return <ComponentRenderer key={index} component={child} index={index} />;
              })}
            </Box>
          </CardBody>
        ) : null}

        {footer ? (
          <CardFooter
            showDivider={true}
            marginTop={genUISpacingContract.cardTableToFooterAction}
            paddingTop={genUISpacingContract.cardTableToFooterAction}
          >
            <CardFooterLeading subtitle={footer} />
          </CardFooter>
        ) : null}
      </Card>
    </Box>
  );
});

export { RenderCardComponent };
