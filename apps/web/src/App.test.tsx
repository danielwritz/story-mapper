import React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from './App';

describe('App', () => {
  it('renders toolbar and canvas', () => {
    render(<App />);
    expect(screen.getByTestId('toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('canvas-container')).toBeInTheDocument();
  });

  it('app fills the viewport', () => {
    const { container } = render(<App />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass('h-screen');
    expect(root).toHaveClass('w-screen');
  });
});
