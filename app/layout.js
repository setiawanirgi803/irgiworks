import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Irgi Setiawan | Spesialis Instalasi & Pemeliharaan Teknis",
  description: "Layanan profesional Elektrikal, Networking, HVAC, Pemanas, dan Plumbing.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProvider>
          <Navigation />
          {children}
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
