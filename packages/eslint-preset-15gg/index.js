module.exports = {
  extends: ["next/core-web-vitals", "plugin:prettier/recommended"],
  settings: {
    next: {
      rootDir: ["./apps/*/", "./packages/*/"],
    },
  },
  rules: {
    "@next/next/no-server-import-in-page": "off",
  },
};
