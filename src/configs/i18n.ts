export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'bn', 'gu', 'hi', 'kn', 'ml', 'or', 'pa', 'ta', 'te', 'ur'],
  langDirection: {
    en: 'ltr',
    bn: 'ltr',
    gu: 'ltr',
    hi: 'ltr',
    kn: 'ltr',
    ml: 'ltr',
    or: 'ltr',
    pa: 'ltr',
    ta: 'ltr',
    te: 'ltr',
    ur: 'rtl'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
