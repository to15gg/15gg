/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["opgg-static.akamaized.net"],
  },
  webpack: (config, options) => {
    if (options.isServer) {
      config.externals.push("@15gg/prisma");
    }

    return config;
  },
};
