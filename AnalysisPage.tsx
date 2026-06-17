import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '@/context/AppContext'
import { trpc } from '@/providers/trpc'
import { Layout } from '@/components/Layout'
import {
  Activity,
  Brain,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Users,
  Clock,
  TrendingUp,
  Shield,
} from 'lucide-react'

export default function AnalysisPage() {
  const navigate = useNavigate()
  const { state } = useApp()
  const { selectedCity, scores, sessionId } = state
  const [analysis, setAnalysis] = useState('')

  const analyzeMutation = trpc.ai.analyze.useMutation({
    onSuccess: (data) => {
      setAnalysis(data.analysis)
    },
  })

  const handleAnalyze = () => {
    if (!selectedCity || !sessionId) return
    analyzeMutation.mutate({
      cityName: selectedCity.name,
      scores: {
        temperature: scores.temperatureScore,
        water: scores.waterSecurityScore,
        vegetation: scores.vegetationHealth,
        air: scores.airQuality,
        risk: scores.climateRiskScore,
      },
      sessionId,
    })
  }

  if (!selectedCity) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-[#8A8D98] mb-4">No city selected</p>
            <button
              onClick={() => navigate('/location')}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors"
            >
              Select a City
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const sections = analysis
    ? analysis.split('##').filter(Boolean).map((s) => {
        const lines = s.trim().split('\n')
        const title = lines[0].trim()
        const content = lines.slice(1).join('\n').trim()
        return { title, content }
      })
    : []

  const getIconForSection = (title: string) => {
    const lower = title.toLowerCase()
    if (lower.includes('risk')) return AlertTriangle
    if (lower.includes('community')) return Users
    if (lower.includes('future')) return Clock
    if (lower.includes('condition')) return Activity
    if (lower.includes('impact')) return TrendingUp
    return Shield
  }

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-[#8A8D98] uppercase tracking-wider">
              AI Earth Analysis
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Environmental Analysis
          </h1>
          <p className="text-[#8A8D98]">
            AI-powered interpretation of {selectedCity.name}'s environmental conditions
          </p>
        </div>

        {/* Trigger Analysis */}
        {!analysis && (
          <div className="glass-card p-8 text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Analyze Environmental Conditions
            </h2>
            <p className="text-[#8A8D98] mb-6 max-w-lg mx-auto">
              Our AI will interpret the environmental indicators for {selectedCity.name} 
              and explain the current condition, key risks, community implications, and 
              future concerns in plain language that anyone can understand.
            </p>
            <button
              onClick={handleAnalyze}
              disabled={analyzeMutation.isPending}
              className="flex items-center gap-3 px-8 py-4 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white rounded-xl font-semibold transition-all mx-auto"
            >
              {analyzeMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Start AI Analysis
                </>
              )}
            </button>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Analysis Results</h2>
              <button
                onClick={() => setAnalysis('')}
                className="text-sm text-[#8A8D98] hover:text-white transition-colors"
              >
                Run Again
              </button>
            </div>

            {sections.map((section) => {
              const Icon = getIconForSection(section.title)
              return (
                <div key={section.title} className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-lg">{section.title}</h3>
                  </div>
                  <div className="text-[#8A8D98] leading-relaxed whitespace-pre-line pl-13">
                    {section.content}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Score Overview */}
        <div className="glass-card p-6 mb-8">
          <h3 className="font-semibold mb-4">Current Environmental Scores</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Temperature', value: scores.temperatureScore, color: 'text-amber-400' },
              { label: 'Water Security', value: scores.waterSecurityScore, color: 'text-cyan-400' },
              { label: 'Vegetation Health', value: scores.vegetationHealth, color: 'text-emerald-400' },
              { label: 'Air Quality', value: scores.airQuality, color: 'text-blue-400' },
              { label: 'Climate Risk', value: scores.climateRiskScore, color: 'text-red-400' },
              { label: 'Sustainability', value: scores.sustainabilityScore, color: 'text-purple-400' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <span className="text-sm text-[#8A8D98]">{item.label}</span>
                <span className={`font-mono-data font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate('/sandbox')}
            className="flex items-center gap-2 px-6 py-3 glass-card-hover rounded-xl transition-all"
          >
            Run Future Simulations
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/intervention')}
            className="flex items-center gap-2 px-6 py-3 glass-card-hover rounded-xl transition-all"
          >
            Test Interventions
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Layout>
  )
}
