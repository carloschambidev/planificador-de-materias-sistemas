const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /zinc-950/g, replacement: 'slate-950' },
  { regex: /zinc-900/g, replacement: 'slate-900' },
  { regex: /zinc-800/g, replacement: 'slate-800' },
  { regex: /zinc-700/g, replacement: 'slate-700' },
  { regex: /zinc-600/g, replacement: 'slate-600' },
  { regex: /zinc-500/g, replacement: 'slate-500' },
  { regex: /zinc-400/g, replacement: 'slate-400' },
  { regex: /zinc-300/g, replacement: 'slate-300' },
  { regex: /zinc-200/g, replacement: 'slate-200' },
  { regex: /zinc-100/g, replacement: 'slate-100' },
];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  // Custom updates for index.css hex values
  if (file.endsWith('index.css')) {
    content = content.replace(/--bg-main: #09090b;/g, '--bg-main: #020617;');
    content = content.replace(/--bg-card: #18181b;/g, '--bg-card: #0f172a;');
    content = content.replace(/--bg-card-hover: #27272a;/g, '--bg-card-hover: #1e293b;');
    content = content.replace(/--text-main: #f4f4f5;/g, '--text-main: #f1f5f9;');
    content = content.replace(/--text-muted: #a1a1aa;/g, '--text-muted: #94a3b8;');
    content = content.replace(/--border-main: #27272a;/g, '--border-main: #1e293b;');
  }

  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
