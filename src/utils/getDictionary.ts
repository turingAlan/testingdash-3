// Third-party Imports
import 'server-only'

// Type Imports
import type { Locale } from '@configs/i18n'

const dictionaries = {
  en: () => import('@/data/dictionaries/en.json').then(module => module.default),
  bn: () => import('@/data/dictionaries/bn.json').then(module => module.default),
  gu: () => import('@/data/dictionaries/gu.json').then(module => module.default),
  hi: () => import('@/data/dictionaries/hi.json').then(module => module.default),
  kn: () => import('@/data/dictionaries/kn.json').then(module => module.default),
  ml: () => import('@/data/dictionaries/ml.json').then(module => module.default),
  or: () => import('@/data/dictionaries/or.json').then(module => module.default),
  pa: () => import('@/data/dictionaries/pa.json').then(module => module.default),
  ta: () => import('@/data/dictionaries/ta.json').then(module => module.default),
  te: () => import('@/data/dictionaries/te.json').then(module => module.default),
  ur: () => import('@/data/dictionaries/ur.json').then(module => module.default)

  // fr: () => import('@/data/dictionaries/fr.json').then(module => module.default),
  // ar: () => import('@/data/dictionaries/ar.json').then(module => module.default)
}

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
