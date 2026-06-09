export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  severity: string;
}

export interface DomainImpact {
  domain: string;
  score: number;
  trend: string;
  summary: string;
  predictions: string[];
}

export interface NewsHeadline {
  year: number;
  headline: string;
  source: string;
  category: string;
}

export interface ButterflyNode {
  id: string;
  label: string;
  description: string;
  depth: number;
  children: string[];
}

export interface AlternateRealityScore {
  survivalProbability: number;
  economicStability: number;
  humanHappiness: number;
  technologicalAdvancement: number;
  environmentalRisk: number;
  overallScore: number;
}
