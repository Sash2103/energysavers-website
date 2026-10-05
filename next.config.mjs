/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export only: `npm run build` writes plain HTML, CSS and JS to out/. No server features.
  output: 'export',
  // Every page keeps the old site's address, e.g. /ahf/ -> out/ahf/index.html
  trailingSlash: true,
  // Images are already resized WebP files in public/assets/img; no optimisation server.
  images: { unoptimized: true },
  // Don't let `next dev` write AGENTS.md / CLAUDE.md into the project
  agentRules: false,
};

export default nextConfig;
