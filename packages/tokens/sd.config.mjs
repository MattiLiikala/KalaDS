import StyleDictionary from 'style-dictionary';

const isWatch = process.argv.includes('--watch');

const sd = new StyleDictionary({
  source: ['src/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      prefix: 'kds',
      buildPath: 'dist/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
          options: {
            outputReferences: true,
            selector: ':root',
          },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
      ],
    },
    json: {
      buildPath: 'dist/json/',
      files: [
        {
          destination: 'tokens.json',
          format: 'json/nested',
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
console.log('[tokens] build complete');

if (isWatch) {
  const { default: chokidar } = await import('chokidar');
  chokidar.watch('src/**/*.json').on('change', async (path) => {
    console.log(`[tokens] changed: ${path}`);
    await sd.buildAllPlatforms();
    console.log('[tokens] rebuilt');
  });
  console.log('[tokens] watching src/**/*.json');
}
