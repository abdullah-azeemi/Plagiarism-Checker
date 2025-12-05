"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, Search } from "lucide-react"
import Navigation from "../components/navigation"
import Footer from "../components/footer"

// Sample suspicious pairs data
interface SuspiciousPair {
  id: string
  student1: string
  student2: string
  similarity: number
  status: "Identical" | "Flagged" | "Suspicious"
  matchedSentences: number
}

const samplePairs: SuspiciousPair[] = [
  {
    id: "1",
    student1: "Alex Johnson",
    student2: "Brad Smith",
    similarity: 92,
    status: "Identical",
    matchedSentences: 12
  },
  {
    id: "2",
    student1: "Charlie Brown",
    student2: "Diana Ross",
    similarity: 85,
    status: "Flagged",
    matchedSentences: 8
  },
  {
    id: "3",
    student1: "Ethan Hunt",
    student2: "Fiona Apple",
    similarity: 78,
    status: "Suspicious",
    matchedSentences: 6
  },
  {
    id: "4",
    student1: "George Martin",
    student2: "Hannah Montana",
    similarity: 81,
    status: "Flagged",
    matchedSentences: 9
  },
  {
    id: "5",
    student1: "Ian Fleming",
    student2: "Jane Doe",
    similarity: 74,
    status: "Suspicious",
    matchedSentences: 5
  },
  {
    id: "6",
    student1: "Kevin Hart",
    student2: "Lisa Simpson",
    similarity: 88,
    status: "Flagged",
    matchedSentences: 10
  },
  {
    id: "7",
    student1: "Mike Ross",
    student2: "Nina Simone",
    similarity: 72,
    status: "Suspicious",
    matchedSentences: 4
  },
  {
    id: "8",
    student1: "Oscar Wilde",
    student2: "Paula Abdul",
    similarity: 76,
    status: "Suspicious",
    matchedSentences: 7
  }
]

export default function ResultsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState("similarity")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Identical":
        return "bg-red-100 text-red-800 border-red-200"
      case "Flagged":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Suspicious":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return "text-red-600"
    if (similarity >= 75) return "text-orange-500"
    return "text-yellow-600"
  }

  const filteredPairs = samplePairs
    .filter(pair => {
      const matchesSearch =
        pair.student1.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pair.student2.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterStatus === "all" || pair.status === filterStatus
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sortBy === "similarity") return b.similarity - a.similarity
      if (sortBy === "student1") return a.student1.localeCompare(b.student1)
      if (sortBy === "student2") return a.student2.localeCompare(b.student2)
      return 0
    })

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-6 py-12 mt-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Results Dashboard
          </h1>
          <p className="text-gray-600">
            Suspicious Pairs - Analyzing 15 submissions
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
            <p className="text-3xl font-bold text-gray-900">15</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Suspicious Pairs</p>
            <p className="text-3xl font-bold text-orange-600">{samplePairs.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">Avg. Similarity</p>
            <p className="text-3xl font-bold text-gray-900">
              {Math.round(samplePairs.reduce((acc, p) => acc + p.similarity, 0) / samplePairs.length)}%
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-gray-600 mb-1">High Risk (≥90%)</p>
            <p className="text-3xl font-bold text-red-600">
              {samplePairs.filter(p => p.similarity >= 90).length}
            </p>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filter:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Status</option>
                <option value="Identical">Identical</option>
                <option value="Flagged">Flagged</option>
                <option value="Suspicious">Suspicious</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="similarity">Similarity</option>
                <option value="student1">Student 1</option>
                <option value="student2">Student 2</option>
              </select>
            </div>

            {/* Export Button */}
            <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </Card>

        {/* Suspicious Pairs List */}
        <div className="space-y-4">
          {filteredPairs.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-500">No matches found for your search criteria.</p>
            </Card>
          ) : (
            filteredPairs.map((pair) => (
              <Card key={pair.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-teal-700 font-semibold text-sm">
                            {pair.student1.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{pair.student1}</span>
                      </div>
                      <span className="text-gray-400">↔</span>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                          <span className="text-cyan-700 font-semibold text-sm">
                            {pair.student2.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{pair.student2}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <Badge className={`${getStatusColor(pair.status)} border`}>
                        {pair.status}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {pair.matchedSentences} matched sentences
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    {/* Similarity Score */}
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getSimilarityColor(pair.similarity)}`}>
                        {pair.similarity}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Similarity</div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-32">
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${pair.similarity >= 90
                            ? 'bg-red-500'
                            : pair.similarity >= 75
                              ? 'bg-orange-500'
                              : 'bg-yellow-400'
                            }`}
                          style={{ width: `${pair.similarity}%` }}
                        />
                      </div>
                    </div>

                    {/* View Details Button */}
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
