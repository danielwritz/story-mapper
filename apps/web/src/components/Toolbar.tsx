import { ExportMenu } from './ExportMenu';

interface ToolbarProps {
  mapId: string;
  mapTitle: string;
  releaseId?: string;
}

export function Toolbar({ mapId, mapTitle, releaseId }: ToolbarProps) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-4 py-3">
      <div className="text-lg font-semibold">{mapTitle}</div>
      <div className="flex items-center gap-3">
        <ExportMenu mapId={mapId} mapTitle={mapTitle} releaseId={releaseId} />
      </div>
    </header>
  );
}
