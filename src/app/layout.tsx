"use client";

import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Navbar from "./_components/Navbar/page";
import { store, persistor } from "@/lib/store"; // Import store and persistor directly
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import Footer from "./_components/footer/page";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <Navbar />
                {children}
                <Footer />
                <Toaster />
              </PersistGate>
            </Provider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
