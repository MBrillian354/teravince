import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function Footer() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFooter(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer
      className={`bg-black/20 backdrop-blur-md text-background w-full shadow-md transition-all duration-700 ease-out transform ${
        showFooter ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-center items-center text-sm text-primary">
        <span className="mx-1">Copyright © 2025 IDK Team</span>
        <span className="mx-1">|</span>
        <Link to="/terms" className="hover:text-primary/60 mx-1 transition-all duration-150">
          Terms & Conditions
        </Link>
        <span className="mx-1">|</span>
        <Link to="/privacy" className="hover:text-primary/60 mx-1 transition-all duration-150">
          Privacy Policy
        </Link>
        <span className="mx-1">|</span>
        <Link to="/cookies" className="hover:text-primary/60 mx-1 transition-all duration-150">
          Cookie Policy
        </Link>
      </div>
    </footer>
  );
}
