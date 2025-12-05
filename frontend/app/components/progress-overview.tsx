interface ProgressOverviewProps {
  progress: number
}

export default function ProgressOverview({ progress }: ProgressOverviewProps) {
  return (
    <div className="bg-white rounded-lg p-8 mb-8">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Overall Progress</h2>
        <span className="text-3xl font-bold text-blue-600">{progress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Time Remaining */}
      <p className="text-sm text-gray-600">Estimated Time Remaining: ~2 minutes</p>
    </div>
  )
}
