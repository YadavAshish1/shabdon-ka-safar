"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { BookOpen, LogOut, User } from "lucide-react";
import Image from "next/image";
export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            {/* <BookOpen className="w-8 h-8 text-primary-600" /> */}
            <Image
              src="/icon.png"
              alt="Logo"
              width={31}
              height={31}
              priority
            />
            <span className="text-xl font-bold text-gray-900">Shabdon Ka Safar</span>
          </Link>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="w-4 h-4" />
                  <span>{session.user?.name}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-primary-600 font-medium">
                    {session.user?.role === "ADMIN" ? "Admin" : "Student"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

