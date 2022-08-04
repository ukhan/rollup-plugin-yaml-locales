import path from 'path';
import { normalizePath } from '@rollup/pluginutils';
import { generateMessageFiles } from './utils';

export default function (yamlPath = 'src/i18n.yaml', opts = {}) {
  const normYamlPath = normalizePath(path.normalize(yamlPath));
  let lastWatched;
  let command;
  let outDir;
  let crxPluginExists;

  return {
    name: 'i18n',

    // Rollup hooks

    buildStart() {
      const { watchMode } = this.meta;

      this.addWatchFile(normYamlPath);

      if (!watchMode || !lastWatched || lastWatched === normYamlPath) {
        if (command === 'serve') {
          generateMessageFiles.call(this, normYamlPath, {
            ...opts,
            outDir,
            useEmit: false,
          });
        } else {
          generateMessageFiles.call(this, normYamlPath, opts);
        }
      }
    },

    watchChange(id) {
      lastWatched = normalizePath(id);
    },

    // Vite hooks

    configResolved(config) {
      const { root, build, command: _command } = config;

      command = _command;
      outDir = path.resolve(root, build.outDir);
      crxPluginExists = config.plugins.some(
        (plugin) => plugin.name === 'crx:hmr'
      );
    },

    handleHotUpdate(ctx) {
      const { file, server } = ctx;
      const fileName = path.basename(file);

      if (normYamlPath.endsWith(fileName)) {
        generateMessageFiles.call(this, normYamlPath, {
          ...opts,
          outDir,
          useEmit: false,
        });

        if (crxPluginExists) {
          server.ws.send({ type: 'custom', event: 'crx:runtime-reload' });
        }
      }
    },
  };
}
