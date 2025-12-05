"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileArchive } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UploadForm() {
  const router = useRouter()
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

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
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].name.endsWith('.zip')) {
      setSelectedFile(files[0])
    } else {
      alert('Please upload a .zip file')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      if (files[0].name.endsWith('.zip')) {
        setSelectedFile(files[0])
      } else {
        alert('Please select a .zip file')
      }
    }
  }

  const toggleFileType = (type: keyof typeof fileTypes) => {
    setFileTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert('Please select a .zip file to upload')
      return
    }

    if (!assignmentName.trim()) {
      alert('Please enter an assignment name')
      return
    }

    setIsAnalyzing(true)

    try {
      // Prepare form data
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('assignmentName', assignmentName)
      formData.append('similarity', similarity.toString())
      formData.append('fileTypes', JSON.stringify(fileTypes))
      formData.append('detectionMode', detectionMode)

      // Upload and analyze
      const response = await fetch('http://localhost:5000/upload-and-analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()

      // Store results in sessionStorage and navigate
      sessionStorage.setItem('plagiarismResults', JSON.stringify(data))
      router.push('/results')
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(error.message || 'Failed to upload and analyze. Please ensure the backend is running.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-teal-600">
            <FileArchive className="w-5 h-5" />
            <span className="text-sm font-medium">Plagiarism Detection</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Upload and Analyze Submissions</h1>
          <p className="text-gray-600">Upload student assignments in a .zip file to check for plagiarism and similarities.</p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-16 text-center mb-8 transition-all ${isDragging
            ? "border-teal-500 bg-teal-50"
            : selectedFile
              ? "border-green-500 bg-green-50"
              : "border-gray-300 bg-white hover:border-gray-400"
            }`}
        >
          <div className="flex justify-center mb-4">
            {selectedFile ? (
              <FileArchive className="w-12 h-12 text-green-600" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {selectedFile ? selectedFile.name : 'Drag & Drop a .zip file here'}
          </h2>
          <p className="text-gray-600 mb-6">
            {selectedFile
              ? `File size: ${(selectedFile.size / 1024).toFixed(2)} KB`
              : 'or click the button below to browse your files'
            }
          </p>
          <label className="inline-block px-8 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer">
            {selectedFile ? 'Change File' : 'Select File'}
            <input
              type="file"
              accept=".zip"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
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
              placeholder="e.g., Final Year Project"
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Similarity Threshold */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">Similarity Threshold</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-teal-600">{similarity}%</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={similarity}
              onChange={(e) => setSimilarity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              style={{
                background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${similarity}%, #e5e7eb ${similarity}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
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
                    className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 accent-teal-600"
                  />
                  <span className="text-sm text-gray-700 font-medium">.{type}</span>
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
                  className="w-4 h-4 text-teal-600 accent-teal-600"
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
                  className="w-4 h-4 text-teal-600 accent-teal-600"
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
                  className="w-4 h-4 text-teal-600 accent-teal-600"
                />
                <span className="text-sm text-gray-700">Both</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!selectedFile || !assignmentName.trim() || isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'Check for Plagiarism'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
