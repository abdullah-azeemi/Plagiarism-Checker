import { FileText, BarChart3, Code2 } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Automated Batch Analysis",
    description: "Analyze hundreds of student assignments in a single upload. No more checking documents one by one.",
  },
  {
    icon: BarChart3,
    title: "Detailed Similarity Reports",
    description: "Get comprehensive reports with comparisons and highlighted sources with clear similarity scores.",
  },
  {
    icon: Code2,
    title: "Code & Text Detection",
    description: "Detect plagiarism in both written essays and programming code. Supports multiple languages.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features to Simplify Your Workflow</h2>
          <p className="text-gray-600 text-lg">
            Our tool is packed with features designed to make plagiarism detection effortless and accurate for TAs and
            instructors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
