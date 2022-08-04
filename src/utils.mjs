import fs from 'fs';
import path from 'path';
import YAML from 'js-yaml';

/**
 * Checks for the submitted lang language in the list of supported languages.
 * @see {@link https://developer.chrome.com/docs/webstore/i18n/#choosing-locales-to-support}
 * @param {string} locale - language code (en, uk, ...)
 * @returns {boolean}
 */
function isSupportedLocale(locale) {
  const supportedLocales = [
    'ar',
    'am',
    'bg',
    'bn',
    'ca',
    'cs',
    'da',
    'de',
    'el',
    'en',
    'en_GB',
    'en_US',
    'es',
    'es_419',
    'et',
    'fa',
    'fi',
    'fil',
    'fr',
    'gu',
    'he',
    'hi',
    'hr',
    'hu',
    'id',
    'it',
    'ja',
    'kn',
    'ko',
    'lt',
    'lv',
    'ml',
    'mr',
    'ms',
    'nl',
    'no',
    'pl',
    'pt_BR',
    'pt_PT',
    'ro',
    'ru',
    'sk',
    'sl',
    'sr',
    'sv',
    'sw',
    'ta',
    'te',
    'th',
    'tr',
    'uk',
    'vi',
    'zh_CN',
    'zh_TW',
  ];
  return supportedLocales.indexOf(locale) !== -1;
}

export function generateLocales(
  yamlObj,
  suffixes = {},
  defaultLocale = 'en',
  onlySupportedLocales = true
) {
  let locales = {};

  function getSuffix(key, locale) {
    let suffix = '';

    if (suffixes[key]) {
      if (typeof suffixes[key] === 'string') {
        suffix = suffixes[key];
      } else if (typeof suffixes[key] === 'object' && suffixes[key][locale]) {
        suffix = suffixes[key][locale];
      }
    }
    return suffix;
  }

  Object.entries(yamlObj).forEach(([key, value]) => {
    if (typeof value === 'string') {
      if (!locales[defaultLocale]) locales[defaultLocale] = {};
      locales[defaultLocale][key] = {
        message: value + getSuffix(key, defaultLocale),
      };
    } else if (typeof value === 'object') {
      let description = value['d'] || value['description'];
      Object.entries(value).forEach(([k, v]) => {
        if (['d', 'description'].indexOf(k) === -1) {
          if (isSupportedLocale(k) || !onlySupportedLocales) {
            if (!locales[k]) locales[k] = {};
            if (!locales[k][key]) locales[k][key] = {};
            locales[k][key]['message'] = v + getSuffix(key, k);
            if (description) {
              locales[k][key]['description'] = description;
            }
          }
          if (!isSupportedLocale(k)) {
            this.warn(`Unsupported locale "${k}" for key "${key}".`);
          }
        }
      });
    } else {
      this.warn(
        `Unsupported type (${typeof value}) of value for key '${key}'.`
      );
    }
  });

  return locales;
}

export function generateMessageFiles(yamlPath, opts = {}) {
  const {
    defaultLocale = 'en',
    onlySupportedLocales = true,
    space = '  ',
    suffixes = {},
    useEmit = true,
    outDir = '',
  } = opts;
  let yamlObj;

  try {
    yamlObj = YAML.load(fs.readFileSync(yamlPath));
  } catch (err) {
    this.error(err);
  }

  const locales = generateLocales.call(
    this,
    yamlObj,
    suffixes,
    defaultLocale,
    onlySupportedLocales
  );
  Object.entries(locales).forEach(([l, v]) => {
    let messages = JSON.stringify(v, null, space);
    if (useEmit) {
      this.emitFile({
        type: 'asset',
        fileName: `_locales/${l}/messages.json`,
        source: messages,
      });
    } else {
      let dir = path.resolve(outDir, '_locales', l);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      let fileName = path.resolve(outDir, '_locales', l, 'messages.json');
      try {
        fs.writeFileSync(fileName, messages, { flag: 'w' });
      } catch (err) {
        this.error(err);
      }
    }
  });
}
