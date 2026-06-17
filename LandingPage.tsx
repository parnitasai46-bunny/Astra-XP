import { useNavigate } from 'react-router'
import { useApp } from '@/context/AppContext'
import { trpc } from '@/providers/trpc'
import {
  Globe,
  Cpu,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Layout } from '@/components/Layout'

const features = [
  {
    icon: Globe,
    title: 'Earth Digital Twin',
    description: 'Create a real-time digital replica of any city using space-derived environmental data.',
  },
  {
    icon: Cpu,
    title: 'AI-Powered Analysis',
    description: 'Let our AI interpret complex environmental indicators in simple, understandable language.',
  },
  {
    icon: BarChart3,
    title: 'Future Simulation',
    description: 'Run what-if scenarios to see how different futures unfold for any location.',
  },
  {
    icon: MessageSquare,
    title: 'Negotiate with Earth',
    description: 'Chat with the Digital Twin and explore the consequences of different decisions.',
  },
]

const impactAreas = [
  { icon: Shield, label: 'Climate Resilience', color: 'text-emerald-400' },
  { icon: TrendingUp, label: 'Urban Planning', color: 'text-blue-400' },
  { icon: Users, label: 'Community Impact', color: 'text-amber-400' },
  { icon: Sparkles, label: 'Sustainability', color: 'text-cyan-400' },
]

const steps = [
  { num: '01', label: 'Select a City' },
  { num: '02', label: 'Generate Digital Twin' },
  { num: '03', label: 'Explore Scenarios' },
  { num: '04', label: 'Test Interventions' },
  { num: '05', label: 'AI Insights' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { reset } = useApp()

  // Seed cities on load
  trpc.city.list.useQuery()

  const handleLaunch = () => {
    reset()
    navigate('/location')
  }

  return (
    <Layout showNav={false}>
      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative">
          {/* Orbital animation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="w-[600px] h-[600px] rounded-full border border-white/5 animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-[400px] h-[400px] rounded-full border border-white/5 animate-[spin_40s_linear_infinite_reverse]" />
            <div className="absolute w-[200px] h-[200px] rounded-full bg-blue-500/5 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-[#8A8D98]">AI-Powered Earth Intelligence Platform</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6">
              <span className="text-gradient">ASTRA-X</span>
            </h1>
            
            <p className="text-2xl md:text-3xl font-light text-[#8A8D98] mb-4">
              Ask Earth About Its Future
            </p>
            
            <p className="text-lg text-[#8A8D98]/80 max-w-2xl mx-auto mb-12 leading-relaxed">
              An AI-powered Earth Digital Twin platform using space intelligence to simulate 
              future environmental outcomes and empower data-driven decisions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleLaunch}
                className="group flex items-center gap-3 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-300 glow-blue"
              >
                <Globe className="w-5 h-5" />
                Launch Digital Twin
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/location')}
                className="flex items-center gap-3 px-8 py-4 glass-card-hover text-[#F4F4F4] rounded-xl font-semibold"
              >
                <Cpu className="w-5 h-5" />
                Explore Demo
              </button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 py-16 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              {steps.map((step, i) => (
                <div key={step.num} className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-xl glass-card flex items-center justify-center">
                      <span className="font-mono-data text-blue-400 font-bold">{step.num}</span>
                    </div>
                    <span className="text-xs text-[#8A8D98]">{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-[#8A8D98] hidden md:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-16 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-4">What is ASTRA-X</h2>
            <p className="text-center text-[#8A8D98] mb-12 max-w-2xl mx-auto">
              ASTRA-X transforms complex Earth observation data into interactive 
              decision-making tools that anyone can use.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="glass-card-hover p-6 flex flex-col gap-4"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-sm text-[#8A8D98] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Impact Areas */}
        <section className="px-6 py-16 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Impact Areas</h2>
            <p className="text-[#8A8D98] mb-12">
              ASTRA-X helps communities, planners, and students understand environmental impact 
              across multiple dimensions.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              {impactAreas.map((area) => {
                const Icon = area.icon
                return (
                  <div
                    key={area.label}
                    className="flex items-center gap-3 px-6 py-4 glass-card"
                  >
                    <Icon className={`w-5 h-5 ${area.color}`} />
                    <span className="font-medium">{area.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="px-6 py-20 border-t border-white/5">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
            <p className="text-[#8A8D98] mb-8">
              Start your journey with ASTRA-X and discover how decisions today 
              shape the future of our planet.
            </p>
            <button
              onClick={handleLaunch}
              className="group flex items-center gap-3 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all duration-300 glow-blue mx-auto"
            >
              <Globe className="w-5 h-5" />
              Launch Digital Twin
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </div>
    </Layout>
  )
}
