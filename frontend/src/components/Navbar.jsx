import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { User } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold">Slot Mint</h1>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/experiences" className="hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">
              Experiences
            </Link>
            <Link to="/create" className="hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium">
              Create
            </Link>
            <Link to="/profile" className="hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
            </Link>
            <WalletMultiButton className="!bg-purple-700 hover:!bg-purple-800 transition-all duration-300" />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <WalletMultiButton className="!bg-purple-700 hover:!bg-purple-800 transition-all duration-300 mr-2" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-purple-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium">
              Home
            </Link>
            <Link to="/experiences" className="block hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium">
              Experiences
            </Link>
            <Link to="/create" className="block hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium">
              Create
            </Link>
            <Link to="/profile" className="block hover:bg-purple-700 px-3 py-2 rounded-md text-base font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 