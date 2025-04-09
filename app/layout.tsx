'use client'

import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IngestionProvider } from "@/lib/context/IngestionContext";
import { LogOut, Upload, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/auth/login")
  }

  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={` antialiased`}
      >
        <IngestionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col h-screen">
              <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
                <div className="flex justify-between items-center w-full">
                  <div className="flex h-5 items-center space-x-4 text-sm">
                    <Link href={'/users'} className="flex items-center gap-2">
                      <Users className="h-4 w-4 ml-2 shrink-0" />
                      Manage Users
                    </Link>
                    <Separator orientation="vertical" />
                    <Link href={"/"} className="flex items-center gap-2">
                      <Upload className="h-4 w-4 ml-2 shrink-0" />
                      Upload Document
                    </Link>
                  </div>

                  <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
                    <LogOut className="h-4 w-4 ml-2 shrink-0" />
                    Log out
                  </Button>
                </div>
              </header>

              {children}
            </div>
          </ThemeProvider>

        </IngestionProvider>
      </body>
    </html>
  );
}
