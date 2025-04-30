
export interface PsyToolkitTest {
  id: string;
  name: string;
  description: string;
  embedUrl: string;
  category: string;
}

// PsyToolkit tests with correct embed URLs
export const psyToolkitTests: PsyToolkitTest[] = [
  {
    id: "stroop",
    name: "Stroop Test",
    description: "The Stroop test measures your ability to focus on relevant information and ignore irrelevant information.",
    embedUrl: "https://www.psytoolkit.org/experiment-library/stroop.html",
    category: "cognitive"
  },
  {
    id: "memory",
    name: "Visual Memory Test",
    description: "Test your visual memory capacity and recall abilities.",
    embedUrl: "https://www.psytoolkit.org/experiment-library/memory.html",
    category: "cognitive"
  },
  {
    id: "reaction",
    name: "Reaction Time Test",
    description: "Measure your reaction time to visual stimuli.",
    embedUrl: "https://www.psytoolkit.org/experiment-library/simple-rt.html",
    category: "cognitive"
  },
  {
    id: "bigfive",
    name: "Big Five Personality Test",
    description: "Assess your personality across five major dimensions: openness, conscientiousness, extraversion, agreeableness, and neuroticism.",
    embedUrl: "https://www.psytoolkit.org/survey-library/big5.html",
    category: "personality"
  },
  {
    id: "anxiety",
    name: "Anxiety Assessment (GAD-7)",
    description: "Evaluate your current anxiety levels with this standardized assessment.",
    embedUrl: "https://www.psytoolkit.org/survey-library/anxiety-gad7.html",
    category: "clinical"
  },
  {
    id: "depression",
    name: "Depression Questionnaire (PHQ-9)",
    description: "A standardized screening tool for depression symptoms.",
    embedUrl: "https://www.psytoolkit.org/survey-library/depression-phq9.html",
    category: "clinical"
  },
  {
    id: "stress",
    name: "Perceived Stress Scale",
    description: "Measure your perception of stress in your life.",
    embedUrl: "https://www.psytoolkit.org/survey-library/stress-pss.html",
    category: "clinical"
  },
  // Adding culturally relevant tests for Arabic users
  {
    id: "social-anxiety",
    name: "Social Anxiety Assessment",
    description: "Evaluate your level of anxiety in social situations.",
    embedUrl: "https://www.psytoolkit.org/survey-library/social-anxiety-lsas.html",
    category: "clinical"
  },
  {
    id: "life-satisfaction",
    name: "Life Satisfaction Scale",
    description: "Measure your overall satisfaction with life.",
    embedUrl: "https://www.psytoolkit.org/survey-library/life-satisfaction-swls.html",
    category: "wellbeing"
  },
  {
    id: "emotional-intelligence",
    name: "Emotional Intelligence Assessment",
    description: "Evaluate your ability to recognize and manage emotions in yourself and others.",
    embedUrl: "https://www.psytoolkit.org/survey-library/emotional-intelligence-wleis.html",
    category: "personality"
  },
  {
    id: "childhood-trauma",
    name: "Childhood Experiences Questionnaire",
    description: "Assess impacts of early life experiences on current wellbeing.",
    embedUrl: "https://www.psytoolkit.org/survey-library/childhood-trauma-ctq.html",
    category: "clinical"
  },
  {
    id: "relationship-satisfaction",
    name: "Relationship Satisfaction Scale",
    description: "Evaluate satisfaction levels in your close relationships.",
    embedUrl: "https://www.psytoolkit.org/survey-library/relationship-satisfaction-rss.html",
    category: "wellbeing"
  },
  {
    id: "resilience",
    name: "Psychological Resilience Scale",
    description: "Measure your ability to bounce back from adversity.",
    embedUrl: "https://www.psytoolkit.org/survey-library/resilience-short.html",
    category: "wellbeing"
  }
];
