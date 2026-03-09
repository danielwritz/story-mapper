import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App', () => {
  it('renders the Story Mapper heading', () => {
    render(<App />);
    expect(screen.getByText('Story Mapper')).toBeInTheDocument();
  });

  it('heading has correct styling classes', () => {
    render(<App />);
    const heading = screen.getByText('Story Mapper');
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-gray-900');
  });

  it('app container is present', () => {
    render(<App />);
    const container = screen.getByTestId('app-shell');
    expect(container).toBeInTheDocument();
  });
});
