import { z } from 'zod';
import { ActivitySchema, type Activity } from './activity';
import { EpicSchema, type Epic } from './epic';
import { FunctionalRequirementSchema, type FunctionalRequirement } from './functional-requirement';
import { ReleaseSchema, type Release } from './release';
import { StorySchema, type Story } from './story';
import { StoryMapSchema, type StoryMap } from './story-map';
import { TechnicalRequirementSchema, type TechnicalRequirement } from './technical-requirement';

export const StoryMapDetailSchema = StoryMapSchema.extend({
  epics: z.array(EpicSchema),
  activities: z.array(ActivitySchema),
  stories: z.array(StorySchema),
  releases: z.array(ReleaseSchema),
  technicalRequirements: z.array(TechnicalRequirementSchema),
  functionalRequirements: z.array(FunctionalRequirementSchema),
}).strict();

export type StoryMapDetail = StoryMap & {
  epics: Epic[];
  activities: Activity[];
  stories: Story[];
  releases: Release[];
  technicalRequirements: TechnicalRequirement[];
  functionalRequirements: FunctionalRequirement[];
};
