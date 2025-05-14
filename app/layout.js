import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'BestChoice',
  description: 'Compare products easily',
  icons: {
    icon: null, // This will remove the favicon
  },
}

import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Header from "./dashboard/_components/Header";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body>
          {children}
          </body>
      </ClerkProvider>
    </html>
  )
}
