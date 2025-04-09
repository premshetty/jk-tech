import { ThemeProvider } from "@/components/theme-provider";
import "./../globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen flex items-center justify-center ">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >   {children}

          </ThemeProvider>

        </main>
      </body>
    </html>
  );
}
