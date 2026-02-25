"use client";

import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

const NavBar = () => {
  const handleNavClick = (label: string, href: string) => {
    posthog.capture("nav_link_clicked", {
      link_label: label,
      link_href: href,
    });
  };

  return (
    <header>
      <nav>
        <Link href="/" className="logo" onClick={() => handleNavClick("Logo", "/")}>
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>Dev Event</p>
        </Link>

        <ul>
          <Link href="/" onClick={() => handleNavClick("Home", "/")}>Home</Link>
          <Link href="/event" onClick={() => handleNavClick("Event", "/event")}>Event</Link>
          <Link href="/create" onClick={() => handleNavClick("Create Event", "/create")}>Create Event</Link>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
