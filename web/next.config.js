/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = false;
    }
    return config;
  },
};

module.exports = nextConfig;
