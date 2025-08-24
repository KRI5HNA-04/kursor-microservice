export default function Footer() {
  return (
    <footer className="w-full bg-black py-10 mt-10">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-4">
        {/* Branding */}
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white text-lg">
            K
          </div>
          <span className="text-2xl font-semibold text-white">Kursor</span>
        </div>
        {/* Quick Links */}
        <div className="flex gap-6 mb-4 md:mb-0">
          {["Editor", "Features", "About", "Contact"].map((link) => (
            <a
              key={link}
              href={`${link.toLowerCase()}`}
              className="text-gray-300 hover:text-purple-400 transition text-sm"
            >
              {link}
            </a>
          ))}
        </div>
        {/* Copyright */}
        <div className="text-gray-500 text-xs text-center md:text-right">
          &copy; {new Date().getFullYear()} Kursor. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
