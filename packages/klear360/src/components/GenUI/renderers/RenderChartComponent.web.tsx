/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { memo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { formatNumber } from '@klear/i18n';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Skeleton } from '~components/Skeleton';
import {
  ChartBar,
  ChartBarWrapper,
  ChartLine,
  ChartLineWrapper,
  ChartDonut,
  ChartDonutWrapper,
  ChartArea,
  ChartAreaWrapper,
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartTooltip,
  ChartLegend,
} from '~components/Charts';
import type { ChartComponent } from '../GenUIComponentTypes';

const ComponentErrorFallback = () => {
  return (
    <Box
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      width="100%"
    >
      <Text size="medium" weight="regular">
        Error rendering component
      </Text>
    </Box>
  );
};

const ChartSkeletonLoader = ({
  title,
  isTiny,
  chartHeight = '350px',
}: {
  title?: string;
  isTiny?: boolean;
  chartHeight?: string;
}) => {
  return (
    <Box width="100%" display="flex" flexDirection="column" gap="spacing.3" marginY="spacing.3">
      {title && !isTiny ? (
        <Skeleton width="200px" height="24px" borderRadius="medium" marginBottom="spacing.3" />
      ) : null}
      <Box
        width="100%"
        height={chartHeight as '100px' | '350px'}
        display="flex"
        flexDirection="column"
        gap="spacing.3"
      >
        <Box display="flex" flexDirection="row" gap="spacing.3" height="100%">
          <Skeleton width="40px" height="100%" borderRadius="medium" />
          <Skeleton width="100%" height="100%" borderRadius="medium" />
        </Box>
        <Skeleton width="100%" height="40px" borderRadius="medium" />
      </Box>
    </Box>
  );
};

const RenderChartComponent = memo(
  ({
    chartType,
    title,
    xAxis,
    data,
    unit = '',
    variant = 'full',
    valueFormatter,
  }: ChartComponent) => {
    const isTiny = variant === 'tiny';
    const chartHeight = isTiny ? '100px' : '350px';
    const minHeight = isTiny ? '100px' : '350px';
    const isLoading =
      !chartType || !xAxis || !data || data.length === 0 || !valueFormatter || !valueFormatter.type;

    // Handle incomplete data during streaming
    if (isLoading) {
      return <ChartSkeletonLoader title={title} isTiny={isTiny} chartHeight={chartHeight} />;
    }

    // Filter out empty objects and incomplete data from streaming
    const validData = data.filter((item) => {
      if (!item || Object.keys(item).length === 0) return false;

      // Check if xAxis key exists and has a valid value
      if (!item[xAxis] || item[xAxis] === '') return false;

      // Check if at least one numeric value exists
      const hasNumericValue = Object.keys(item).some(
        (key) => key !== xAxis && typeof item[key] === 'number' && !isNaN(Number(item[key])),
      );

      return hasNumericValue;
    });

    if (validData.length === 0) {
      return <ChartSkeletonLoader title={title} isTiny={isTiny} chartHeight={chartHeight} />;
    }

    // Auto-detect all numeric keys except xAxis for plotting
    const firstItem = validData[0];
    const keysToPlot = Object.keys(firstItem).filter(
      (key) => key !== xAxis && typeof firstItem[key] === 'number',
    );

    if (keysToPlot.length === 0) {
      return <ChartSkeletonLoader title={title} isTiny={isTiny} chartHeight={chartHeight} />;
    }

    const tickFormatter = (value: number | string) => {
      const numValue = typeof value === 'string' ? parseFloat(value) : value;

      if (isNaN(numValue)) {
        return value.toString();
      }

      // Use valueFormatter if provided, otherwise fall back to unit
      if (valueFormatter) {
        const { type, currency: formatterCurrency, suffix: formatterSuffix } = valueFormatter;

        const buildPrefixSuffixString = (v: string) => {
          return `${v}${formatterSuffix ?? ''}`;
        };

        try {
          switch (type) {
            case 'currency': {
              const formatted = formatNumber(numValue, {
                currency: (formatterCurrency ?? 'INR') as 'INR',
                intlOptions: {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                },
              });
              return buildPrefixSuffixString(formatted);
            }

            case 'percentage': {
              const formatted = formatNumber(numValue / 100, {
                intlOptions: {
                  style: 'percent',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                },
              });
              if (formatterSuffix === '%') {
                return formatted;
              } else {
                return buildPrefixSuffixString(formatted);
              }
            }

            case 'number': {
              const numberFormatted = formatNumber(numValue, {
                intlOptions: {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                },
              });
              return buildPrefixSuffixString(numberFormatted);
            }

            case 'string': {
              return buildPrefixSuffixString(numValue.toString());
            }

            default:
              return numValue.toString();
          }
        } catch (error) {
          console.error('[GenUI Chart]: Error formatting value:', error);
          return numValue.toString();
        }
      }

      // Fallback to legacy unit formatting
      return `${numValue.toString()}${unit}`;
    };

    // TODO: Refactor into smaller components
    return (
      <ErrorBoundary FallbackComponent={ComponentErrorFallback}>
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          gap="spacing.3"
          marginY="spacing.3"
          minHeight={chartHeight}
        >
          {title && !isTiny ? (
            <Text
              size="large"
              weight="regular"
              color="surface.text.gray.subtle"
              marginBottom="spacing.3"
            >
              {title}
            </Text>
          ) : null}
          <Box width="100%" height={chartHeight} minHeight={minHeight}>
            {chartType === 'bar' ? (
              <ChartBarWrapper
                width="100%"
                height={chartHeight}
                data={validData}
                colorTheme="categorical"
              >
                {!isTiny ? <ChartCartesianGrid /> : null}
                {!isTiny ? <ChartXAxis dataKey={xAxis} /> : null}
                {!isTiny ? <ChartYAxis tickFormatter={tickFormatter} /> : null}
                {keysToPlot.map((key) => (
                  <ChartBar key={key} dataKey={key} name={key} />
                ))}
                {!isTiny ? <ChartLegend /> : null}
                {!isTiny ? <ChartTooltip /> : null}
              </ChartBarWrapper>
            ) : chartType === 'line' ? (
              <ChartLineWrapper
                width="100%"
                height={chartHeight}
                minHeight={minHeight}
                data={validData}
                colorTheme="categorical"
              >
                {!isTiny ? <ChartCartesianGrid /> : null}
                {!isTiny ? <ChartXAxis dataKey={xAxis} /> : null}
                {!isTiny ? <ChartYAxis tickFormatter={tickFormatter} /> : null}
                {keysToPlot.map((key) => (
                  <ChartLine key={key} dataKey={key} name={key} />
                ))}
                {!isTiny ? <ChartLegend /> : null}
                {!isTiny ? <ChartTooltip /> : null}
              </ChartLineWrapper>
            ) : chartType === 'area' ? (
              <ChartAreaWrapper
                width="100%"
                height={chartHeight}
                minHeight={minHeight}
                data={validData}
                colorTheme="categorical"
              >
                {!isTiny ? <ChartCartesianGrid /> : null}
                {!isTiny ? <ChartXAxis dataKey={xAxis} /> : null}
                {!isTiny ? <ChartYAxis tickFormatter={tickFormatter} /> : null}
                {keysToPlot.map((key) => (
                  <ChartArea key={key} dataKey={key} name={key} type="monotone" />
                ))}
                {!isTiny ? <ChartLegend /> : null}
                {!isTiny ? <ChartTooltip /> : null}
              </ChartAreaWrapper>
            ) : chartType === 'pie' ? (
              <ChartDonutWrapper width="100%" height={chartHeight} minHeight={minHeight}>
                <ChartDonut
                  dataKey={keysToPlot[0]}
                  nameKey={xAxis}
                  data={validData}
                  radius="medium"
                  type="circle"
                />
                {!isTiny ? <ChartLegend /> : null}
                {!isTiny ? <ChartTooltip /> : null}
              </ChartDonutWrapper>
            ) : null}
          </Box>
        </Box>
      </ErrorBoundary>
    );
  },
  // Custom comparison - only re-render if data length or key fields change
  (prevProps, nextProps) => {
    return (
      prevProps.chartType === nextProps.chartType &&
      prevProps.title === nextProps.title &&
      prevProps.xAxis === nextProps.xAxis &&
      prevProps.variant === nextProps.variant &&
      prevProps.data?.length === nextProps.data?.length &&
      JSON.stringify(prevProps.data?.[prevProps.data.length - 1]) ===
        JSON.stringify(nextProps.data?.[nextProps.data.length - 1]) &&
      JSON.stringify(prevProps.valueFormatter) === JSON.stringify(nextProps.valueFormatter)
    );
  },
);

export { RenderChartComponent };
