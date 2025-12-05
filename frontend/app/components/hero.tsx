import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Streamline Plagiarism Detection for All Your Student Assignments
          </h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Save time and ensure academic integrity with our powerful batch analysis tool. Designed for educators.
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
            Get Started for Free
          </Button>
        </div>

        <div className="relative h-96 bg-teal-900 rounded-lg overflow-hidden shadow-2xl">
          <div className="absolute inset-0 flex items-end justify-center p-8 bg-gradient-to-br from-teal-800 to-teal-900">
            <div className="space-y-6 w-full">
              {/* Document mockup */}
              <div className="bg-gray-100 rounded-lg p-4 space-y-3">
                <div className="h-2 bg-gray-400 w-1/3 rounded"></div>
                <div className="h-1 bg-gray-300 w-full rounded"></div>
                <div className="h-1 bg-gray-300 w-5/6 rounded"></div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4 space-y-3">
                <div className="h-2 bg-gray-400 w-1/2 rounded"></div>
                <div className="h-1 bg-gray-300 w-full rounded"></div>
              </div>

              {/* Coffee cup SVG representation */}
              <div className="flex justify-center pt-4">
                <svg width="120" height="80" viewBox="0 0 120 80" className="text-white">
                  <path
                    d="M20 40 Q20 50 30 55 L90 55 Q100 50 100 40 L100 30 Q100 20 90 20 L30 20 Q20 20 20 30 Z"
                    fill="white"
                    stroke="#ccc"
                    strokeWidth="1"
                  />
                  <path
                    d="M100 38 Q110 35 115 40 Q110 50 100 48"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <ellipse cx="60" cy="20" rx="40" ry="5" fill="white" stroke="#ccc" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
