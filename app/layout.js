"use client"

import { Geist, Geist_Mono } from "next/font/google";
import 'react-calendar/dist/Calendar.css';
import { StoreProvider } from "./Store";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css'; 
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/*  export const metadata: Metadata = {
  title: "SYSTEM",
  description: "",
}; 
 */

const queryClient = new QueryClient()
export default function RootLayout({ children }) {
  return (  
    <StoreProvider>
      <QueryClientProvider client={queryClient}>
        <html>
        <body>
          {children}
          <ToastContainer/>
        </body>
      </html>
      </QueryClientProvider>
    </StoreProvider>
);
}
