"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";

  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Image src="/logo.svg" height={56} width={152} alt="Logo" />
          <div className="flex items-center gap-2">
            <Button variant="secondary">
              <Link href={isSignIn ? "sign-up" : "/sign-in"}>
                {isSignIn ? "Regístrate" : "Inicia sesión"}
              </Link>
            </Button>
          </div>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
