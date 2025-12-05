"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Download, Flag, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ComparisonPage() {
  const [severity, setSeverity] = useState("medium")
  const [currentMatch, setCurrentMatch] = useState(1)

  const studentA = {
    name: "Student A: John Doe",
    file: "submission_A.py",
    code: `def calculate_average(numbers):
  """This function calculates the average of a list of numbers"""
  total = sum(numbers)
  count = len(numbers)
  if count == 0:
    return 0
  average = total / count
  return average

def another_function():
  print("This is another function.")

def find_maximum(data_list):
  """Finds the maximum value in a list"""
  if not data_list:
    return None
  max_val = data_list[0]
  for item in data_list:
    if item > max_val:
      max_val = item
  return max_val`,
  }

  const studentB = {
    name: "Student B: Jane Smith",
    file: "submission_B.py",
    code: `def calculate_average(numbers):
  """This function calculates the average of a list of numbers"""
  total = sum(numbers)
  count = len(numbers)
  if count == 0:
    return 0
  average = total / count
  return average

def some_other_function():
  print("This function is different.")

def get_largest_number(values):
  """Returns the largest number from a list"""
  if not values:
    return None
  largest = values[0]
  for val in values:
    if val > largest:
      largest = val
  return largest`,
  }

  const highlightCode = (code: string, type: "exact" | "semantic" | "possible") => {
    const lines = code.split("\n")
    return lines.map((line, idx) => {
      if (type === "exact" && (line.includes("total =") || line.includes("sum(") || line.includes("len("))) {
        return (
          <span key={idx} className="bg-red-100 line-through">
            {line}
          </span>
        )
      }
      if (type === "semantic" && (line.includes("def") || line.includes("return"))) {
        return (
          <span key={idx} className="bg-orange-100">
            {line}
          </span>
        )
      }
      if (type === "possible" && (line.includes("for") || line.includes("if"))) {
        return (
          <span key={idx} className="bg-yellow-100">
            {line}
          </span>
        )
      }
      return <span key={idx}>{line}</span>
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <span className="text-sm font-bold text-white">PD</span>
            </div>
            <span className="font-semibold text-gray-900">Plagiarism Detector</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Dashboard
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              All Submissions
            </a>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-300 to-orange-400"></div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Plagiarism Comparison</h1>
          <p className="text-gray-600">
            Comparing <span className="font-semibold">Student A (submission_A.py)</span> and{" "}
            <span className="font-semibold">Student B (submission_B.py)</span>
          </p>
        </div>

        {/* Controls Section */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Previous Match
            </Button>
            <span className="text-sm text-gray-600">Match {currentMatch}</span>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              Next Match
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export as PDF
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              <AlertCircle className="h-3 w-3 mr-1" />
              Mark as False Positive
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
              <Flag className="h-3 w-3 mr-1" />
              Mark as Plagiarism
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Select Severity
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSeverity("low")}>Low</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSeverity("medium")}>Medium</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSeverity("high")}>High</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-8 rounded-lg bg-blue-50 p-4 text-sm text-gray-700 border border-blue-200">
          <p>
            Code snippets are displayed side-by-side with synchronized scrolling. Sections with potential plagiarism are
            highlighted: <span className="inline-block px-2 py-0.5 bg-red-200 rounded">Red for exact matches</span>,{" "}
            <span className="inline-block px-2 py-0.5 bg-orange-200 rounded ml-2">
              Orange for high semantic similarity
            </span>
            , and{" "}
            <span className="inline-block px-2 py-0.5 bg-yellow-200 rounded ml-2">Yellow for possible similarity</span>.
          </p>
        </div>

        {/* Code Comparison */}
        <div className="grid grid-cols-2 gap-6">
          {/* Student A */}
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h3 className="font-semibold text-gray-900">{studentA.name}</h3>
              <p className="text-sm text-gray-600">{studentA.file}</p>
            </div>
            <div className="p-6 overflow-x-auto max-h-96 overflow-y-auto bg-white">
              <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
                <code className="text-xs leading-relaxed">
                  {studentA.code.split("\n").map((line, idx) => (
                    <div
                      key={idx}
                      className={`${
                        line.includes("total") || line.includes("sum")
                          ? "bg-red-100"
                          : line.includes("def") || line.includes("return")
                            ? "bg-orange-100"
                            : line.includes("for") || line.includes("if")
                              ? "bg-yellow-100"
                              : ""
                      }`}
                    >
                      {line}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>

          {/* Student B */}
          <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h3 className="font-semibold text-gray-900">{studentB.name}</h3>
              <p className="text-sm text-gray-600">{studentB.file}</p>
            </div>
            <div className="p-6 overflow-x-auto max-h-96 overflow-y-auto bg-white">
              <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words">
                <code className="text-xs leading-relaxed">
                  {studentB.code.split("\n").map((line, idx) => (
                    <div
                      key={idx}
                      className={`${
                        line.includes("total") || line.includes("sum")
                          ? "bg-red-100"
                          : line.includes("def") || line.includes("return")
                            ? "bg-orange-100"
                            : line.includes("for") || line.includes("if")
                              ? "bg-yellow-100"
                              : ""
                      }`}
                    >
                      {line}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
