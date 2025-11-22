import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2 mb-6 md:mb-0">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <span className="text-sm">© 2025 PlagiarismCheck Pro. All rights reserved.</span>
        </div>

        <div className="flex gap-8 text-sm">
          <Link href="#" className="hover:text-white transition-colors">
            About Us
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Contact
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
