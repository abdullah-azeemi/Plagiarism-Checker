import { Zap, Target, Smile } from "lucide-react"

const reasons = [
  {
    icon: Zap,
    title: "Boost Efficiency",
    description: "Save countless hours of manual checking. Focus on teaching, not tedious administrative tasks.",
  },
  {
    icon: Target,
    title: "Unmatched Accuracy",
    description:
      "Our advanced algorithms provide reliable and objective results you can trust to uphold academic integrity.",
  },
  {
    icon: Smile,
    title: "Intuitive & Easy",
    description: "A clean, straightforward interface that requires no training. Get started in minutes.",
  },
]

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
          <p className="text-gray-600 text-lg">Built for educators, by educators. We understand your needs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow text-center"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{reason.title}</h3>
                <p className="text-gray-600 leading-relaxed">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
