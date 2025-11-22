"use client"

import { Bell, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ResultsHeader() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="font-bold text-gray-900">Plagiarism Checker</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-6">
          <button className="text-gray-700 text-sm font-medium hover:text-blue-600">Dashboard</button>
          <button className="text-gray-700 text-sm font-medium hover:text-blue-600">New Upload</button>
          <button className="text-gray-700 text-sm font-medium hover:text-blue-600">Settings</button>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-orange-100">
            <User className="w-5 h-5 text-orange-600" />
          </Button>
        </div>
      </div>
    </header>
  )
}
