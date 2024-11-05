/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'development-ironcore.s3.amazonaws.com'
      },
      {
        hostname: 'assests-sellersetu.s3.amazonaws.com'
      }
    ]
  },
  basePath: process.env.BASEPATH,
  images: {
    domains: ['development-ironcore.s3.amazonaws.com'],
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true,
        locale: false
      }
    ]
  },

  // TODO: below line is added to resolve twice event dispatch in the calendar reducer
  reactStrictMode: false
}

module.exports = nextConfig
