import React from 'react';
import { render, screen } from '@testing-library/react';
import AppHeader from '../AppHeader';

jest.mock('../AppHeader.module.css', () => ({
  header: 'header',
  logoCell: 'logoCell',
  contentArea: 'contentArea',
  titleGroup: 'titleGroup',
  appTitle: 'appTitle',
  subtitleRow: 'subtitleRow',
  subtitleText: 'subtitleText',
  weekBadge: 'weekBadge',
  spacer: 'spacer',
  iconsRow: 'iconsRow',
  divider: 'divider',
  userArea: 'userArea',
  avatar: 'avatar',
  avatarInitials: 'avatarInitials',
  userInfo: 'userInfo',
  userName: 'userName',
  userRole: 'userRole',
}));

describe('AppHeader Component', () => {
  it('renders application title, current week badge, and user profile information', () => {
    render(<AppHeader />);

    expect(screen.getByText('SAMARTH IDPP (SC Nerve Center)')).toBeInTheDocument();
    expect(screen.getByText('Current Week: 31')).toBeInTheDocument();
    expect(screen.getByText('Last refreshed –')).toBeInTheDocument();
    expect(screen.getByText('Suchita Bhide')).toBeInTheDocument();
    expect(screen.getByText('EY Team, member')).toBeInTheDocument();
    expect(screen.getByText('BS')).toBeInTheDocument();
  });
});
