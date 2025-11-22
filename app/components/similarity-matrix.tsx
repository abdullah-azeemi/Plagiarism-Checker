"use client"

import { Card } from "@/components/ui/card"

interface SimilarityMatrixProps {
  data: {
    students: string[]
    similarityMatrix: number[][]
  }
}

function getSimilarityColor(similarity: number): string {
  if (similarity === 0) return "bg-gray-100"
  if (similarity < 25) return "bg-gray-300"
  if (similarity < 50) return "bg-gray-500"
  if (similarity < 75) return "bg-yellow-400"
  if (similarity < 90) return "bg-orange-500"
  return "bg-red-500"
}

export default function SimilarityMatrix({ data }: SimilarityMatrixProps) {
  return (
    <Card className="p-6 overflow-x-auto">
      <div className="inline-block min-w-full">
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-32 text-left text-xs font-semibold text-gray-700 pb-4"></th>
              {data.students.map((student, idx) => (
                <th
                  key={idx}
                  className="w-12 h-12 text-center text-xs font-semibold text-gray-700 pb-4 transform -rotate-45 origin-center"
                  style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                >
                  <div className="rotate-180">{student.split(".")[0]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.students.map((student, rowIdx) => (
              <tr key={rowIdx}>
                <td className="text-xs font-medium text-gray-700 pr-4 py-2 whitespace-nowrap">{student}</td>
                {data.similarityMatrix[rowIdx].map((similarity, colIdx) => (
                  <td
                    key={colIdx}
                    className={`w-12 h-12 text-center text-xs font-semibold cursor-pointer transition-all hover:opacity-80 ${getSimilarityColor(similarity)}`}
                    title={`${similarity}%`}
                  >
                    {similarity > 0 && <span className="text-gray-900 opacity-0 hover:opacity-100">{similarity}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
