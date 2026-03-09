import { useState } from 'react';

type ExportType = 'overview' | 'technical' | 'functional' | 'full';

interface ExportMenuProps {
  mapId: string;
  mapTitle: string;
  releaseId?: string;
}

const EXPORT_OPTIONS: { label: string; type: ExportType }[] = [
  { label: 'Story Map Overview', type: 'overview' },
  { label: 'Technical Requirements', type: 'technical' },
  { label: 'Functional Requirements', type: 'functional' },
  { label: 'Full Document (All)', type: 'full' },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function parseFilename(disposition: string | null, fallback: string) {
  if (!disposition) return fallback;
  const match = disposition.match(/filename="?([^";]+)"?/i);
  return match?.[1] || fallback;
}

function buildFallbackFilename(mapTitle: string, type: ExportType) {
  const slug = slugify(mapTitle) || 'story-map';
  const date = new Date().toISOString().split('T')[0];
  return `${slug}-${type}-${date}.md`;
}

function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function fetchMarkdown(mapId: string, mapTitle: string, type: ExportType, releaseId?: string) {
  const query = releaseId ? `?releaseId=${encodeURIComponent(releaseId)}` : '';
  const response = await fetch(`/api/story-maps/${mapId}/export/${type}${query}`);
  const content = await response.text();
  const filename = parseFilename(response.headers.get('content-disposition'), buildFallbackFilename(mapTitle, type));
  return { content, filename };
}

export function ExportMenu({ mapId, mapTitle, releaseId }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState<ExportType | null>(null);

  const handleSelect = async (type: ExportType) => {
    setDownloading(type);
    try {
      const { content, filename } = await fetchMarkdown(mapId, mapTitle, type, releaseId);
      downloadMarkdown(content, filename || buildFallbackFilename(mapTitle, type));
    } finally {
      setDownloading(null);
      setOpen(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button type="button" onClick={() => setOpen((prev) => !prev)} aria-haspopup="menu" aria-expanded={open}>
        {downloading ? 'Exporting…' : 'Export'}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 min-w-[200px] rounded border bg-white shadow">
          {EXPORT_OPTIONS.map((option) => (
            <button
              key={option.type}
              type="button"
              role="menuitem"
              onClick={() => handleSelect(option.type)}
              disabled={!!downloading}
              className="block w-full px-3 py-2 text-left hover:bg-slate-100"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
