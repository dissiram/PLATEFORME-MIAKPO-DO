// Base de connaissances des compétences avec relations sémantiques
const skillKnowledgeBase = {
  synonyms: {
    'javascript': ['js', 'ecmascript', 'vanilla js'],
    'react': ['react.js', 'reactjs', 'react native'],
    'node': ['node.js', 'nodejs', 'express'],
    'python': ['py', 'django', 'flask'],
    'typescript': ['ts'],
    'html': ['html5'],
    'css': ['css3', 'sass', 'scss', 'less'],
    'vue': ['vue.js', 'vuejs'],
    'angular': ['angular.js', 'angularjs'],
    'java': ['spring', 'j2ee'],
    'php': ['laravel', 'symfony'],
    'sql': ['mysql', 'postgresql', 'postgres', 'mongodb', 'nosql'],
    'git': ['github', 'gitlab', 'version control']
  },
  
  categories: {
    'Développement Web': ['javascript', 'react', 'vue', 'angular', 'html', 'css', 'node', 'express'],
    'Développement Mobile': ['react native', 'flutter', 'kotlin', 'swift'],
    'Data Science': ['python', 'r', 'machine learning', 'ai', 'tensorflow'],
    'Design': ['ui', 'ux', 'figma', 'adobe xd', 'photoshop'],
    'Marketing': ['seo', 'sem', 'google analytics', 'social media']
  }
};

export function normalizeSkillName(skillName) {
  if (!skillName) return '';
  
  return skillName.toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[\.\-\_]/g, '')
    .replace(/\s+/g, '-');
}

export function getSynonyms(skillName) {
  const normalized = normalizeSkillName(skillName);
  return skillKnowledgeBase.synonyms[normalized] || [normalized];
}

export function areSkillsSimilar(skill1, skill2) {
  if (!skill1 || !skill2) return false;
  
  const norm1 = normalizeSkillName(skill1);
  const norm2 = normalizeSkillName(skill2);
  
  if (norm1 === norm2) return true;
  
  const synonyms1 = getSynonyms(norm1);
  const synonyms2 = getSynonyms(norm2);
  
  return synonyms1.some(syn => synonyms2.includes(syn)) ||
         synonyms2.some(syn => synonyms1.includes(syn)) ||
         norm1.includes(norm2) || norm2.includes(norm1);
}

export function getSkillCategory(skillName) {
  const normalized = normalizeSkillName(skillName);
  
  for (const [category, skills] of Object.entries(skillKnowledgeBase.categories)) {
    if (skills.some(skill => areSkillsSimilar(skill, normalized))) {
      return category;
    }
  }
  
  return 'Autre';
}

export default  skillKnowledgeBase();