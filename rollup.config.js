import { builtinModules } from 'module';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  external: Object.keys(pkg.dependencies).concat(builtinModules),
  output: [
    { file: pkg.main, format: 'cjs', exports: 'auto' },
    { file: pkg.module, format: 'es' },
  ],
};
