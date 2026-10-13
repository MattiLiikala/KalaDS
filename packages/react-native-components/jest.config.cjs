/** Jest with the Expo preset. Workspace packages ship ESM, so they're transformed like React Native's own. */
module.exports = {
  preset: 'jest-expo',
  testMatch: ['<rootDir>/src/**/*.test.tsx'],
  transformIgnorePatterns: [
    'node_modules/(?!(\\.pnpm/[^/]+/node_modules/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-native-svg|@kalads/.*))',
  ],
  moduleNameMapper: {
    // Sources import with .js extensions (ESM); map them back to the TypeScript files.
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
