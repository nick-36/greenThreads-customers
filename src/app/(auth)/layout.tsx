import {ClerkProvider} from "@clerk/nextjs";
import "./../globals.css";
import {Toaster} from "@/components/ui/toaster";

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
