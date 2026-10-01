export type Skill = {
  id: string;
  name: string;
  glyph: string;
  level: number;
  note?: string;
  children?: Skill[];
};

export type SkillCategory = {
  id: string;
  name: string;
  shortName: string;
  nodes: Skill[];
};

export type SkillWithPath = {
  skill: Skill;
  parentPath: string[];
};

export const skillLevels: Record<number, string> = {
  1: "Iniciante",
  2: "Intermediário",
  3: "Avançado",
  4: "Profissional",
  5: "Especialista",
};

export function flattenSkills(
  nodes: Skill[],
  parentPath: string[] = [],
): SkillWithPath[] {
  return nodes.flatMap((skill) => [
    { skill, parentPath },
    ...flattenSkills(skill.children ?? [], [...parentPath, skill.name]),
  ]);
}

export const skillCategories: SkillCategory[] = [
  {
    id: "backend",
    name: "Back-end",
    shortName: "Back-end",
    nodes: [
      { id: "python", name: "Python", glyph: "PY", level: 4 },
      { id: "r", name: "R", glyph: "R", level: 2 },
      { id: "Matlab", name: "Matlab", glyph: "ML", level: 2 },
      { id: "apex", name: "Apex", glyph: "APX", level: 3 },
    ],
  },
  {
    id: "frontend",
    name: "Front-end",
    shortName: "Front-end",
    nodes: [
      { id: "html", name: "HTML", glyph: "HTML", level: 2 },
      { id: "css", name: "CSS", glyph: "CSS", level: 2 },
      {
        id: "javascript",
        name: "JavaScript",
        glyph: "JS",
        level: 2,
        children: [
          { id: "react", name: "React", glyph: "R", level: 1 },
          { id: "typescript", name: "TypeScript", glyph: "TS", level: 1 },
        ],
      },
    ],
  },
  {
    id: "data",
    name: "Dados & BI",
    shortName: "Dados & BI",
    nodes: [
      { id: "sql", name: "SQL", glyph: "SQL", level: 3 },
      { id: "excel", name: "Excel", glyph: "XL", level: 3 },
      { id: "airflow", name: "Airflow", glyph: "AF", level: 2 },
      { id: "power-bi", name: "Power BI", glyph: "PBI", level: 1 },
      {
        id: "salesforce",
        name: "Salesforce",
        glyph: "SF",
        level: 4,
        children: [
          {
            id: "marketing-cloud",
            name: "Marketing Cloud",
            glyph: "MC",
            level: 3,
          },
          {
            id: "sales-cloud",
            name: "Sales Cloud",
            glyph: "SAC",
            level: 4,
          },
          {
            id: "service-cloud",
            name: "Service Cloud",
            glyph: "SEC",
            level: 4,
          },
        ],
      },
    ],
  },
  {
    id: "devops",
    name: "DevOps & Versionamento",
    shortName: "DevOps",
    nodes: [
      {
        id: "gitlab",
        name: "GitLab",
        glyph: "GL",
        level: 4,
        children: [{ id: "gitlab-cicd", name: "CI/CD", glyph: "CI", level: 1 }],
      },
      { id: "github", name: "GitHub", glyph: "GH", level: 4 },
      { id: "docker", name: "Docker", glyph: "D", level: 2 },
    ],
  },
  {
    id: "tools",
    name: "Ferramentas de Trabalho",
    shortName: "Ferramentas",
    nodes: [
      { id: "jira", name: "Jira", glyph: "J", level: 2 },
      { id: "latex", name: "LaTeX", glyph: "TEX", level: 2 },
      { id: "word", name: "Word", glyph: "W", level: 2 },
      { id: "powerpoint", name: "PowerPoint", glyph: "PPT", level: 2 },
    ],
  },
  {
    id: "cloud",
    name: "Cloud",
    shortName: "Cloud",
    nodes: [
      { id: "aws-cloud", name: "AWS", glyph: "AWS", level: 0 },
      {
        id: "azure-cloud",
        name: "Azure Cloud",
        glyph: "AZ",
        level: 0,
        note: "No seu radar de estudos",
        children: [
          {
            id: "azure-storage",
            name: "Azure Storage",
            glyph: "AZS",
            level: 1,
          },
        ],
      },
    ],
  },
];
