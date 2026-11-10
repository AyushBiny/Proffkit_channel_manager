/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@proffkit/db-types',
    '@proffkit/business-logic',
    '@proffkit/shared-ui'
  ],
};

export default nextConfig;

