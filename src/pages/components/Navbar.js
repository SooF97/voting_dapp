import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-500">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link legacyBehavior href="/">
                <a>
                  <Image
                    src="/images/sfn.svg"
                    alt="Logo"
                    width={25}
                    height={25}
                    className=""
                  />
                  <span className="tracking-wider font-bold">Voting</span>
                </a>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link legacyBehavior href="/">
                  <a className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                    Home
                  </a>
                </Link>
                <Link legacyBehavior href="/About">
                  <a className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                    About
                  </a>
                </Link>
                <Link legacyBehavior href="/Candidates">
                  <a className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                    Participants
                  </a>
                </Link>
                <Link legacyBehavior href="/Analytics">
                  <a className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                    Analytics
                  </a>
                </Link>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-blue-500 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen && (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
                {isOpen && (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <Link legacyBehavior href="/Candidates">
              <button className="bg-white hover:bg-blue-200 text-blue-500 font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-300">
                Vote
              </button>
            </Link>
          </div>
        </div>
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:hidden transition-all ease-in-out duration-500`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link legacyBehavior href="/">
              <a className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                Home
              </a>
            </Link>
            <Link legacyBehavior href="/About">
              <a className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                About
              </a>
            </Link>
            <Link legacyBehavior href="/Candidates">
              <a className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                Participants
              </a>
            </Link>
            <Link legacyBehavior href="/Analytics">
              <a className="text-white hover:text-gray-300 block px-3 py-2 rounded-md text-base font-medium">
                Analytics
              </a>
            </Link>
            <Link legacyBehavior href="/Candidates">
              <button className="bg-white hover:bg-blue-200 text-blue-500 font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-300">
                Vote
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
