import React from 'react';
import { render, screen } from '@testing-library/react';
import LeftRail from '../LeftRail';

jest.mock('../LeftRail.module.css', () => ({
  rail: 'rail',
  labelSection: 'labelSection',
  sectionLabel: 'sectionLabel',
  navBtn: 'navBtn',
  navBtnActive: 'navBtnActive',
}));

describe('LeftRail Component', () => {
  it('renders section label DPS and 5 navigation buttons', () => {
    render(<LeftRail />);

    expect(screen.getByText('DPS')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
  });
});
