import Features from "./components/features"
import HowItWorks from "./components/how-it-works"
import WhyChooseUs from "./components/why-choose-us"
import Footer from "./components/footer"
import Navigation from "./components/navigation"
import Hero from "./components/hero"


export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
      <WhyChooseUs />
      <Footer />
    </main>
  )
}
