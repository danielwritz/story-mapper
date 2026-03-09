import { Router } from 'express';
import { getStoryMapById } from '../data/story-map-store';
import { buildFilename, exportStoryMap, type ExportType } from '../services/export-service';

const router = Router();
const EXPORT_TYPES: ExportType[] = ['overview', 'technical', 'functional', 'full'];

router.get('/:mapId/export/:type', (req, res) => {
  const { mapId, type } = req.params;
  if (!EXPORT_TYPES.includes(type as ExportType)) {
    return res.status(400).json({ error: 'Invalid export type' });
  }

  const storyMap = getStoryMapById(mapId);
  if (!storyMap) {
    return res.status(404).json({ error: 'Story map not found' });
  }

  const releaseId = typeof req.query.releaseId === 'string' ? req.query.releaseId : undefined;
  const now = new Date();
  const markdown = exportStoryMap(storyMap, type as ExportType, { releaseId, date: now });
  const filename = buildFilename(storyMap.title, type as ExportType, now);

  res.setHeader('Content-Type', 'text/markdown');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(markdown);
});

export { router as exportRouter };
