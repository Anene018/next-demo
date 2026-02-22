import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>Dev Event</p>
        </Link>

        <ul>
          <Link href="/">Home</Link>
          <Link href="/event">Event</Link>
          <Link href="/create">Create Event</Link>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
