import type { StoryMapDetail } from '@story-mapper/shared';

let storyMaps: StoryMapDetail[] = [];

export function setStoryMaps(data: StoryMapDetail[]) {
  storyMaps = data;
}

export function getStoryMapById(id: string): StoryMapDetail | undefined {
  return storyMaps.find((map) => map.id === id);
}

export function clearStoryMaps() {
  storyMaps = [];
}
