import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-gray-900">PlagiarismCheck Pro</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
            Home
          </Link>
          <Link href="/upload" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
            Batch Upload
          </Link>
          <Link href="/check" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
            Single Check
          </Link>
          <Link href="/results" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
            Results
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">Get Started</Button>
        </div>
      </div>
    </nav>
  )
}
