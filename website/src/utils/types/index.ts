import { Roadmap, Topic } from '@prisma/client';

export type RoadmapClientType = Roadmap & { topics: Topic[] };