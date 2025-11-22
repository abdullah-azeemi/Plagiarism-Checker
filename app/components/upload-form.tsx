"use client"

import type React from "react"

import { useState } from "react"
import { Upload } from "lucide-react"

export default function UploadForm() {
  const [assignmentName, setAssignmentName] = useState("")
  const [similarity, setSimilarity] = useState(70)
  const [fileTypes, setFileTypes] = useState({
    py: true,
    java: true,
    cpp: false,
    js: false,
    txt: false,
    docx: true,
  })
  const [detectionMode, setDetectionMode] = useState("both")
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    console.log("Files dropped")
  }

  const toggleFileType = (type: keyof typeof fileTypes) => {
    setFileTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-blue-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg>
            <span className="text-sm font-medium">Plagiarism Detection</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload and Analyze Submissions</h1>
          <p className="text-gray-600">Check student assignments for plagiarism with our powerful detection tool.</p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-16 text-center mb-8 transition-colors ${
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white hover:border-gray-400"
          }`}
        >
          <div className="flex justify-center mb-4">
            <Upload className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Drag & Drop a .zip file here</h2>
          <p className="text-gray-600 mb-6">or click the button below to browse your files</p>
          <button className="px-8 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Select File
          </button>
        </div>

        {/* Analysis Settings */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Settings</h2>

          {/* Assignment Name */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Name</label>
            <input
              type="text"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
              placeholder="e.g., Final Project"
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Similarity Threshold */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">Similarity Threshold</label>
              <span className="text-sm font-semibold text-blue-600">{similarity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={similarity}
              onChange={(e) => setSimilarity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* File Types to Analyze */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">File Types to Analyze</label>
            <div className="flex flex-wrap gap-4">
              {Object.entries(fileTypes).map(([type, checked]) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleFileType(type as keyof typeof fileTypes)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">.{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Detection Mode */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">Detection Mode</label>
            <div className="flex gap-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="detection"
                  value="code"
                  checked={detectionMode === "code"}
                  onChange={(e) => setDetectionMode(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Code Structure</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="detection"
                  value="text"
                  checked={detectionMode === "text"}
                  onChange={(e) => setDetectionMode(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Text Similarity</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="detection"
                  value="both"
                  checked={detectionMode === "both"}
                  onChange={(e) => setDetectionMode(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Both</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Analyze Submissions
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
