"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";

export default function ClientLayout({ children }) {
  return ( {children}
    // <ClerkProvider>
    //   <ThemeProvider
    //     attribute="class"
    //     defaultTheme="dark"
    //     enableSystem
    //     disableTransitionOnChange
    //   >
    //     <Header />
    //     <main className="min-h-screen pt-20">{children}</main>
    //     <footer className="bg-muted/50 py-12">
    //       <div className="container mx-auto px-4 text-center text-gray-200">
    //         <p>hello I am footer</p>
    //       </div>
    //     </footer>
    //   </ThemeProvider>
    // </ClerkProvider>
  );
}