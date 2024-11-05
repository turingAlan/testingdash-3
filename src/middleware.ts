// Next Imports
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Third-party Imports
import Negotiator from 'negotiator'
import { withAuth } from 'next-auth/middleware'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import type { NextRequestWithAuth } from 'next-auth/middleware'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getLocalizedUrl, isUrlMissingLocale } from '@/utils/i18n'
import { ensurePrefix, withoutPrefix, withoutSuffix } from '@/utils/string'

// Constants
const HOME_PAGE_URL = '/dashboards/crm'

const COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 148 * 60 * 60 // 1 week
} as const

// Helper to attach token cookie to any response
const attachToken = (response: NextResponse, token?: string | null): NextResponse => {
  if (token) {
    response.cookies.set('accessToken', token, COOKIE_OPTIONS)
  }

  return response
}

const getLocale = (request: NextRequest): string | undefined => {
  // Try to get locale from URL
  const urlLocale = i18n.locales.find(locale => request.nextUrl.pathname.startsWith(`/${locale}`))

  if (urlLocale) return urlLocale

  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}

  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales)

  const locale = matchLocale(languages, locales, i18n.defaultLocale)

  return locale
}

const localizedRedirect = (url: string, locale: string | undefined, request: NextRequestWithAuth) => {
  let _url = url

  const isLocaleMissing = isUrlMissingLocale(_url)

  if (isLocaleMissing) {
    // e.g. incoming request is /products
    // The new URL is now /en/products
    _url = getLocalizedUrl(_url, locale ?? i18n.defaultLocale)
  }

  let _basePath = process.env.BASEPATH ?? ''

  _basePath = _basePath.replace('demo-1', request.headers.get('X-server-header') ?? 'demo-1')

  _url = ensurePrefix(_url, `${_basePath ?? ''}`)

  // Remove the token from the URL
  const redirectUrl = new URL(_url, request.url)

  // Add all search params to the redirect URL
  request.nextUrl.searchParams.forEach((value, key) => {
    redirectUrl.searchParams.append(key, value)
  })

  // Use the static method to create the redirect response
  const redirectResponse = NextResponse.redirect(redirectUrl)

  return redirectResponse
}

const tenantRewrite = (url: string, request: NextRequestWithAuth, token: string | null) => {
  const submDomainlist = getSubdomainList(request).length ? getSubdomainList(request) : ['sellersetu']

  let redirectResponse = attachToken(NextResponse.next(), token)

  let _url = url

  if (submDomainlist.length > 0) {
    _url = ensurePrefix(_url, `/${submDomainlist.join('_')}`)

    const rewriteUrl = new URL(_url, request.url).toString()

    const rewriteResponse = NextResponse.rewrite(rewriteUrl)

    redirectResponse = attachToken(rewriteResponse, token)
  }

  return redirectResponse
}

// tenant url examples:
// tenant.somethingurl.in
// tenant.sellersetu.in
// dashboard.dev.selllersetu.in
// dashboard.sellersetu.in
const getBaseUrl = (hostName: string) => {
  const hostNameList = hostName.split('.')
  let baseUrl = `.${hostNameList[hostNameList.length - 1]}`

  if (process.env.NODE_ENV === 'production') {
    baseUrl = `.${hostNameList[hostNameList.length - 2]}.${hostNameList[hostNameList.length - 1]}`
  }

  return baseUrl ?? 'sellerSetu.in'
}

const getSubdomainList = (request: NextRequestWithAuth) => {
  const hostName = request.headers.get('host') ?? ''

  let subDomainList: string[] = []
  let currentHost

  if (process.env.NODE_ENV === 'production') {
    const baseUrl = getBaseUrl(hostName)

    currentHost = hostName.replace(baseUrl, '')
  } else {
    currentHost = hostName.replace('localhost:3000', '')
  }

  // If the host is not a subdomain, return to normal page
  if (!currentHost) {
    subDomainList = []
  } else {
    subDomainList =
      currentHost
        .split('.')
        ?.filter(subDomain => subDomain !== '')
        .map(subDomain => subDomain?.toLowerCase()) ?? []
  }

  return subDomainList
}

// user at auth.login
// user at auth.something
// user at tenant.login
// user at tenant.something

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    // Get locale from request headers
    const locale = getLocale(request)

    // Check if the URL is for the auth subdomain like auth.sellersetu.in
    const subDomainList = getSubdomainList(request)
    const isUrlAuth = subDomainList.includes('auth')

    const pathname = request.nextUrl.pathname
    const hostName = request.headers.get('host') ?? ''

    console.log(request.nextUrl.searchParams.getAll('accessToken'))

    // Access token passed to the URL in search params if login successful
    const tokenParams = request.nextUrl.searchParams.get('accessToken')

    // If the user is logged in, `token` will be stored in the cookies or in the query params
    const token = request.cookies.get('accessToken')?.value || tokenParams

    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMzlmYzlkMDYtMjE4Zi00MDlkLWFhZWMtN2MzOWRkNmUyNzRmIiwib3JnX2lkIjoiMTRlNzllZjgtMjFlNy00NDVjLWExMmYtMTBmNzAwNTM1MDgzIiwiZXhwIjoxNzMxNDEzNjY3LCJpYXQiOjE3MzA4MDg4Njd9.cj9qjR-pZvSV4F_WsaCwEJzcv44BmLnU7mP4BqXc4Ic"

    // Check if the user is logged in if token is there
    const isUserLoggedIn = !!token

    console.log(token, isUserLoggedIn, 'isUserLoggedIn')

    // Guest routes (Routes that can be accessed by guest users who are not logged in)
    const guestRoutes = ['login', 'register', 'forgot-password']

    // Shared routes (Routes that can be accessed by both guest and logged in users)
    const sharedRoutes = ['shared-route, privacy-policy']

    // Private routes (All routes except guest and shared routes that can only be accessed by logged in users)
    const privateRoute = ![...guestRoutes, ...sharedRoutes].some(route => pathname.endsWith(route))

    // If the URL is for the auth subdomain, redirect to only the auth page
    if (isUrlAuth) {
      // If ther user trying to access auth.sellersetu.in/orders, redirect to auth.sellersetu.in/login
      if (privateRoute) {
        return localizedRedirect('/login', locale, request)
      }

      // If pathname already contains a locale, return next() else redirect with localized URL
      return isUrlMissingLocale(pathname)
        ? localizedRedirect(pathname, locale, request)
        : tenantRewrite(pathname, request, token)
    }

    // If the user is not logged in and is trying to access a private route, redirect to the login page with the current URL as a query parameter
    if (!isUserLoggedIn) {
      const protocol = request.nextUrl.protocol ?? 'https:'

      const redirectOrigin = `${protocol}//auth${getBaseUrl(hostName)}`
      const redirectPath = getLocalizedUrl('/login', locale ?? i18n.defaultLocale)

      // Construct the URL to redirect to when the user logs in
      const redirectToOrigin = `${protocol}//${subDomainList.join('.')}${subDomainList.length ? '.' : ''}${withoutPrefix(getBaseUrl(hostName), '.')}`
      const redirectToUrl = `${withoutSuffix(redirectToOrigin, '/')}${withoutSuffix(request.nextUrl.pathname, '/')}${withoutSuffix(request.nextUrl.search, '/')}`

      // If the user is trying to access a private route, redirect to the login page of auth.sellersetu.in
      return NextResponse.redirect(
        `${redirectOrigin}/${withoutSuffix(redirectPath, '/')}?redirectTo=${encodeURIComponent(redirectToUrl)}`
      )
    }

    // If the user is logged in and is trying to access a guest route, redirect to the root page
    const isRequestedRouteIsGuestRoute = guestRoutes.some(route => pathname.endsWith(route))

    if (isUserLoggedIn && isRequestedRouteIsGuestRoute) {
      return localizedRedirect(HOME_PAGE_URL, locale, request)
    }

    // If the user is logged in and is trying to access root page, redirect to the home page
    if (pathname === '/' || pathname === `/${locale}`) {
      return localizedRedirect(HOME_PAGE_URL, locale, request)
    }

    // If pathname already contains a locale, return next() else redirect with localized URL
    return isUrlMissingLocale(pathname)
      ? localizedRedirect(pathname, locale, request)
      : tenantRewrite(pathname, request, token)
  },
  {
    callbacks: {
      authorized: () => {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true
      }
    }
  }
)

// Matcher Config
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - all items inside the public folder
     *    - images (public images)
     *    - next.svg (Next.js logo)
     *    - vercel.svg (Vercel logo)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.+?/hook-examples|.+?/menu-examples|images|next.svg|vercel.svg).*)'
  ]
}
