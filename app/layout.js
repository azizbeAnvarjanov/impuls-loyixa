import toast, { Toaster } from "react-hot-toast";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <AuthProvider children={children}>
          <Toaster position="bottom-right" reverseOrder={false} />
          <div className="pt-[10vh]">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
