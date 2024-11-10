// HomeTest/components/Footer.js
import React from "react";
import Link from "next/link";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="container d-flex flex-column align-items-center">
        <div className="footer-links d-flex gap-3 mb-2">
          <Link href="/about" className="footer-link">About</Link>
          <Link href="/contact" className="footer-link">Contact</Link>
        </div>
        <p className="footer-copyright">
          © 2024 Stray Finder. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
