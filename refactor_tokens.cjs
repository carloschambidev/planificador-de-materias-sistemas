const fs = require('fs');
const path = require('path');

const replacements = [
  // Backgrounds
  { regex: /bg-white\s+dark:bg-\[#221a1c\]/g, replacement: 'bg-surface' },
  { regex: /bg-gray-50\s+dark:bg-\[#171112\]/g, replacement: 'bg-bg-secondary' },
  { regex: /bg-gray-100\s+dark:bg-\[#221a1c\]/g, replacement: 'bg-surface-elevated' },
  { regex: /bg-\[#221a1c\]/g, replacement: 'bg-surface' },
  { regex: /bg-\[#171112\]/g, replacement: 'bg-bg-main' },
  { regex: /bg-\[#2a1f22\]/g, replacement: 'bg-surface-hover' },
  { regex: /bg-zinc-900/g, replacement: 'bg-surface' },
  { regex: /bg-zinc-950/g, replacement: 'bg-bg-main' },
  { regex: /dark:bg-\[#221a1c\]/g, replacement: 'dark:bg-surface' },
  { regex: /dark:bg-\[#171112\]/g, replacement: 'dark:bg-bg-main' },
  { regex: /dark:bg-\[#2a1f22\]/g, replacement: 'dark:bg-surface-hover' },
  { regex: /dark:bg-zinc-900/g, replacement: 'dark:bg-surface' },

  // Borders
  { regex: /border-gray-200\s+dark:border-\[#36272a\]/g, replacement: 'border-border' },
  { regex: /border-gray-300\s+dark:border-\[#36272a\]/g, replacement: 'border-border' },
  { regex: /border-\[#36272a\]/g, replacement: 'border-border' },
  { regex: /dark:border-\[#36272a\]/g, replacement: 'dark:border-border' },
  { regex: /border-zinc-800/g, replacement: 'border-border' },
  { regex: /dark:border-zinc-800/g, replacement: 'dark:border-border' },

  // Texts
  { regex: /text-gray-900\s+dark:text-\[#e8e4e5\]/g, replacement: 'text-text-primary' },
  { regex: /text-gray-800\s+dark:text-\[#e8e4e5\]/g, replacement: 'text-text-primary' },
  { regex: /text-gray-700\s+dark:text-\[#a89f9e\](\/70)?/g, replacement: 'text-text-secondary' },
  { regex: /text-gray-600\s+dark:text-\[#a89f9e\](\/60)?/g, replacement: 'text-text-secondary' },
  { regex: /text-gray-500\s+dark:text-\[#a89f9e\](\/50)?/g, replacement: 'text-text-muted' },
  { regex: /text-\[#e8e4e5\]/g, replacement: 'text-text-primary' },
  { regex: /text-\[#a89f9e\]/g, replacement: 'text-text-secondary' },
  { regex: /dark:text-\[#e8e4e5\]/g, replacement: 'dark:text-text-primary' },
  { regex: /dark:text-\[#a89f9e\](\/\d+)?/g, replacement: 'dark:text-text-secondary' },
  { regex: /text-zinc-100/g, replacement: 'text-text-primary' },
  { regex: /text-zinc-400/g, replacement: 'text-text-secondary' },

  // Hovers
  { regex: /hover:bg-gray-50\s+dark:hover:bg-\[#2a1f22\]/g, replacement: 'hover:bg-surface-hover' },
  { regex: /hover:bg-gray-100\s+dark:hover:bg-\[#2a1f22\]/g, replacement: 'hover:bg-surface-hover' },
  { regex: /hover:bg-\[#2a1f22\]/g, replacement: 'hover:bg-surface-hover' },
  { regex: /dark:hover:bg-\[#2a1f22\]/g, replacement: 'dark:hover:bg-surface-hover' },

  // Brand
  { regex: /bg-\[#951615\]/g, replacement: 'bg-brand' },
  { regex: /hover:bg-\[#7a1211\]/g, replacement: 'hover:bg-brand-hover' },
  { regex: /bg-utn/g, replacement: 'bg-brand' },

  // Simplify explicit dark mappings that are now handled by design tokens
  { regex: /bg-white\s+dark:bg-surface/g, replacement: 'bg-surface' },
  { regex: /text-gray-900\s+dark:text-text-primary/g, replacement: 'text-text-primary' },
  { regex: /text-gray-800\s+dark:text-text-primary/g, replacement: 'text-text-primary' },
  { regex: /text-gray-600\s+dark:text-text-secondary/g, replacement: 'text-text-secondary' },
  { regex: /text-gray-500\s+dark:text-text-secondary/g, replacement: 'text-text-muted' },
  { regex: /text-gray-500\s+dark:text-text-muted/g, replacement: 'text-text-muted' },
  { regex: /border-gray-200\s+dark:border-border/g, replacement: 'border-border' },
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
