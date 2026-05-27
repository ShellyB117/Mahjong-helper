import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riichi Mahjong Helper",
  description:
    "Track your hand and table to see shanten, waits, and possible yaku in Japanese Riichi Mahjong.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <header className="border-b border-mj-border bg-mj-panel/80 backdrop-blur sticky top-0 z-40">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <h1 className="font-bold text-lg tracking-tight text-mj-accent">
              Riichi Mahjong Helper
            </h1>
            <p className="text-xs text-[var(--muted)]">
              Shanten, waits, and yaku — table-aware
            </p>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
