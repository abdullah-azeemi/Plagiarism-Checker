"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download } from "lucide-react"
import SimilarityMatrix from "../components/similarity-matrix"
import ResultsHeader from "../components/results-header"

// Sample data for results
const resultsData = {
  title: "Final Year Project Thesis",
  submissionDate: "Oct 26, 2023",
  totalStudents: 15,
  suspiciousPairs: 8,
  averageSimilarity: 68,
  students: [
    "A. Johnson",
    "B. Smith",
    "C. Williams",
    "D. Brown",
    "E. Jones",
    "F. Garcia",
    "G. Miller",
    "H. Davis",
    "I. Rodriguez",
    "J. Martinez",
    "K. Hernandez",
    "L. Lopez",
    "M. Gonzalez",
    "N. Wilson",
    "O. Anderson",
  ],
  similarityMatrix: [
    [0, 45, 12, 78, 23, 34, 56, 18, 89, 34, 45, 67, 23, 12, 56],
    [45, 0, 34, 23, 56, 78, 12, 45, 34, 67, 23, 45, 78, 34, 23],
    [12, 34, 0, 45, 23, 67, 34, 56, 23, 12, 78, 34, 23, 45, 67],
    [78, 23, 45, 0, 34, 23, 67, 34, 23, 45, 34, 56, 23, 67, 12],
    [23, 56, 23, 34, 0, 45, 23, 67, 34, 23, 45, 23, 56, 34, 78],
    [34, 78, 67, 23, 45, 0, 34, 23, 56, 34, 23, 67, 34, 23, 45],
    [56, 12, 34, 67, 23, 34, 0, 45, 23, 67, 34, 23, 45, 78, 34],
    [18, 45, 56, 34, 67, 23, 45, 0, 34, 23, 56, 34, 23, 45, 67],
    [89, 34, 23, 23, 34, 56, 23, 34, 0, 45, 23, 67, 34, 23, 45],
    [34, 67, 12, 45, 23, 34, 67, 23, 45, 0, 34, 23, 56, 34, 23],
    [45, 23, 78, 34, 45, 23, 34, 56, 23, 34, 0, 45, 23, 67, 34],
    [67, 45, 34, 56, 23, 67, 23, 34, 67, 23, 45, 0, 34, 23, 45],
    [23, 78, 23, 23, 56, 34, 45, 23, 34, 56, 23, 34, 0, 45, 23],
    [12, 34, 45, 67, 34, 23, 78, 45, 23, 34, 67, 23, 45, 0, 56],
    [56, 23, 67, 12, 78, 45, 34, 67, 45, 23, 34, 45, 23, 56, 0],
  ],
}

export default function ResultsPage() {
  const [sortBy, setSortBy] = useState("name")
  const [activeTab, setActiveTab] = useState("matrix")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ResultsHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Results for: {resultsData.title}</h1>
          <p className="text-gray-600">Submitted: {resultsData.submissionDate}</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Students Analyzed</p>
            <p className="text-4xl font-bold text-gray-900">{resultsData.totalStudents}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Suspicious Pairs ({">75%"})</p>
            <p className="text-4xl font-bold text-gray-900">{resultsData.suspiciousPairs}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm font-medium mb-2">Average Similarity</p>
            <p className="text-4xl font-bold text-gray-900">{resultsData.averageSimilarity}%</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-transparent border-b border-gray-200 rounded-none p-0 h-auto">
              <TabsTrigger
                value="matrix"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none px-4 py-3 text-gray-700"
              >
                Similarity Matrix
              </TabsTrigger>
              <TabsTrigger
                value="pairs"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none px-4 py-3 text-gray-700"
              >
                Suspicious Pairs
              </TabsTrigger>
              <TabsTrigger
                value="viewer"
                className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none px-4 py-3 text-gray-700"
              >
                Submission Viewer
              </TabsTrigger>
            </TabsList>

            {/* Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-3 py-1 text-gray-700"
                >
                  <option value="name">Name</option>
                  <option value="similarity">Total Similarity</option>
                  <option value="matches">Matches</option>
                </select>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 ml-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300"></div>
                  <span className="text-xs text-gray-600">0-25%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-500"></div>
                  <span className="text-xs text-gray-600">25-50%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400"></div>
                  <span className="text-xs text-gray-600">50-75%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500"></div>
                  <span className="text-xs text-gray-600">75-90%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500"></div>
                  <span className="text-xs text-gray-600">90-100%</span>
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Download className="w-4 h-4" />
                Export as CSV
              </Button>
            </div>
          </div>

          <TabsContent value="matrix" className="mt-0">
            <SimilarityMatrix data={resultsData} />
          </TabsContent>

          <TabsContent value="pairs" className="mt-0">
            <Card className="p-6">
              <p className="text-gray-600">Suspicious Pairs view coming soon...</p>
            </Card>
          </TabsContent>

          <TabsContent value="viewer" className="mt-0">
            <Card className="p-6">
              <p className="text-gray-600">Submission Viewer coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
