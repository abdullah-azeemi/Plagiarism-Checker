export default function StatusSteps() {
  return (
    <div className="bg-white rounded-lg p-8">
      <div className="space-y-6">
        {/* Step 1: Files Extracted */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Files Extracted</h3>
            <p className="text-sm text-gray-500 mt-1"></p>
          </div>
          <span className="text-right font-semibold text-gray-900">30/30</span>
        </div>

        {/* Step 2: Generating Embeddings */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Generating Embeddings</h3>
            <p className="text-sm text-gray-500 mt-1">Creating vector representations of documents.</p>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "80%" }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">80%</p>
          </div>
        </div>

        {/* Step 3: Pairwise Comparisons */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Pairwise Comparisons</h3>
            <p className="text-sm text-gray-500 mt-1">Based on formula sin: n/2</p>
          </div>
          <span className="text-right font-semibold text-gray-900">45/435</span>
        </div>
      </div>
    </div>
  )
}
