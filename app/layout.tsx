import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GLIDE – The Silent DJ Tram",
  description: "走るラウンジ、無音の熱狂。富山の日常をリデザインする。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased bg-[#0a0a0a] text-white min-h-screen flex justify-center">
        {/* スマートフォン幅に制限 */}
        <div className="w-full max-w-sm relative min-h-dvh flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
