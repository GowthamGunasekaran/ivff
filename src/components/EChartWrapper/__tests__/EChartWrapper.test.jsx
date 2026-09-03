import React from 'react';
import { render, screen } from '@testing-library/react';
import EChartWrapper from '../EChartWrapper';

// Mock echarts-for-react with forwardRef exposing getEchartsInstance
jest.mock('echarts-for-react', () => {
  const React = require('react');
  return React.forwardRef(function MockReactECharts({ option, style }, ref) {
    React.useImperativeHandle(ref, () => ({
      getEchartsInstance: () => ({
        resize: jest.fn(),
      }),
    }));
    return (
      <div
        data-testid="echart-container"
        data-option={JSON.stringify(option)}
        style={style}
      />
    );
  });
});

jest.mock('../EChartWrapper.module.css', () => ({
  chartWrapper: 'chartWrapper',
  chartTitle: 'chartTitle',
}));

describe('EChartWrapper Component', () => {
  const mockOption = {
    title: { text: 'Performance' },
    xAxis: { data: ['Mon', 'Tue', 'Wed'] },
    series: [{ type: 'line', data: [80, 85, 90] }],
  };

  it('renders the chart title', () => {
    render(<EChartWrapper title="Utilisation Trend (%)" option={mockOption} />);
    expect(screen.getByText('Utilisation Trend (%)')).toBeInTheDocument();
  });

  it('renders the mocked chart container with provided options and custom height', () => {
    render(<EChartWrapper title="Utilisation Trend (%)" option={mockOption} height={180} />);
    const chart = screen.getByTestId('echart-container');
    expect(chart).toBeInTheDocument();
    expect(chart).toHaveStyle({ height: '180px' });
  });
});
