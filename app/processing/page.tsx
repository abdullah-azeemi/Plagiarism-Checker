"use client"

import { useState } from "react"
import ProcessingHeader from "../components/processing-header"
import ProgressOverview from "../components/progress-overview"
import StatusSteps from "../components/status-steps"

export default function ProcessingPage() {
  const [progress, setProgress] = useState(65)
  const [isLoading, setIsLoading] = useState(true)

  return (
    <main className="min-h-screen bg-gray-50">
      <ProcessingHeader />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Loading Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Analysis in Progress...</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Please wait while we check the assignments for plagiarism. You can see the real-time progress below.
          </p>
        </div>

        {/* Progress Overview */}
        <ProgressOverview progress={progress} />

        {/* Status Steps */}
        <StatusSteps />

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 mt-12">
          <button className="px-6 py-2 text-gray-600 font-medium hover:text-gray-900 transition-colors">
            Cancel Analysis
          </button>
          <button className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
            <span>Show Logs</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </div>
    </main>
  )
}
