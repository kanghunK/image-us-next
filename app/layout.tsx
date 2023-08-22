"use client";

import { RootLayoutChildren } from "@/lib/types";
import "./globals.css";

export default function RootLayout({ children }: RootLayoutChildren) {
    return (
        <html lang="en">
            <body>
                <main style={{ height: "inherit" }}>{children}</main>
            </body>
        </html>
    );
}
