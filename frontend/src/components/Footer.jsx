import { Twitter, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-purple-800 via-indigo-700 to-blue-800 text-white shadow-inner border-t border-indigo-600">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-4 tracking-wide">🚀 Slot Mint</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Revolutionize your digital experience with NFT reservations on Solana.
            Mint. Book. Trade. Own the moment.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3 text-gray-300">
            <li>
              <a href="/" className="hover:text-white transition duration-200">
                🏠 Home
              </a>
            </li>
            <li>
              <a href="/mint" className="hover:text-white transition duration-200">
                🎨 Mint Experience
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white transition duration-200">
                📖 About Us
              </a>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
          <div className="flex space-x-5">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-transform transform hover:scale-110"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-transform transform hover:scale-110"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="mailto:hello@slotmint.xyz"
              className="text-gray-300 hover:text-white transition-transform transform hover:scale-110"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center py-6 border-t border-indigo-600 text-sm text-gray-400">
        © {new Date().getFullYear()} <span className="text-white font-semibold">Slot Mint</span>. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
