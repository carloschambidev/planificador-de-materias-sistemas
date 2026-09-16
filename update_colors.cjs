const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-\[#150404\]/g, replacement: 'bg-zinc-900' },
  { regex: /bg-\[#240707\]/g, replacement: 'bg-zinc-900' },
  { regex: /bg-\[#0e0202\]/g, replacement: 'bg-zinc-950' },
  { regex: /bg-\[#1A0505\]/g, replacement: 'bg-zinc-950' },
  { regex: /bg-\[#2a0808\]/g, replacement: 'bg-zinc-900' },
  { regex: /bg-\[#1a0505\]/g, replacement: 'bg-zinc-950' },
  { regex: /bg-\[#1e0606\]/g, replacement: 'bg-zinc-800' },
  { regex: /bg-\[#2D0909\]/g, replacement: 'bg-zinc-800' },
  { regex: /bg-\[#360B0B\]/g, replacement: 'bg-zinc-950' },
  { regex: /bg-\[#250000\]/g, replacement: 'bg-zinc-950' },
  
  { regex: /hover:bg-\[#1e0606\]/g, replacement: 'hover:bg-zinc-800' },
  { regex: /hover:bg-\[#2D0909\]/g, replacement: 'hover:bg-zinc-800' },
  { regex: /hover:bg-\[#2a0808\]/g, replacement: 'hover:bg-zinc-800' },
  { regex: /hover:bg-\[#1a0505\]/g, replacement: 'hover:bg-zinc-800' },
  { regex: /hover:bg-\[#360B0B\]/g, replacement: 'hover:bg-zinc-900' },

  { regex: /border-\[#4a0f0f\]/g, replacement: 'border-zinc-800' },
  { regex: /border-\[#521111\]/g, replacement: 'border-zinc-800' },
  { regex: /border-\[#7a1818\]/g, replacement: 'border-zinc-700' },
  
  { regex: /hover:border-\[#7a1818\]/g, replacement: 'hover:border-zinc-700' },
  { regex: /hover:border-\[#521111\]/g, replacement: 'hover:border-zinc-800' },
  { regex: /hover:border-\[#6b1a1a\]/g, replacement: 'hover:border-zinc-700' },

  { regex: /text-\[#F3F4F6\]/g, replacement: 'text-zinc-100' },
  { regex: /text-\[#d4a0a0\]/g, replacement: 'text-zinc-400' },
  { regex: /text-\[#FECACA\]/g, replacement: 'text-zinc-400' },

  { regex: /hover:text-\[#F3F4F6\]/g, replacement: 'hover:text-zinc-100' },
  { regex: /hover:text-\[#d4a0a0\]/g, replacement: 'hover:text-zinc-400' },
  { regex: /hover:text-\[#FECACA\]/g, replacement: 'hover:text-zinc-400' },
  
  // Specific buttons
  { regex: /bg-\[#4a0f0f\] hover:bg-\[#360B0B\]/g, replacement: 'bg-[#951615] hover:bg-[#7a1211]' },
  { regex: /bg-\[#951615\] hover:bg-\[#7a1212\]/g, replacement: 'bg-[#951615] hover:bg-[#7a1211]' }
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
  
  // Custom updates for index.css
  if (file.endsWith('index.css')) {
    content = content.replace(/--bg-main: #250000;/, '--bg-main: #09090b;');
    content = content.replace(/--bg-main: #360B0B;/, '--bg-main: #09090b;');
    content = content.replace(/--bg-card: #150404;/, '--bg-card: #18181b;');
    content = content.replace(/--bg-card: #240707;/, '--bg-card: #18181b;');
    content = content.replace(/--bg-card-hover: #1e0606;/, '--bg-card-hover: #27272a;');
    content = content.replace(/--bg-card-hover: #2D0909;/, '--bg-card-hover: #27272a;');
    content = content.replace(/--text-main: #F3F4F6;/, '--text-main: #f4f4f5;');
    content = content.replace(/--text-muted: #d4a0a0;/, '--text-muted: #a1a1aa;');
    content = content.replace(/--text-muted: #FECACA;/, '--text-muted: #a1a1aa;');
    content = content.replace(/--border-main: #4a0f0f;/, '--border-main: #27272a;');
    content = content.replace(/--border-main: #521111;/, '--border-main: #27272a;');
  }

  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
