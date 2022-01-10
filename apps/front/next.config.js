/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    loader: "custom",
    domains: ["opgg-static.akamaized.net"],
  },
};
