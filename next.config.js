/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: "dist",
    skipTrailingSlashRedirect: true,
    compiler: {
        emotion: true,
        styledComponents: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        optimizePackageImports: ["react-icons"],
    },
};

module.exports = nextConfig;
