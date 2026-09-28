import Link from "next/link";
import Image from "next/image";
import { FiTwitter, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FFFFFF] text-[#0D530E] border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Logo and Brand Description */}
          <div className="col-span-1 flex flex-col gap-4">
            <Link className="flex items-center gap-2 text-xl font-bold" href={"/"}>
              <Image
                src={"/notepad.png"}
                alt="NoteHub logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <h2 className="text-2xl font-extrabold tracking-tight">NoteHub</h2>
            </Link>
            <p className="text-gray-600 leading-relaxed">
              Your ultimate note-taking and documentation platform. Capture, organize, and share your thoughts effortlessly.
            </p>
          </div>

          {/* Quick Links (Mirrors Navbar) */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-3 font-medium text-gray-600">
              <li>
                <Link href="/" className="hover:text-[#0D530E] transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#0D530E] transition-colors">About</Link>
              </li>
              <li>
                <Link href="/aim" className="hover:text-[#0D530E] transition-colors">Aims</Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-[#0D530E] transition-colors">Explore</Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-[#0D530E] transition-colors">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="flex flex-col gap-3 font-medium text-gray-600">
              <li>
                <Link href="/privacy" className="hover:text-[#0D530E] transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#0D530E] transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-[#0D530E] transition-colors">Cookie Policy</Link>
              </li>
            </ul>
          </div>

          {/* Social Media & Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <div className="flex gap-4 mb-6">
              <Link 
                href="#" 
                className="p-2 border border-gray-200 rounded-full text-gray-600 hover:bg-[#0D530E] hover:text-[#FFFFFF] transition-all focus:outline-none focus:ring-2 focus:ring-[#0D530E]"
                aria-label="Twitter"
              >
                <FiTwitter size={20} />
              </Link>
              <Link 
                href="#" 
                className="p-2 border border-gray-200 rounded-full text-gray-600 hover:bg-[#0D530E] hover:text-[#FFFFFF] transition-all focus:outline-none focus:ring-2 focus:ring-[#0D530E]"
                aria-label="GitHub"
              >
                <FiGithub size={20} />
              </Link>
              <Link 
                href="#" 
                className="p-2 border border-gray-200 rounded-full text-gray-600 hover:bg-[#0D530E] hover:text-[#FFFFFF] transition-all focus:outline-none focus:ring-2 focus:ring-[#0D530E]"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={20} />
              </Link>
            </div>
            <Link 
              href="mailto:hello@notehub.com" 
              className="flex items-center gap-2 text-gray-600 hover:text-[#0D530E] font-medium transition-colors"
            >
              <FiMail size={20} />
              hello@notehub.com
            </Link>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>&copy; {currentYear} NoteHub. All rights reserved.</p>
          <p>Built for better productivity.</p>
        </div>
      </div>
    </footer>
  );
}