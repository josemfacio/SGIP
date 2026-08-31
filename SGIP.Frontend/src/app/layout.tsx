import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { StoreProvider } from "@/store/StoreProvider";
import { UserProvider } from "@/features/users/context/UserProvider";
export const metadata: Metadata = {
  title: "SGIP · Gestión financiera",
  description: "Sistema de Gestión Integral de Préstamos y transacciones.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 antialiased">
        <StoreProvider>
          <UserProvider>
            <AppShell>{children}</AppShell>
          </UserProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
