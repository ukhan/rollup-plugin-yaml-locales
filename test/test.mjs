import test from 'ava';
import { generateLocales } from '../src/utils.mjs';

const yaml = {
  extName: 'Extension Name',
  extDesc: {
    en: 'Extension description',
    uk: 'Опис розширення',
  },
  strangeKey: {
    d: 'This key needs a description',
    en: 'The strange message',
    uk: 'Дивне повідомлення',
  },
};

const locales = {
  en: {
    extName: {
      message: 'Extension Name',
    },
    extDesc: {
      message: 'Extension description',
    },
    strangeKey: {
      description: 'This key needs a description',
      message: 'The strange message',
    },
  },
  uk: {
    extDesc: {
      message: 'Опис розширення',
    },
    strangeKey: {
      description: 'This key needs a description',
      message: 'Дивне повідомлення',
    },
  },
};

const suffixes = {
  extName: ' (beta)',
  extDesc: {
    en: ' (beta version)',
    uk: ' (бета версія)',
  },
  strangeKey: ' (beta)',
};

const localesWithSuffixes = {
  en: {
    extName: {
      message: 'Extension Name (beta)',
    },
    extDesc: {
      message: 'Extension description (beta version)',
    },
    strangeKey: {
      description: 'This key needs a description',
      message: 'The strange message (beta)',
    },
  },
  uk: {
    extDesc: {
      message: 'Опис розширення (бета версія)',
    },
    strangeKey: {
      description: 'This key needs a description',
      message: 'Дивне повідомлення (beta)',
    },
  },
};

test('Generate locales', (t) => {
  const l = generateLocales(yaml);
  t.deepEqual(l, locales);
});

test('Generate locales with suffixes', (t) => {
  const l = generateLocales(yaml, suffixes);

  t.deepEqual(l, localesWithSuffixes);
});
