import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExportMenu } from './ExportMenu';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ExportMenu', () => {
  const props = { mapId: 'map-1', mapTitle: 'Demo Map' };

  it('renders export button', () => {
    render(<ExportMenu {...props} />);
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
  });

  it('clicking button shows dropdown with options', async () => {
    render(<ExportMenu {...props} />);
    const trigger = screen.getByRole('button', { name: /export/i });
    await userEvent.click(trigger);

    expect(screen.getByText('Story Map Overview')).toBeInTheDocument();
    expect(screen.getByText('Technical Requirements')).toBeInTheDocument();
    expect(screen.getByText('Functional Requirements')).toBeInTheDocument();
    expect(screen.getByText('Full Document (All)')).toBeInTheDocument();
  });

  it('clicking an option triggers download', async () => {
    const textSpy = vi.fn().mockResolvedValue('markdown content');
    const fetchSpy = vi.fn().mockResolvedValue({
      text: textSpy,
      headers: new Headers({ 'Content-Disposition': 'attachment; filename="demo-map-full-2026-03-09.md"' }),
    } as Response);
    vi.stubGlobal('fetch', fetchSpy as unknown as typeof fetch);

    const clickMock = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    const anchor = originalCreateElement('a');
    vi.spyOn(anchor, 'click').mockImplementation(clickMock);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'a') {
        return anchor as HTMLElement;
      }
      return originalCreateElement(tagName);
    });

    const createObjectUrlSpy = vi.fn().mockReturnValue('blob:demo');
    const revokeSpy = vi.fn();
    // jsdom does not implement these, so stub them for the download helper
    (URL as any).createObjectURL = createObjectUrlSpy;
    (URL as any).revokeObjectURL = revokeSpy;

    render(<ExportMenu {...props} releaseId="rel-1" />);
    await userEvent.click(screen.getByRole('button', { name: /export/i }));
    await userEvent.click(screen.getByText('Full Document (All)'));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('/api/story-maps/map-1/export/full?releaseId=rel-1');
    });

    expect(textSpy).toHaveBeenCalled();
    expect(createObjectUrlSpy).toHaveBeenCalled();
    expect(revokeSpy).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
  });
});
