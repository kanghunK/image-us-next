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
};

module.exports = nextConfig;
