import React from 'react';
import { render, screen } from '@testing-library/react';
import { PBadge, FillBadge, StatusBadge } from '../TableBadges';

jest.mock('../ShipmentTableRows.module.css', () => ({
  badgeP: 'badgeP',
  badgeFill: 'badgeFill',
  badgeStatus: 'badgeStatus',
}));

describe('TableBadges Components', () => {
  it('renders PBadge with P1, P2, P3 and fallback styles', () => {
    const { rerender } = render(<PBadge p="P1" />);
    expect(screen.getByText('P1')).toBeInTheDocument();

    rerender(<PBadge p="P2" />);
    expect(screen.getByText('P2')).toBeInTheDocument();

    rerender(<PBadge p="P3" />);
    expect(screen.getByText('P3')).toBeInTheDocument();

    rerender(<PBadge p="Unknown" />);
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('renders FillBadge', () => {
    render(<FillBadge />);
    expect(screen.getByText('FILL')).toBeInTheDocument();
  });

  it('renders StatusBadge for ACCEPTED, PENDING, and AT RISK', () => {
    const { rerender } = render(<StatusBadge status="ACCEPTED" />);
    expect(screen.getByText('ACCEPTED')).toBeInTheDocument();

    rerender(<StatusBadge status="PENDING" />);
    expect(screen.getByText('PENDING')).toBeInTheDocument();

    rerender(<StatusBadge status="AT RISK" />);
    expect(screen.getByText('AT RISK')).toBeInTheDocument();

    rerender(<StatusBadge status="OTHER" />);
    expect(screen.getByText('OTHER')).toBeInTheDocument();
  });
});
