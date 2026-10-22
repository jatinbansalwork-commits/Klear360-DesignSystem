/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo } from 'react';
import { ComponentRenderer } from '../GenUISchemaRenderer';
import type { InfoGroupComponent, GenUIComponent } from '../GenUIComponentTypes';
import { InfoGroup, InfoItem, InfoItemKey, InfoItemValue } from '~components/InfoGroup';

const RenderInfoGroupComponent = memo(({ items }: InfoGroupComponent) => {
  if (!items || items.length === 0) {
    return null;
  }

  // Filter out invalid items during streaming
  // Filters out: null, undefined, and empty string children
  const validItems = items.filter((item) => {
    const children = item.value?.children;
    if (!item.key?.children || children == null) return false;
    return typeof children !== 'string' || children !== '';
  });

  if (validItems.length === 0) {
    return null;
  }

  return (
    <InfoGroup marginY="spacing.3" itemOrientation="horizontal" size="medium" valueAlign="left">
      {validItems.map((item, index) => {
        const value = item.value!;
        const isString = typeof value.children === 'string';

        if (isString) {
          return (
            <InfoItem key={index}>
              <InfoItemKey helpText={item?.key?.helpText}>{item?.key?.children}</InfoItemKey>
              <InfoItemValue helpText={value.helpText}>{value.children as string}</InfoItemValue>
            </InfoItem>
          );
        }

        return (
          <InfoItem key={index}>
            <InfoItemKey helpText={item?.key?.helpText}>{item?.key?.children}</InfoItemKey>
            <InfoItemValue helpText={value.helpText}>
              <ComponentRenderer component={value.children as GenUIComponent} index={index} />
            </InfoItemValue>
          </InfoItem>
        );
      })}
    </InfoGroup>
  );
});

export { RenderInfoGroupComponent };
