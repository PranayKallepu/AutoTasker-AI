"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // links for navigation
  const links = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-14 bg-white shadow-sm z-50">
        <div className="container mx-auto flex items-center justify-between h-full px-6">
          {/* Logo  */}
          <Link href="/" className="flex flex-col items-center">
            <span className="font-bold text-xl">AutoTasker AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative pb-1 font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-black border-b-black border-b-2"
                      : "text-gray-500  "
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="text-red-500 transition-colors duration-300 cursor-pointer"
            >
              Logout
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Fullscreen Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-40 p-6 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <span className="font-bold text-xl">AutoTasker AI</span>
          </Link>
          <button onClick={toggleMenu}>
            <X size={28} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-6 mt-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-lg font-medium ${
                pathname === link.href ? "text-black" : "text-gray-600"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="text-lg font-medium text-red-500 transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
