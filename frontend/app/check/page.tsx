"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileText, AlertCircle } from "lucide-react"
import Navigation from "../components/navigation"
import Footer from "../components/footer"

interface AnalysisResult {
    similarity: number
    highlightedText: Array<{
        text: string
        isMatch: boolean
        source?: string
    }>
    breakdown: Array<{
        category: string
        percentage: number
        color: string
    }>
}

export default function CheckPage() {
    const [text1, setText1] = useState("")
    const [text2, setText2] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [result, setResult] = useState<AnalysisResult | null>(null)

    const handleAnalyze = async () => {
        if (!text1.trim() || !text2.trim()) {
            alert("Please enter both texts to compare")
            return
        }

        setIsAnalyzing(true)

        try {
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
            const response = await fetch(`${apiUrl}/analyze-simple`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text_a: text1,
                    text_b: text2,
                }),
            })

            if (!response.ok) {
                throw new Error("Analysis failed")
            }

            const data = await response.json()

            // Transform backend response to UI format
            const similarity = Math.round(data.similarity_score * 100)

            setResult({
                similarity,
                highlightedText: [
                    { text: text2, isMatch: data.is_plagiarized, source: "Input Text 1" }
                ],
                breakdown: [
                    { category: "Exact Match", percentage: similarity, color: similarity > 75 ? "bg-red-500" : similarity > 50 ? "bg-yellow-400" : "bg-green-500" },
                    { category: "Paraphrased", percentage: 0, color: "bg-gray-300" },
                    { category: "Original Content", percentage: 100 - similarity, color: "bg-gray-300" }
                ]
            })
        } catch (error) {
            console.error("Analysis error:", error)
            alert("Failed to analyze texts. Please make sure the backend is running.")
        } finally {
            setIsAnalyzing(false)
        }
    }

    const getSimilarityColor = (score: number) => {
        if (score >= 90) return "text-red-600"
        if (score >= 75) return "text-orange-500"
        if (score >= 50) return "text-yellow-600"
        return "text-green-600"
    }

    const getSimilarityLabel = (score: number) => {
        if (score >= 90) return "Identical"
        if (score >= 75) return "High Similarity"
        if (score >= 50) return "Moderate Similarity"
        return "Low Similarity"
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Navigation />

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4 text-teal-600">
                        <FileText className="w-5 h-5" />
                        <span className="text-sm font-medium">Plagiarism Detector</span>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        Check Document for Plagiarism
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Compare two texts to detect similarities and potential plagiarism.
                    </p>
                </div>

                {/* Input Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card className="p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Original Text (Source)
                        </label>
                        <textarea
                            value={text1}
                            onChange={(e) => setText1(e.target.value)}
                            placeholder="Paste or type the original text here..."
                            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            {text1.length} characters
                        </p>
                    </Card>

                    <Card className="p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Text to Check
                        </label>
                        <textarea
                            value={text2}
                            onChange={(e) => setText2(e.target.value)}
                            placeholder="Paste or type the text you want to check..."
                            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            {text2.length} characters
                        </p>
                    </Card>
                </div>

                {/* Analyze Button */}
                <div className="flex justify-center mb-12">
                    <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !text1.trim() || !text2.trim()}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-12 py-6 text-lg font-medium"
                    >
                        {isAnalyzing ? "Analyzing..." : "Check Document"}
                    </Button>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Similarity Score */}
                            <Card className="p-6 lg:col-span-1">
                                <h3 className="text-sm font-medium text-gray-700 mb-4">
                                    Similarity Score
                                </h3>
                                <div className="flex flex-col items-center justify-center py-8">
                                    <div className="relative w-40 h-40">
                                        <svg className="w-40 h-40 transform -rotate-90">
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                stroke="#e5e7eb"
                                                strokeWidth="12"
                                                fill="none"
                                            />
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="70"
                                                stroke={result.similarity >= 75 ? "#ef4444" : result.similarity >= 50 ? "#eab308" : "#10b981"}
                                                strokeWidth="12"
                                                fill="none"
                                                strokeDasharray={`${2 * Math.PI * 70}`}
                                                strokeDashoffset={`${2 * Math.PI * 70 * (1 - result.similarity / 100)}`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className={`text-4xl font-bold ${getSimilarityColor(result.similarity)}`}>
                                                    {result.similarity}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className={`text-lg font-semibold mt-4 ${getSimilarityColor(result.similarity)}`}>
                                        {getSimilarityLabel(result.similarity)}
                                    </p>
                                </div>
                            </Card>

                            {/* Highlighted Text */}
                            <Card className="p-6 lg:col-span-2">
                                <h3 className="text-sm font-medium text-gray-700 mb-4">
                                    Highlighted Text
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                                    {result.highlightedText.map((segment, idx) => (
                                        <span
                                            key={idx}
                                            className={segment.isMatch ? "bg-red-200 text-red-900" : ""}
                                        >
                                            {segment.text}
                                        </span>
                                    ))}
                                </div>
                                {result.similarity > 50 && (
                                    <div className="mt-4 flex items-start gap-2 text-sm text-orange-700 bg-orange-50 p-3 rounded-lg">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <p>
                                            This text shows significant similarity to the source document.
                                            Review carefully for potential plagiarism.
                                        </p>
                                    </div>
                                )}
                            </Card>
                        </div>

                        {/* Detailed Breakdown */}
                        <Card className="p-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-4">
                                Detailed Analysis
                            </h3>
                            <div className="space-y-4">
                                {result.breakdown.map((item, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-700">{item.category}</span>
                                            <span className="text-sm font-semibold text-gray-900">
                                                {item.percentage}%
                                            </span>
                                        </div>
                                        <Progress value={item.percentage} className={`h-2 ${item.color}`} />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    )
}
