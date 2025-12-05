"use client"

import Navigation from "../components/navigation"
import Footer from "../components/footer"
import UploadForm from "../components/upload-form"

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />
      <UploadForm />
      <Footer />
    </main>
  )
}
