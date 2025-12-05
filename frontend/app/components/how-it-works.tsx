import { Upload, Zap, FileCheck } from "lucide-react"

const steps = [
  {
    icon: Upload,
    number: "1",
    title: "Upload Submissions",
    description: "Easily upload a ZIP file containing all student assignments in one go.",
  },
  {
    icon: Zap,
    number: "2",
    title: "Analyze & Compare",
    description: "Our system analyzes documents against each other and a vast online database.",
  },
  {
    icon: FileCheck,
    number: "3",
    title: "Review Report",
    description: "Receive a consolidated report with clear similarity scores and highlighted sources.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">How It Works</h2>
          <p className="text-gray-600 text-lg dark:text-gray-400">A simple, three-step process to ensure academic integrity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">
                  {step.number}. {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed dark:text-gray-400">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
