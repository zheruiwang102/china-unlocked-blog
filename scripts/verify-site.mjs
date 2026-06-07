import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const checks = [
  {
    name: 'site constants use China Unlocked branding',
    pass: () => readFile('src/consts.ts').includes("China Unlocked"),
  },
  {
    name: 'homepage is a China Signals newsroom, not the Astro starter',
    pass: () => {
      const home = readFile('src/pages/index.astro');
      return home.includes('China Signals') && !home.includes('Hello, Astronaut');
    },
  },
  {
    name: 'header no longer links to Astro social accounts',
    pass: () => {
      const header = readFile('src/components/Header.astro');
      return !header.includes('astrodotbuild') && !header.includes('withastro/astro');
    },
  },
  {
    name: 'default Astro starter posts are removed',
    pass: () => [
      'src/content/blog/first-post.md',
      'src/content/blog/second-post.md',
      'src/content/blog/third-post.md',
      'src/content/blog/markdown-style-guide.md',
      'src/content/blog/using-mdx.mdx',
    ].every((path) => !existsSync(join(root, path))),
  },
  {
    name: 'about page describes the China Signals project',
    pass: () => {
      const about = readFile('src/pages/about.astro');
      return about.includes('China Signals') && !about.includes('Lorem ipsum');
    },
  },
];

const failures = checks.filter((check) => !check.pass());
if (failures.length) {
  console.error('Site verification failed:');
  for (const failure of failures) {
    console.error(`- ${failure.name}`);
  }
  process.exit(1);
}

console.log(`Site verification passed (${checks.length} checks).`);

function readFile(path) {
  return readFileSync(join(root, path), 'utf8');
}
