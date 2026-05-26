import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SprintPark AI HR",
  description: "AI-powered recruitment lifecycle platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
