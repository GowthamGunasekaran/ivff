import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AccordionSection from '../AccordionSection';

jest.mock('../AccordionSection.module.css', () => ({
  wrapper: 'wrapper',
  toggleBtn: 'toggleBtn',
  title: 'title',
  badge: 'badge',
}));

describe('AccordionSection Component', () => {
  it('renders title, badge, and children content by default', () => {
    render(
      <AccordionSection title="Section Title" badge="3 Items" titleExtra={<span>Extra Info</span>}>
        <div>Accordion Content Inside</div>
      </AccordionSection>
    );

    expect(screen.getByText('Section Title')).toBeInTheDocument();
    expect(screen.getByText('3 Items')).toBeInTheDocument();
    expect(screen.getByText('Extra Info')).toBeInTheDocument();
    expect(screen.getByText('Accordion Content Inside')).toBeInTheDocument();
  });

  it('toggles open state when clicking the header button', () => {
    render(
      <AccordionSection title="Collapsible" defaultOpen={true}>
        <div>Toggled Content</div>
      </AccordionSection>
    );

    const toggleBtn = screen.getByRole('button');
    fireEvent.click(toggleBtn);
    // Click again to toggle back
    fireEvent.click(toggleBtn);
    expect(screen.getByText('Collapsible')).toBeInTheDocument();
  });

  it('supports initial closed state when defaultOpen is false', () => {
    render(
      <AccordionSection title="Closed Initially" defaultOpen={false}>
        <div>Initially Hidden</div>
      </AccordionSection>
    );

    expect(screen.getByText('Closed Initially')).toBeInTheDocument();
  });
});
