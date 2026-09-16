const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-bg-main/g, replacement: 'bg-background' },
  { regex: /text-text-primary/g, replacement: 'text-primary' },
  { regex: /text-text-secondary/g, replacement: 'text-secondary' },
  { regex: /text-text-muted/g, replacement: 'text-muted' },
  { regex: /border-border-sutil/g, replacement: 'border-sutil' },
  { regex: /border-border/g, replacement: 'border' }, // Simplifies border-border to just border. Wait! "border" already applies border width. I will use "border border-border" vs "border". Actually, in tailwind, if you set borderColor.DEFAULT, just `border` applies both the default width and the default color. But to be safe, I mapped `borderColor.border` too. So `border-border` is fine, it maps to `var(--color-border-main)`. I'll leave `border-border` as is to avoid breaking `border` (which adds 1px).
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
