// Expo's default Metro config already handles pnpm workspaces (watch folders and node_modules lookup).
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// Workspace packages publish ESM with "exports"; make sure Metro honours them.
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
