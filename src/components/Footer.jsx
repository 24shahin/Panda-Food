// src/components/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-surfaceLight dark:bg-surfaceDark text-gray-700 dark:text-gray-300 py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <p>© {new Date().getFullYear()} PandaFood. All rights reserved.</p>
        <div className="flex gap-4 mt-2 sm:mt-0 text-sm">
          <a href="#" className="hover:text-primary">
            Privacy
          </a>
          <a href="#" className="hover:text-primary">
            Terms
          </a>
          <a href="#" className="hover:text-primary">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
