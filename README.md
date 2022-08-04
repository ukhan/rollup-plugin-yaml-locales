# YAML to Locales plugin for Rollup

A Rollup plugin which converts a YAML file to a browser extension's locale (messages.json) files.

## Installation

```bash
# npm
npm install --save-dev rollup-plugin-yaml-locales

# yarn
yarn add --dev rollup-plugin-yaml-locales
```

## Usage

**rollup.config.js**

```javascript
import i18n from 'rollup-plugin-yaml-locales';

export default {
  // ...
  plugins: [i18n('src/i18n.yaml')],
};
```

**vite.config.js**

```javascript
import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import i18n from 'rollup-plugin-yaml-locales';
import manifest from './manifest.json';

export default defineConfig({
  plugins: [
    crx({ manifest }), // optional
    i18n('i18n.yaml'),
  ],
});
```

**i18n.yaml**

```yaml
extName: Extension Name
extDescription: Extension Description
msg_1:
  en: Message text
  uk: Текст повідомлення
msg_2:
  d: msg_2 description
  en: msg_2 message
```

## Configuration

### yamlFile

Type: `string`\
Default: `src/i18n.yaml`

### options

Type: `object`\
Default: `{}`

#### options.defaultLocale

Type: `string`\
Default: `en`

#### options.onlySupportedLocales

Type: `boolean`\
Default: `true`

Messages.json files are created only for [supported languages](https://developer.chrome.com/docs/webstore/i18n/#choosing-locales-to-support).

#### options.space

Type: `string`\
Default: `' '`

The `space` parameter of the `JSON.stringify` function when generating the messages.json file.

#### options.suffixes

Type: `object`\
Default: `{}`

See an example below and [test](/test/test.mjs) for details.

## Advanced usage

**rollup.config.js**

```javascript
import i18n from 'rollup-plugin-yaml-locales';

const beta = process.env.BUILD === 'beta';

export default {
  // ...
  plugins: [
    i18n('src/i18n.yaml', {
      suffixes: beta
        ? {
            extName: ' (beta)',
            extDesc: {
              en: ' (beta version)',
              uk: ' (бета версія)',
            },
          }
        : {},
    }),
  ],
};
```

**package.json**

```json
{
  ...
  "scripts": {
    "dev": "rollup -cw",
    "beta": "rollup -c --environment BUILD:beta",
    "build": "rollup -c"
  }
  ...
}
```
