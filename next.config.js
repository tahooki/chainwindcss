/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["monaco-editor"],
  webpack: (config) => {
    // Monaco Editor ESM 설정
    config.resolve.alias = {
      ...config.resolve.alias,
      "monaco-editor": "monaco-editor/esm/vs/editor/editor.api",
    };

    return config;
  },
};

module.exports = nextConfig;
