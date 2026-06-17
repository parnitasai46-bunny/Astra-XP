import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '@/context/AppContext'
import { trpc } from '@/providers/trpc'
import { Layout } from '@/components/Layout'
import {
  FileText,
  Download,
  Loader2,
  ArrowLeft,
  Check,
  Thermometer,
  Droplets,
  Leaf,
  Wind,
  AlertTriangle,
  BarChart3,
  Sparkles,
  Shield,

} from 'lucide-react'

export default function ReportPage() {
  const navigate = useNavigate()
  const { state } = useApp()
  const { selectedCity, scores, sessionId } = state
  const [report, setReport] = useState('')

  const reportMutation = trpc.ai.generateReport.useMutation({
    onSuccess: (data) => {
      setReport(data.report)
    },
  })

  const handleGenerate = () => {
    if (!selectedCity || !sessionId) return
    reportMutation.mutate({
      cityName: selectedCity.name,
      scores: {
        temperature: scores.temperatureScore,
        water: scores.waterSecurityScore,
        vegetation: scores.vegetationHealth,
        air: scores.airQuality,
        risk: scores.climateRiskScore,
        sustainability: scores.sustainabilityScore,
      },
      sessionId,
    })
  }

  const handleDownload = () => {
    if (!report) return
    const element = document.createElement('a')
    const file = new Blob([report], { type: 'text/markdown' })
    element.href = URL.createObjectURL(file)
    element.download = `astra-x-report-${selectedCity?.name?.toLowerCase().replace(/\s+/g, '-')}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
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

  // Parse report sections if available
  const sections = report
    ? report.split('###').filter(Boolean).map((s) => {
        const lines = s.trim().split('\n')
        const title = lines[0].trim()
        const content = lines.slice(1).join('\n').trim()
        return { title, content }
      })
    : []

  const getIconForSection = (title: string) => {
    const lower = title.toLowerCase()
    if (lower.includes('condition')) return Thermometer
    if (lower.includes('risk')) return AlertTriangle
    if (lower.includes('intervention')) return Leaf
    if (lower.includes('outcome')) return Check
    if (lower.includes('sustainability')) return BarChart3
    if (lower.includes('recommendation')) return Sparkles
    return Shield
  }

  const overallScore = Math.round(
    (scores.temperatureScore +
      scores.waterSecurityScore +
      scores.vegetationHealth +
      scores.airQuality +
      scores.sustainabilityScore) /
      5
  )

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-[#8A8D98] uppercase tracking-wider">
              Future Report
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Sustainability Report</h1>
          <p className="text-[#8A8D98]">
            Generate a comprehensive AI-powered sustainability report for {selectedCity.name}
          </p>
        </div>

        {!report && (
          <div className="glass-card p-8 text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Generate Sustainability Report
            </h2>
            <p className="text-[#8A8D98] mb-6 max-w-lg mx-auto">
              Our AI will analyze all the data collected during your session — current 
              conditions, simulations run, and interventions tested — to generate a 
              comprehensive sustainability report.
            </p>
            <button
              onClick={handleGenerate}
              disabled={reportMutation.isPending}
              className="flex items-center gap-3 px-8 py-4 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white rounded-xl font-semibold transition-all mx-auto"
            >
              {reportMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        )}

        {report && (
          <>
            {/* Report Header */}
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    Sustainability Report: {selectedCity.name}
                  </h2>
                  <p className="text-[#8A8D98] text-sm">
                    Generated by ASTRA-X AI on {new Date().toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 glass-card-hover rounded-xl transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>

              {/* Overall Score */}
              <div className="flex items-center gap-6 p-4 rounded-xl bg-white/5">
                <div className="text-center">
                  <p className="text-sm text-[#8A8D98] mb-1">Overall Score</p>
                  <p
                    className={`text-4xl font-mono-data font-bold ${
                      overallScore >= 70
                        ? 'text-emerald-400'
                        : overallScore >= 50
                        ? 'text-amber-400'
                        : 'text-red-400'
                    }`}
                  >
                    {overallScore}
                  </p>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Temperature', value: scores.temperatureScore, icon: Thermometer },
                    { label: 'Water Security', value: scores.waterSecurityScore, icon: Droplets },
                    { label: 'Vegetation', value: scores.vegetationHealth, icon: Leaf },
                    { label: 'Air Quality', value: scores.airQuality, icon: Wind },
                    { label: 'Climate Risk', value: scores.climateRiskScore, icon: AlertTriangle },
                    { label: 'Sustainability', value: scores.sustainabilityScore, icon: BarChart3 },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#8A8D98]" />
                        <span className="text-sm text-[#8A8D98]">{item.label}:</span>
                        <span className="font-mono-data font-bold">{item.value}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Report Sections */}
            <div className="space-y-4 mb-8">
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

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setReport('')}
                className="flex items-center gap-2 px-6 py-3 glass-card-hover rounded-xl transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Regenerate Report
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-6 py-3 glass-card-hover rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
          </>
        )}

        {/* Stats Overview (always visible) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="glass-card p-4 text-center">
            <Thermometer className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="font-mono-data text-xl font-bold">{scores.temperatureScore}</p>
            <p className="text-xs text-[#8A8D98]">Temperature</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Droplets className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
            <p className="font-mono-data text-xl font-bold">{scores.waterSecurityScore}</p>
            <p className="text-xs text-[#8A8D98]">Water Security</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Leaf className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="font-mono-data text-xl font-bold">{scores.vegetationHealth}</p>
            <p className="text-xs text-[#8A8D98]">Vegetation</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Wind className="w-5 h-5 text-blue-400 mx-auto mb-2" />
            <p className="font-mono-data text-xl font-bold">{scores.airQuality}</p>
            <p className="text-xs text-[#8A8D98]">Air Quality</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
