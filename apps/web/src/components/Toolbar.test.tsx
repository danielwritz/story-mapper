import React from 'react';
import { render, screen } from '@testing-library/react';
import { Toolbar } from './Toolbar';

describe('Toolbar', () => {
  it('renders the app title', () => {
    render(<Toolbar />);
    expect(screen.getByText('Story Mapper')).toBeInTheDocument();
  });

  it('has correct test id', () => {
    render(<Toolbar />);
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
  });

  it('toolbar has fixed height styling', () => {
    render(<Toolbar />);
    expect(screen.getByTestId('toolbar')).toHaveClass('h-12');
  });
});
