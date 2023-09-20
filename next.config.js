/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        if (process.env.NODE_ENV === "development") {
            return [
                {
                    source: "/backapi/:path*",
                    destination: "https://codakcodak.site/backapi/:path*",
                },
            ];
        }
    },
};

module.exports = nextConfig;
