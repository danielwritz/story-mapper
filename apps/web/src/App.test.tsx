import { render, screen } from '@testing-library/react';
import { App } from './App.tsx';
import styles from './index.css?inline';

describe('App', () => {
  it('renders the Story Mapper heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /story mapper/i })).toBeInTheDocument();
  });

  it('heading has correct styling classes', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: /story mapper/i });
    expect(heading).toHaveClass('text-4xl', 'font-semibold', 'tracking-tight');
  });

  it('applies Tailwind utility styles to the app container', () => {
    render(<App />);
    const container = screen.getByTestId('app-shell');

    expect(container).toHaveClass('bg-gray-100');
    expect(styles).toContain('.bg-gray-100');
  });
});
