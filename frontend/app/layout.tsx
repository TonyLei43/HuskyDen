import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HuskyDen - UW Course & Professor Reviews",
  description: "Rate and review courses and professors at the University of Washington",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <nav className="text-white shadow-lg" style={{ backgroundColor: '#4b2e83' }}>
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
                HuskyDen
              </Link>
              <div className="flex gap-4">
                <Link href="/search?category=classes" className="hover:opacity-80 transition-opacity">
                  Courses
                </Link>
                <Link href="/search?category=professors" className="hover:opacity-80 transition-opacity">
                  Professors
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">
              HuskyDen - UW Course & Professor Reviews
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Built for UW students, by UW students
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
