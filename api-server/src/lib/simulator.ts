import type { TimelineEvent, DomainImpact, NewsHeadline, ButterflyNode, AlternateRealityScore } from "./simulation-types";

const DOMAIN_LABELS = [
  "Economy",
  "Society",
  "Technology",
  "Environment",
  "Education",
  "Healthcare",
  "Politics",
  "Psychology",
];

function seededRandom(seed: string, offset: number = 0): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  h = (h + offset * 2654435761) | 0;
  h = ((h ^ (h >>> 16)) * 0x45d9f3b) | 0;
  h = ((h ^ (h >>> 16)) * 0x45d9f3b) | 0;
  h = h ^ (h >>> 16);
  return Math.abs(h) / 2147483648;
}

function getRandom(prompt: string, salt: string, min: number, max: number): number {
  return Math.floor(seededRandom(prompt + salt) * (max - min + 1)) + min;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const TIMELINE_TEMPLATES: Record<string, string[][]> = {
  technology: [
    ["Initial disruption causes massive economic and social upheaval", "critical"],
    ["Early adopters emerge, new industries form around the change", "warning"],
    ["Global governments begin legislating the new paradigm", "warning"],
    ["First generation born entirely in the new reality reaches adulthood", "neutral"],
    ["New equilibrium established — civilization permanently altered", "positive"],
  ],
  society: [
    ["Immediate societal shock — protests, resistance, and fear spread", "critical"],
    ["Cultural adaptation begins — new norms emerge organically", "warning"],
    ["Political systems reorganize around the new social structure", "warning"],
    ["New cultural renaissance as creativity finds new outlets", "positive"],
    ["Transformed civilization enters a new era of human experience", "positive"],
  ],
  environment: [
    ["Ecosystems begin immediate cascade of changes", "critical"],
    ["Mass extinction or proliferation events reshape biodiversity", "critical"],
    ["Human civilization forced to adapt survival strategies", "warning"],
    ["New environmental equilibrium emerges over decades", "neutral"],
    ["Transformed planet supports fundamentally different life", "neutral"],
  ],
  default: [
    ["Initial shockwave disrupts global systems simultaneously", "critical"],
    ["First-order consequences cascade across interconnected societies", "warning"],
    ["New power structures emerge to fill the vacuum", "warning"],
    ["Human civilization stabilizes around the new paradigm", "neutral"],
    ["Long-term consequences become the new normal", "positive"],
  ],
};

const BUTTERFLY_TEMPLATES = [
  { label: "Primary Disruption", description: "The immediate first-order effect of the scenario change" },
  { label: "Economic Cascade", description: "Financial systems adapt or collapse, creating new economic realities" },
  { label: "Social Reorganization", description: "Human communities restructure around new constraints and opportunities" },
  { label: "Technological Pivot", description: "Innovation accelerates in compensatory directions" },
  { label: "Political Realignment", description: "Power structures shift to reflect new resource distributions" },
  { label: "Cultural Transformation", description: "Art, values, and identity evolve to match the new world" },
  { label: "Environmental Feedback", description: "Nature responds to human-caused changes in unexpected ways" },
  { label: "New Equilibrium", description: "A stable but radically different civilization emerges" },
];

const NEWS_SOURCES = ["Future Times", "Galactic Tribune", "New World Post", "Tomorrow Daily", "Civilisation Weekly", "Alt-Reality Report"];
const NEWS_CATEGORIES = ["Breaking", "Analysis", "Economy", "Science", "Politics", "Society", "Technology"];

function generateTimeline(prompt: string, category: string, startYear: number = 2025): TimelineEvent[] {
  const templates = TIMELINE_TEMPLATES[category.toLowerCase()] || TIMELINE_TEMPLATES.default;
  const events: TimelineEvent[] = [];
  const severities = ["critical", "warning", "neutral", "positive"];

  for (let i = 0; i < 6; i++) {
    const year = startYear + getRandom(prompt, `year${i}`, i * 8, i * 15 + 5);
    const template = templates[i % templates.length];
    const severity = template ? template[1] : severities[getRandom(prompt, `sev${i}`, 0, 3)];

    const titles = [
      `${capitalize(category)} systems collapse under the weight of change`,
      "Global leaders convene emergency summit on the new reality",
      "First generation adapts — redefining what it means to be human",
      "New institutions emerge to govern the transformed world",
      "Scientific breakthrough unlocks understanding of the alternate future",
      "Cultural movements reshape identity in a world without the old paradigm",
    ];
    const title = titles[i % titles.length];
    const description = template ? template[0] : "The world continues to adapt to unprecedented change";

    events.push({ year, title, description, severity });
  }

  return events.sort((a, b) => a.year - b.year);
}

function generateDomainImpacts(prompt: string): DomainImpact[] {
  return DOMAIN_LABELS.map((domain, idx) => {
    const score = getRandom(prompt, `domain${idx}`, 15, 95);
    const trendRoll = seededRandom(prompt + `trend${idx}`);
    const trend = trendRoll > 0.6 ? "up" : trendRoll > 0.3 ? "neutral" : "down";

    const summaries: Record<string, string[]> = {
      Economy: [
        "Traditional markets disintegrate as new value systems emerge",
        "Massive wealth redistribution reshapes class structures globally",
        "New economic models based on fundamentally different resources arise",
      ],
      Society: [
        "Social bonds fracture then reform around shared survival and adaptation",
        "Community structures become more local, more resilient, more human",
        "New forms of collective identity emerge from shared alternate experience",
      ],
      Technology: [
        "Innovation accelerates dramatically in compensatory directions",
        "Technologies previously considered unnecessary become critical",
        "New scientific fields emerge to understand the changed world",
      ],
      Environment: [
        "Ecosystems undergo cascading changes as human pressure redistributes",
        "Previously stressed environments begin partial recovery",
        "New ecological relationships emerge in the transformed biosphere",
      ],
      Education: [
        "Curriculum fundamentally restructures around new societal needs",
        "Knowledge transmission adapts to the demands of the alternate reality",
        "Entire academic disciplines become obsolete while new ones emerge",
      ],
      Healthcare: [
        "Disease patterns shift dramatically in the new environmental context",
        "Medical priorities restructure around novel physical and psychological challenges",
        "New health crises emerge while old ones fade in relevance",
      ],
      Politics: [
        "Existing power structures become illegitimate in the new context",
        "Political movements realign around the new sources of conflict and cooperation",
        "Novel governance models emerge to manage unprecedented challenges",
      ],
      Psychology: [
        "Collective trauma reshapes baseline human emotional experience",
        "New psychological frameworks emerge to explain the changed experience",
        "Resilience and adaptation become the defining human traits of the era",
      ],
    };

    const domainSummaries = summaries[domain] || ["Significant changes ripple through this domain"];
    const summary = domainSummaries[getRandom(prompt, `sum${idx}`, 0, domainSummaries.length - 1)];

    const predictions = [
      `${domain} sector contracts by ${getRandom(prompt, `pred1${idx}`, 20, 65)}% within the first decade`,
      `New ${domain.toLowerCase()} models emerge that outperform the old paradigm by ${getRandom(prompt, `pred2${idx}`, 150, 400)}%`,
      `${getRandom(prompt, `pred3${idx}`, 40, 90)}% of ${domain.toLowerCase()} professionals must reskill entirely`,
    ];

    return { domain, score, trend, summary, predictions };
  });
}

function generateNewsHeadlines(prompt: string, startYear: number = 2025): NewsHeadline[] {
  const headlines = [
    `World Leaders Declare Global Emergency as Effects of Change Accelerate`,
    `Scientists Confirm: The Old World Is Gone — What Comes Next`,
    `Markets Crash 40% as Investors Reckon with the New Reality`,
    `First City to Fully Adapt Becomes Model for Global Transformation`,
    `Generation Z Embraces Alternate Future — Older Generations Struggle`,
    `United Nations Convenes Historic Summit to Manage Civilisation Shift`,
    `Breakthrough Research Reveals Unexpected Benefits of the Change`,
    `Last Holdouts Abandon Traditional System as Alternative Proves Superior`,
    `Century of Change Compresses into Decade — Humanity Catches Up`,
    `New Constitution Ratified for World After the Shift`,
  ];

  return headlines.slice(0, 6).map((headline, idx) => ({
    year: startYear + getRandom(prompt, `news${idx}`, idx * 5, idx * 10 + 5),
    headline,
    source: NEWS_SOURCES[getRandom(prompt, `src${idx}`, 0, NEWS_SOURCES.length - 1)],
    category: NEWS_CATEGORIES[getRandom(prompt, `cat${idx}`, 0, NEWS_CATEGORIES.length - 1)],
  })).sort((a, b) => a.year - b.year);
}

function generateButterflyNodes(prompt: string): ButterflyNode[] {
  const nodes: ButterflyNode[] = [];

  for (let i = 0; i < BUTTERFLY_TEMPLATES.length; i++) {
    const template = BUTTERFLY_TEMPLATES[i];
    const childIndices: string[] = [];

    if (i < BUTTERFLY_TEMPLATES.length - 1) {
      childIndices.push(`node-${i + 1}`);
      if (i < BUTTERFLY_TEMPLATES.length - 2 && seededRandom(prompt + `branch${i}`) > 0.5) {
        childIndices.push(`node-${i + 2}`);
      }
    }

    nodes.push({
      id: `node-${i}`,
      label: template.label,
      description: template.description,
      depth: i,
      children: childIndices,
    });
  }

  return nodes;
}

function generateScores(prompt: string): AlternateRealityScore {
  return {
    survivalProbability: getRandom(prompt, "surv", 20, 95),
    economicStability: getRandom(prompt, "econ", 10, 90),
    humanHappiness: getRandom(prompt, "happ", 15, 85),
    technologicalAdvancement: getRandom(prompt, "tech", 25, 98),
    environmentalRisk: getRandom(prompt, "envr", 10, 90),
    overallScore: getRandom(prompt, "over", 20, 85),
  };
}

function generateSummary(prompt: string, category: string): string {
  const summaries = [
    `This alternate reality simulation reveals a world fundamentally transformed by the premise. The immediate shockwave would ripple through ${category.toLowerCase()} systems within months, triggering a cascade of second and third-order effects that would reshape human civilization over decades. Early disruption gives way to adaptation, then innovation, then a new equilibrium that future generations would consider perfectly normal — though profoundly different from our current trajectory.`,
    `Our simulation engine has processed this scenario across multiple probability branches. The data suggests a high-volatility transition period followed by stabilization into a genuinely different but viable civilization. The ${category.toLowerCase()} domain shows the most dramatic shifts, while human resilience consistently emerges as the defining factor in navigating the change. The probability matrix indicates this alternate timeline is more plausible than most would assume.`,
    `Analysis of this hypothetical reveals layered consequences that compound across time horizons. What begins as a ${category.toLowerCase()} disruption becomes a civilizational inflection point. The simulation identifies several critical junctures where the trajectory could fork dramatically. Most probability branches converge on a world that, while unrecognizable to us, functions with internal coherence — proof that human civilization is more adaptive than we typically acknowledge.`,
  ];
  return summaries[getRandom(prompt, "sum", 0, summaries.length - 1)];
}

export function generateSimulation(prompt: string, category: string) {
  const normalizedCategory = category.toLowerCase();
  const probabilityScore = getRandom(prompt, "prob", 15, 88);
  const startYear = 2025;

  return {
    summary: generateSummary(prompt, category),
    probabilityScore,
    timeline: generateTimeline(prompt, normalizedCategory, startYear),
    domainImpacts: generateDomainImpacts(prompt),
    newsHeadlines: generateNewsHeadlines(prompt, startYear),
    butterflyNodes: generateButterflyNodes(prompt),
    scores: generateScores(prompt),
  };
}
