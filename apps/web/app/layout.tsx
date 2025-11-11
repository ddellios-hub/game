import "@/styles/globals.css";
import type { Metadata } from "next";
import { Providers } from "@/providers";

export const metadata: Metadata = {
  title: "Sandbox Hub",
  description: "Sandbox + mini-game hub for teens"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
