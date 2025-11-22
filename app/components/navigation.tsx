import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-gray-900">PlagiarismCheck Pro</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
            Features
          </Link>
          <Link href="#how-it-works" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
            How It Works
          </Link>
          <Link href="#why-choose-us" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
            Why Choose Us
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">Get Started</Button>
          <Link href="/login" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
            Log In
          </Link>
        </div>
      </div>
    </nav>
  )
}
