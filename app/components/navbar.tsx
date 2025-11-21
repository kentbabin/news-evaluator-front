import React, { useState } from "react";
import { Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <a href="/" className="flex items-center space-x-2">
            <img
              src="/op_pluto_logo.png"
              alt="Operation Pluto Logo"
              className="h-12 w-auto"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-10 text-sm text-op">
            <a href="/" className="hover:underline">
              Evaluate
            </a>
            <a href="/data" className="hover:underline">
              Data
            </a>
            <a href="/about" className="hover:underline">
              About
            </a>
            <a href="https://operationpluto.org" target="_blank" className="hover:underline">
              OP Home
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-op hover:text-teal-800 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div
          className={`md:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col items-start space-y-3 p-4 text-sm text-gray-800">
            <a
              href="/analyze"
              className="w-full hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Evaluate
            </a>
            <a
              href="/data"
              className="w-full hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Reports
            </a>
            <a
              href="/about"
              className="w-full hover:underline"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
            <a
              href="https://operationpluto.org"
              className="w-full hover:underline"
              onClick={() => setIsOpen(false)}
            >
              OP Home
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
