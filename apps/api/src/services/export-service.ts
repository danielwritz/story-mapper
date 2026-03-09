import {
  type Activity,
  type Epic,
  type FunctionalRequirement,
  type Release,
  type Story,
  type StoryMapDetail,
  type TechnicalRequirement,
} from '@story-mapper/shared';

export type ExportType = 'overview' | 'technical' | 'functional' | 'full';

interface ExportOptions {
  releaseId?: string;
  date?: Date;
}

const MOSCOW_PRIORITY: Record<Story['priority'], string> = {
  must: 'MUST',
  should: 'SHOULD',
  could: 'COULD',
  wont: "WON'T",
};

const requirementPriorityLabel: Record<TechnicalRequirement['priority'], string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

function formatMetadata(storyMap: StoryMapDetail, stories: Story[], releases: Release[], generatedAt: Date) {
  const metaLine = `> Generated on ${formatDate(generatedAt)} | ${storyMap.epics.length} Epics | ${stories.length} Stories | ${releases.length} Releases`;
  return [`# ${storyMap.title} — Requirements Document`, '', metaLine].join('\n');
}

function tableOfContents(includeOverview: boolean, includeReleasePlan: boolean, includeTechnical: boolean, includeFunctional: boolean) {
  const items: string[] = [];
  if (includeOverview) items.push('- [Story Map Overview](#story-map-overview)');
  if (includeReleasePlan) items.push('- [Release Plan](#release-plan)');
  if (includeTechnical) items.push('- [Technical Requirements](#technical-requirements)');
  if (includeFunctional) items.push('- [Functional Requirements](#functional-requirements)');
  return ['## Table of Contents', ...items].join('\n');
}

function renderStoryRow(index: number, story: Story, releasesById: Record<string, Release | undefined>) {
  const release = story.releaseId ? releasesById[story.releaseId] : undefined;
  const releaseLabel = release ? release.title : 'Unassigned';
  const priorityLabel = MOSCOW_PRIORITY[story.priority];
  const pointsLabel = story.storyPoints ?? '-';
  return `| ${index} | ${story.title} | ${priorityLabel} | ${pointsLabel} | ${releaseLabel} |`;
}

function renderStoriesTable(stories: Story[], releasesById: Record<string, Release | undefined>) {
  const header = ['| # | Story | Priority | Points | Release |', '|---|-------|----------|--------|---------|'];
  const rows = stories.map((story, idx) => renderStoryRow(idx + 1, story, releasesById));
  return [...header, ...rows].join('\n');
}

function renderActivitySection(activity: Activity, stories: Story[], releasesById: Record<string, Release | undefined>) {
  const lines = [`#### Activity: ${activity.title}`, activity.description || '_No description provided._', ''];
  if (stories.length === 0) {
    lines.push('No stories for this activity.');
  } else {
    lines.push(renderStoriesTable(stories, releasesById));
  }
  return lines.join('\n');
}

function renderOverviewSection(storyMap: StoryMapDetail, stories: Story[], releases: Release[]) {
  const releasesById = releases.reduce<Record<string, Release | undefined>>((acc, release) => {
    acc[release.id] = release;
    return acc;
  }, {});
  const lines = ['## Story Map Overview'];

  if (storyMap.epics.length === 0 && stories.length === 0) {
    lines.push('No stories available.');
    return lines.join('\n\n');
  }

  storyMap.epics
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .forEach((epic) => {
      lines.push('', `### Epic: ${epic.title}`, epic.description || '_No description provided._');
      const activities = storyMap.activities.filter((activity) => activity.epicId === epic.id).sort((a, b) => a.sortOrder - b.sortOrder);
      activities.forEach((activity) => {
        const activityStories = stories
          .filter((story) => story.activityId === activity.id)
          .sort((a, b) => a.sortOrder - b.sortOrder);
        lines.push('', renderActivitySection(activity, activityStories, releasesById));
      });
    });

  return lines.join('\n');
}

function renderReleasePlanSection(releases: Release[], stories: Story[], activities: Activity[], epics: Epic[]) {
  const lines = ['## Release Plan'];

  if (releases.length === 0) {
    lines.push('No releases defined.');
    return lines.join('\n\n');
  }

  const activitiesById = activities.reduce<Record<string, Activity | undefined>>((acc, activity) => {
    acc[activity.id] = activity;
    return acc;
  }, {});
  const epicsById = epics.reduce<Record<string, Epic | undefined>>((acc, epic) => {
    acc[epic.id] = epic;
    return acc;
  }, {});

  releases
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .forEach((release) => {
      lines.push('', `### ${release.title}`, release.description || '_No description provided._', '', 'Stories in this release:');
      const releaseStories = stories.filter((story) => story.releaseId === release.id).sort((a, b) => a.sortOrder - b.sortOrder);
      if (releaseStories.length === 0) {
        lines.push('- No stories assigned.');
      } else {
        releaseStories.forEach((story) => {
          const activity = activitiesById[story.activityId];
          const epic = activity ? epicsById[activity.epicId] : undefined;
          const priorityLabel = MOSCOW_PRIORITY[story.priority];
          const pointsLabel = story.storyPoints ?? 'n/a';
          const location = activity && epic ? `under ${activity.title} > ${epic.title}` : 'unlinked';
          lines.push(`- ${story.title} (${priorityLabel}, ${pointsLabel}pts) — ${location}`);
        });
      }
    });

  return lines.join('\n');
}

function groupByCategory(requirements: TechnicalRequirement[]) {
  return requirements.reduce<Record<string, TechnicalRequirement[]>>((acc, req) => {
    acc[req.category] = acc[req.category] || [];
    acc[req.category].push(req);
    return acc;
  }, {});
}

function renderTechnicalSection(requirements: TechnicalRequirement[], storiesById: Record<string, Story | undefined>) {
  const lines = ['## Technical Requirements'];
  if (requirements.length === 0) {
    lines.push('No technical requirements available.');
    return lines.join('\n\n');
  }

  const grouped = groupByCategory(requirements);
  Object.entries(grouped).forEach(([category, items]) => {
    const header = category.charAt(0).toUpperCase() + category.slice(1) + ' Requirements';
    lines.push('', `### ${header}`);
    lines.push('| ID | Requirement | Priority | Source Stories |');
    lines.push('|----|-------------|----------|----------------|');
    items.forEach((req) => {
      const storyList = req.sourceStoryIds
        .map((id) => storiesById[id]?.title || id)
        .join(', ');
      lines.push(`| ${req.id} | ${req.title} | ${requirementPriorityLabel[req.priority]} | ${storyList || '—'} |`);
      if (req.description) {
        lines.push('', req.description);
      }
    });
  });

  return lines.join('\n');
}

function groupByRole(requirements: FunctionalRequirement[]) {
  return requirements.reduce<Record<string, FunctionalRequirement[]>>((acc, req) => {
    acc[req.userRole] = acc[req.userRole] || [];
    acc[req.userRole].push(req);
    return acc;
  }, {});
}

function renderFunctionalSection(requirements: FunctionalRequirement[]) {
  const lines = ['## Functional Requirements'];
  if (requirements.length === 0) {
    lines.push('No functional requirements available.');
    return lines.join('\n\n');
  }

  const grouped = groupByRole(requirements);
  Object.entries(grouped).forEach(([role, items]) => {
    lines.push('', `### ${role}`);
    lines.push('| ID | Requirement | Category | Priority |');
    lines.push('|----|-------------|----------|----------|');
    items.forEach((req) => {
      lines.push(`| ${req.id} | ${req.title} | ${req.category} | ${requirementPriorityLabel[req.priority]} |`);
      if (req.description) {
        lines.push('', req.description);
      }
    });
  });

  return lines.join('\n');
}

function filterByRelease(stories: Story[], releaseId?: string) {
  if (!releaseId) return stories;
  return stories.filter((story) => story.releaseId === releaseId);
}

function filterRequirements<T extends { sourceStoryIds: string[] }>(
  requirements: T[],
  allowedStoryIds: Set<string>,
  releaseId?: string,
) {
  if (!releaseId) return requirements;
  if (allowedStoryIds.size === 0) return [];
  return requirements.filter((req) => req.sourceStoryIds.some((id) => allowedStoryIds.has(id)));
}

export function exportStoryMap(storyMap: StoryMapDetail, type: ExportType, options?: ExportOptions): string {
  const releaseId = options?.releaseId;
  const generatedAt = options?.date ?? new Date();
  const filteredStories = filterByRelease(storyMap.stories, releaseId);
  const allowedStoryIds = new Set(filteredStories.map((story) => story.id));
  const filteredReleases = releaseId
    ? storyMap.releases.filter((release) => release.id === releaseId)
    : storyMap.releases;
  const filteredTechnical = filterRequirements(storyMap.technicalRequirements, allowedStoryIds, releaseId);
  const filteredFunctional = filterRequirements(storyMap.functionalRequirements, allowedStoryIds, releaseId);

  const includeOverview = type === 'overview' || type === 'full';
  const includeTechnical = type === 'technical' || type === 'full';
  const includeFunctional = type === 'functional' || type === 'full';
  const includeReleasePlan = includeOverview || type === 'full';

  const sections: string[] = [];

  sections.push(formatMetadata(storyMap, filteredStories, filteredReleases, generatedAt));
  sections.push(
    tableOfContents(includeOverview, includeReleasePlan, includeTechnical, includeFunctional),
    '---',
  );

  if (includeOverview) {
    sections.push(renderOverviewSection(storyMap, filteredStories, filteredReleases));
    sections.push('---');
    sections.push(renderReleasePlanSection(filteredReleases, filteredStories, storyMap.activities, storyMap.epics));
  }

  if (includeTechnical) {
    const storiesById = filteredStories.reduce<Record<string, Story>>((acc, story) => {
      acc[story.id] = story;
      return acc;
    }, {});
    sections.push('---');
    sections.push(renderTechnicalSection(filteredTechnical, storiesById));
  }

  if (includeFunctional) {
    sections.push('---');
    sections.push(renderFunctionalSection(filteredFunctional));
  }

  return sections.filter(Boolean).join('\n\n');
}

export function buildFilename(title: string, type: ExportType, date: Date) {
  const slug = slugify(title) || 'story-map';
  return `${slug}-${type}-${formatDate(date)}.md`;
}
