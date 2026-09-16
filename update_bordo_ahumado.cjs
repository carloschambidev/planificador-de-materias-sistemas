const fs = require('fs');
const path = require('path');

const replacements = [
  // Backgrounds
  { regex: /bg-slate-950/g, replacement: 'bg-[#171112]' },
  { regex: /bg-slate-900/g, replacement: 'bg-[#221a1c]' },
  { regex: /bg-slate-800/g, replacement: 'bg-[#2a1f22]' },
  
  // Hovers
  { regex: /hover:bg-slate-900/g, replacement: 'hover:bg-[#221a1c]' },
  { regex: /hover:bg-slate-800/g, replacement: 'hover:bg-[#2a1f22]' },

  // Borders
  { regex: /border-slate-800/g, replacement: 'border-[#36272a]' },
  { regex: /border-slate-700/g, replacement: 'border-[#36272a]' },
  
  { regex: /hover:border-slate-800/g, replacement: 'hover:border-[#36272a]' },
  { regex: /hover:border-slate-700/g, replacement: 'hover:border-[#36272a]' },

  // Text
  { regex: /text-slate-100/g, replacement: 'text-[#e8e4e5]' },
  { regex: /text-slate-200/g, replacement: 'text-[#e8e4e5]' },
  { regex: /text-slate-300/g, replacement: 'text-[#e8e4e5]' },
  { regex: /text-slate-400/g, replacement: 'text-[#a89f9e]' },
  { regex: /text-slate-500/g, replacement: 'text-[#a89f9e]' },

  { regex: /hover:text-slate-100/g, replacement: 'hover:text-[#e8e4e5]' },
  { regex: /hover:text-slate-400/g, replacement: 'hover:text-[#a89f9e]' },

  // Special case for active tab in Header, if it was #951615, we remove it. Wait, I will fix Header.tsx manually or specifically.
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
    content = content.replace(/--bg-main: #020617;/g, '--bg-main: #171112;');
    content = content.replace(/--bg-card: #0f172a;/g, '--bg-card: #221a1c;');
    content = content.replace(/--bg-card-hover: #1e293b;/g, '--bg-card-hover: #2a1f22;');
    content = content.replace(/--text-main: #f1f5f9;/g, '--text-main: #e8e4e5;');
    content = content.replace(/--text-muted: #94a3b8;/g, '--text-muted: #a89f9e;');
    content = content.replace(/--border-main: #1e293b;/g, '--border-main: #36272a;');
  }

  // Header active tab fix
  if (file.endsWith('Header.tsx')) {
    content = content.replace(/\? 'bg-\\[#951615\\] text-white'/g, "? 'bg-[#2a1f22] text-[#e8e4e5] border border-[#36272a]'");
  }

  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
