import React from 'react';
import { render, screen } from '@testing-library/react';
import KPICard from '../KPICard';

jest.mock('../KPICard.module.css', () => ({
  card: 'card',
  cardHeader: 'cardHeader',
  cardTitle: 'cardTitle',
  iconBox: 'iconBox',
  metricsRow: 'metricsRow',
  metricDivider: 'metricDivider',
  metricItem: 'metricItem',
  metricLabel: 'metricLabel',
  metricValue: 'metricValue',
}));

describe('KPICard Component', () => {
  const mockMetrics = [
    { label: 'Total Load Target', value: '45,000 MT', color: '#1f2430' },
    { label: 'Planned Load', value: '38,200 MT', color: '#2c4cd3' },
    { label: 'Target Achievement', value: '84.8%', color: '#2e9e5b' },
  ];

  it('renders title and metrics correctly', () => {
    render(
      <KPICard
        title="Utilisation"
        iconBg="#dce9fd"
        icon={<span data-testid="mock-icon">Icon</span>}
        metrics={mockMetrics}
      />
    );

    expect(screen.getByText('Utilisation')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByText('Total Load Target')).toBeInTheDocument();
    expect(screen.getByText('45,000 MT')).toBeInTheDocument();
    expect(screen.getByText('Planned Load')).toBeInTheDocument();
    expect(screen.getByText('38,200 MT')).toBeInTheDocument();
    expect(screen.getByText('Target Achievement')).toBeInTheDocument();
    expect(screen.getByText('84.8%')).toBeInTheDocument();
  });

  it('renders custom gradient background when provided', () => {
    const customGradient = 'linear-gradient(to right, #ff0000, #00ff00)';
    const { container } = render(
      <KPICard
        title="Business Impact"
        iconBg="#fbeaa9"
        icon={<span data-testid="impact-icon">Impact</span>}
        metrics={mockMetrics}
        gradient={customGradient}
      />
    );

    const cardDiv = container.firstChild;
    expect(cardDiv).toHaveStyle(`background: ${customGradient}`);
  });
});
