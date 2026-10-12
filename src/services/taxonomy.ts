import { SkillCategory, SkillItem } from '../types';

export interface TaxonomySkill {
  canonicalName: string;
  category: SkillCategory;
  aliases: string[];
  description?: string;
}

export const SKILL_TAXONOMY: TaxonomySkill[] = [
  // Programming
  { canonicalName: 'JavaScript', category: 'Programming', aliases: ['js', 'ecmascript', 'es6', 'es2020', 'vanilla js'] },
  { canonicalName: 'TypeScript', category: 'Programming', aliases: ['ts', 'typescript lang'] },
  { canonicalName: 'Python', category: 'Programming', aliases: ['py', 'python3', 'python 3'] },
  { canonicalName: 'Java', category: 'Programming', aliases: ['java se', 'core java', 'jdk', 'j2se'] },
  { canonicalName: 'C++', category: 'Programming', aliases: ['cpp', 'c plus plus', 'c/c++'] },
  { canonicalName: 'C', category: 'Programming', aliases: ['c lang', 'embedded c'] },
  { canonicalName: 'C#', category: 'Programming', aliases: ['csharp', 'c-sharp', '.net c#'] },
  { canonicalName: 'Go', category: 'Programming', aliases: ['golang', 'go lang'] },
  { canonicalName: 'Rust', category: 'Programming', aliases: ['rustlang'] },

  // Web Development
  { canonicalName: 'React', category: 'Web Development', aliases: ['reactjs', 'react.js', 'react js'] },
  { canonicalName: 'Next.js', category: 'Web Development', aliases: ['nextjs', 'next js'] },
  { canonicalName: 'Angular', category: 'Web Development', aliases: ['angularjs', 'angular 2+', 'ng'] },
  { canonicalName: 'Vue.js', category: 'Web Development', aliases: ['vue', 'vuejs'] },
  { canonicalName: 'HTML5', category: 'Web Development', aliases: ['html', 'semantic html'] },
  { canonicalName: 'CSS3', category: 'Web Development', aliases: ['css', 'styling', 'flexbox', 'grid'] },
  { canonicalName: 'Tailwind CSS', category: 'Web Development', aliases: ['tailwind', 'tailwindcss'] },

  // Backend Development
  { canonicalName: 'Node.js', category: 'Backend Development', aliases: ['node', 'nodejs', 'node js'] },
  { canonicalName: 'Express.js', category: 'Backend Development', aliases: ['express', 'expressjs'] },
  { canonicalName: 'Spring Boot', category: 'Backend Development', aliases: ['springboot', 'spring framework', 'spring'] },
  { canonicalName: 'Django', category: 'Backend Development', aliases: ['django framework', 'drf'] },
  { canonicalName: 'FastAPI', category: 'Backend Development', aliases: ['fast api', 'fastapi python'] },
  { canonicalName: 'RESTful APIs', category: 'Backend Development', aliases: ['rest api', 'rest apis', 'restful web services', 'rest'] },
  { canonicalName: 'GraphQL', category: 'Backend Development', aliases: ['gql'] },

  // Databases
  { canonicalName: 'PostgreSQL', category: 'Databases', aliases: ['postgres', 'postgresql', 'pgsql'] },
  { canonicalName: 'MySQL', category: 'Databases', aliases: ['mysql database', 'mariadb'] },
  { canonicalName: 'MongoDB', category: 'Databases', aliases: ['mongo', 'mongodb nosql'] },
  { canonicalName: 'Redis', category: 'Databases', aliases: ['redis cache', 'in-memory redis'] },
  { canonicalName: 'SQL', category: 'Databases', aliases: ['relational database', 'rdbms', 'sql queries'] },

  // Cloud & DevOps
  { canonicalName: 'Docker', category: 'Cloud & DevOps', aliases: ['docker containers', 'containerization'] },
  { canonicalName: 'Kubernetes', category: 'Cloud & DevOps', aliases: ['k8s', 'kube'] },
  { canonicalName: 'AWS', category: 'Cloud & DevOps', aliases: ['amazon web services', 'aws cloud', 'ec2', 's3', 'lambda'] },
  { canonicalName: 'Microsoft Azure', category: 'Cloud & DevOps', aliases: ['azure', 'azure cloud'] },
  { canonicalName: 'Google Cloud Platform', category: 'Cloud & DevOps', aliases: ['gcp', 'google cloud'] },
  { canonicalName: 'Git', category: 'Cloud & DevOps', aliases: ['github', 'gitlab', 'git version control'] },
  { canonicalName: 'CI/CD Pipelines', category: 'Cloud & DevOps', aliases: ['cicd', 'ci/cd', 'github actions', 'jenkins'] },
  { canonicalName: 'Linux', category: 'Cloud & DevOps', aliases: ['linux/unix', 'ubuntu', 'bash', 'shell scripting'] },

  // AI & Machine Learning
  { canonicalName: 'Machine Learning', category: 'AI & Machine Learning', aliases: ['ml', 'statistical learning'] },
  { canonicalName: 'Deep Learning', category: 'AI & Machine Learning', aliases: ['dl', 'neural networks', 'ann', 'cnn', 'rnn'] },
  { canonicalName: 'PyTorch', category: 'AI & Machine Learning', aliases: ['torch', 'pytorch framework'] },
  { canonicalName: 'TensorFlow', category: 'AI & Machine Learning', aliases: ['tf', 'tensorflow 2'] },
  { canonicalName: 'Natural Language Processing', category: 'AI & Machine Learning', aliases: ['nlp', 'text mining', 'llm', 'transformers'] },
  { canonicalName: 'Computer Vision', category: 'AI & Machine Learning', aliases: ['cv', 'opencv', 'image processing'] },
  { canonicalName: 'Scikit-Learn', category: 'AI & Machine Learning', aliases: ['sklearn', 'scikit learn'] },

  // Data Analytics
  { canonicalName: 'Pandas', category: 'Data Analytics', aliases: ['python pandas'] },
  { canonicalName: 'NumPy', category: 'Data Analytics', aliases: ['numpy python'] },
  { canonicalName: 'Data Visualization', category: 'Data Analytics', aliases: ['matplotlib', 'seaborn', 'tableau', 'power bi'] },
  { canonicalName: 'Apache Spark', category: 'Data Analytics', aliases: ['spark', 'pyspark'] },

  // CS Fundamentals
  { canonicalName: 'Data Structures & Algorithms', category: 'CS Fundamentals', aliases: ['dsa', 'data structures', 'algorithms', 'problem solving'] },
  { canonicalName: 'Object-Oriented Programming', category: 'CS Fundamentals', aliases: ['oops', 'oop', 'object oriented'] },
  { canonicalName: 'Operating Systems', category: 'CS Fundamentals', aliases: ['os concepts', 'process scheduling', 'virtual memory'] },
  { canonicalName: 'Computer Networks', category: 'CS Fundamentals', aliases: ['tcp/ip', 'http/https', 'socket programming'] },
  { canonicalName: 'Database Management Systems', category: 'CS Fundamentals', aliases: ['dbms', 'normalization', 'acid properties'] },
  { canonicalName: 'System Design', category: 'CS Fundamentals', aliases: ['system architecture', 'hld', 'lld', 'microservices'] },

  // Soft Skills
  { canonicalName: 'Technical Communication', category: 'Soft Skills', aliases: ['communication skills', 'presentation skills'] },
  { canonicalName: 'Team Collaboration', category: 'Soft Skills', aliases: ['teamwork', 'agile collaboration', 'scrum'] },
  { canonicalName: 'Analytical Problem Solving', category: 'Soft Skills', aliases: ['critical thinking', 'logical reasoning'] },
  { canonicalName: 'Leadership & Initiative', category: 'Soft Skills', aliases: ['mentoring', 'team lead', 'ownership'] },
];

/**
 * Normalizes any free-text skill string to its canonical taxonomy name.
 */
export function normalizeSkill(rawSkill: string): { canonical: string; category: SkillCategory } {
  if (!rawSkill || typeof rawSkill !== 'string') {
    return { canonical: 'General Technical Skill', category: 'CS Fundamentals' };
  }

  const cleaned = rawSkill.trim().toLowerCase().replace(/[^\w\s+#./-]/g, '');

  for (const item of SKILL_TAXONOMY) {
    if (item.canonicalName.toLowerCase() === cleaned) {
      return { canonical: item.canonicalName, category: item.category };
    }
    for (const alias of item.aliases) {
      if (alias === cleaned || cleaned.includes(alias) || alias.includes(cleaned)) {
        return { canonical: item.canonicalName, category: item.category };
      }
    }
  }

  // Fallback: Title case raw skill and guess category
  const titleCased = rawSkill.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  let inferredCategory: SkillCategory = 'CS Fundamentals';
  const c = cleaned;
  if (c.includes('web') || c.includes('css') || c.includes('html') || c.includes('ui') || c.includes('frontend')) {
    inferredCategory = 'Web Development';
  } else if (c.includes('database') || c.includes('sql') || c.includes('data')) {
    inferredCategory = 'Databases';
  } else if (c.includes('cloud') || c.includes('deploy') || c.includes('server') || c.includes('devops')) {
    inferredCategory = 'Cloud & DevOps';
  } else if (c.includes('ai') || c.includes('ml') || c.includes('learning') || c.includes('neural')) {
    inferredCategory = 'AI & Machine Learning';
  } else if (c.includes('team') || c.includes('lead') || c.includes('communicat')) {
    inferredCategory = 'Soft Skills';
  }

  return { canonical: titleCased, category: inferredCategory };
}

/**
 * Normalizes a list of raw skill strings or objects.
 */
export function normalizeSkillList(rawList: (string | SkillItem)[]): SkillItem[] {
  const seen = new Set<string>();
  const result: SkillItem[] = [];

  for (const item of rawList) {
    const rawName = typeof item === 'string' ? item : item.name;
    const { canonical, category } = normalizeSkill(rawName);

    if (!seen.has(canonical.toLowerCase())) {
      seen.add(canonical.toLowerCase());
      result.push({
        name: canonical,
        category,
        proficiency: typeof item === 'object' && item.proficiency ? item.proficiency : 'Intermediate',
        verified: typeof item === 'object' ? item.verified : false,
        sourceEvidence: typeof item === 'object' ? item.sourceEvidence : undefined,
        confidence: typeof item === 'object' && item.confidence ? item.confidence : 0.9,
      });
    }
  }

  return result;
}
