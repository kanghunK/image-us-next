import NavigationBar from "@/components/NavigationBar";
import { RootLayoutChildren } from "@/lib/types";
import "./globals.css";

export default function RootLayout({ children }: RootLayoutChildren) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
