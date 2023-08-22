/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        if (process.env.NODE_ENV === "development") {
            return [
                {
                    source: "/",
                    destination: "https://codakcodak.site",
                },
            ];
        }
    },
};

module.exports = nextConfig;
