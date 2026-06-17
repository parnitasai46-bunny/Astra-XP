import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '@/context/AppContext'
import { trpc } from '@/providers/trpc'
import { Layout } from '@/components/Layout'
import {
  Leaf,
  TreePine,
  Droplets,
  Building2,
  Zap,
  Waves,
  Check,
  ArrowRight,
  RotateCcw,
  TrendingUp,
  Loader2,
  Sparkles,
} from 'lucide-react'
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'

const interventions = [
  {
    id: 'plant_trees',
    label: 'Plant Trees',
    description: 'Urban tree planting program to increase canopy coverage',
    icon: TreePine,
    color: '#10B981',
    effects: { temperatureScore: 8, waterSecurityScore: 3, vegetationHealth: 15, airQuality: 12, climateRiskScore: -8 },
  },
  {
    id: 'rainwater_harvesting',
    label: 'Rainwater Harvesting',
    description: 'Collect and store rainwater for municipal use',
    icon: Droplets,
    color: '#06B6D4',
    effects: { temperatureScore: 2, waterSecurityScore: 15, vegetationHealth: 5, airQuality: 2, climateRiskScore: -5 },
  },
  {
    id: 'green_infrastructure',
    label: 'Green Infrastructure',
    description: 'Green roofs, walls, and permeable surfaces',
    icon: Building2,
    color: '#8B5CF6',
    effects: { temperatureScore: 10, waterSecurityScore: 8, vegetationHealth: 10, airQuality: 10, climateRiskScore: -10 },
  },
  {
    id: 'renewable_energy',
    label: 'Renewable Energy',
    description: 'Transition to solar, wind, and clean energy sources',
    icon: Zap,
    color: '#F59E0B',
    effects: { temperatureScore: 12, waterSecurityScore: 5, vegetationHealth: 8, airQuality: 18, climateRiskScore: -15 },
  },
  {
    id: 'water_conservation',
    label: 'Water Conservation',
    description: 'Efficient water use and recycling programs',
    icon: Waves,
    color: '#3B82F6',
    effects: { temperatureScore: 3, waterSecurityScore: 18, vegetationHealth: 5, airQuality: 5, climateRiskScore: -8 },
  },
]

const scoreLabels: Record<string, string> = {
  temperatureScore: 'Temperature',
  waterSecurityScore: 'Water',
  vegetationHealth: 'Vegetation',
  airQuality: 'Air Quality',
  climateRiskScore: 'Climate Risk',
  sustainabilityScore: 'Sustainability',
}

export default function InterventionPage() {
  const navigate = useNavigate()
  const { state, updateScores } = useApp()
  const { selectedCity, scores, sessionId } = state

  const [selected, setSelected] = useState<string[]>([])
  const [result, setResult] = useState<{
    afterScores: Record<string, number>
    impactSummary: string
    interventions: string[]
  } | null>(null)

  const interveneMutation = trpc.simulation.createIntervention.useMutation({
    onSuccess: (data) => {
      setResult(data)
    },
  })

  const toggleIntervention = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
    setResult(null)
  }

  const handleRun = () => {
    if (!sessionId || selected.length === 0) return
    interveneMutation.mutate({
      sessionId,
      interventions: selected,
      currentScores: scores as unknown as Record<string, number>,
    })
  }

  const handleReset = () => {
    setSelected([])
    setResult(null)
  }

  const handleApply = () => {
    if (!result) return
    const newScores = result.afterScores
    updateScores({
      temperatureScore: newScores.temperatureScore ?? scores.temperatureScore,
      waterSecurityScore: newScores.waterSecurityScore ?? scores.waterSecurityScore,
      vegetationHealth: newScores.vegetationHealth ?? scores.vegetationHealth,
      airQuality: newScores.airQuality ?? scores.airQuality,
      climateRiskScore: newScores.climateRiskScore ?? scores.climateRiskScore,
      sustainabilityScore: newScores.sustainabilityScore ?? scores.sustainabilityScore,
    })
    navigate('/dashboard')
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

  const beforeData = Object.entries(scoreLabels).map(([key, label]) => ({
    metric: label,
    before: scores[key as keyof typeof scores] ?? 0,
    after: result ? (result.afterScores[key] as number ?? 0) : scores[key as keyof typeof scores] ?? 0,
  }))

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-[#8A8D98] uppercase tracking-wider">
              Intervention Lab
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Test Solutions</h1>
          <p className="text-[#8A8D98]">
            Combine interventions and see their impact on {selectedCity.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Intervention Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Available Interventions</h2>
              <span className="text-sm text-[#8A8D98]">
                {selected.length} selected
              </span>
            </div>
            {interventions.map((intervention) => {
              const Icon = intervention.icon
              const isSelected = selected.includes(intervention.id)
              return (
                <button
                  key={intervention.id}
                  onClick={() => toggleIntervention(intervention.id)}
                  className={`w-full glass-card p-4 text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'glass-card-hover'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${intervention.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: intervention.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{intervention.label}</h3>
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-[#8A8D98]">{intervention.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}

            <div className="flex gap-3">
              <button
                onClick={handleRun}
                disabled={selected.length === 0 || interveneMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-semibold transition-all"
              >
                {interveneMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                Calculate Impact
              </button>
              <button
                onClick={handleReset}
                className="p-3 glass-card-hover rounded-xl transition-all"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Radar Comparison */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Before vs After</h3>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={beforeData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis tick={{ fill: '#8A8D98', fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#8A8D98', fontSize: 10 }} />
                  <Radar
                    name="Before"
                    dataKey="before"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Radar
                    name="After"
                    dataKey="after"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-[#8A8D98]">Before</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-[#8A8D98]">After</span>
                </div>
              </div>
            </div>

            {result && (
              <>
                {/* Impact Summary */}
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-3">Impact Summary</h3>
                  <p className="text-[#8A8D98] text-sm leading-relaxed mb-4">
                    {result.impactSummary}
                  </p>
                  <div className="space-y-2">
                    {beforeData.map((item) => {
                      const diff = item.after - item.before
                      if (diff === 0) return null
                      const isPositive = diff > 0
                      return (
                        <div
                          key={item.metric}
                          className="flex items-center justify-between p-2 rounded bg-white/5"
                        >
                          <span className="text-sm">{item.metric}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono-data text-sm text-[#8A8D98]">
                              {item.before}
                            </span>
                            <ArrowRight className="w-3 h-3 text-[#8A8D98]" />
                            <span className="font-mono-data text-sm font-bold">
                              {item.after}
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                isPositive ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              {isPositive ? '+' : ''}
                              {diff}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Sustainability Score */}
                <div className="glass-card p-6 text-center">
                  <h3 className="font-semibold mb-4">Sustainability Score</h3>
                  <div className="flex items-center justify-center gap-8">
                    <div>
                      <p className="text-sm text-[#8A8D98] mb-1">Before</p>
                      <p className="text-3xl font-mono-data font-bold text-blue-400">
                        {scores.sustainabilityScore}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-emerald-400" />
                    <div>
                      <p className="text-sm text-[#8A8D98] mb-1">After</p>
                      <p className="text-3xl font-mono-data font-bold text-emerald-400">
                        {result.afterScores.sustainabilityScore ?? scores.sustainabilityScore}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleApply}
                    className="mt-6 flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all mx-auto"
                  >
                    <Check className="w-5 h-5" />
                    Apply Changes
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center gap-2 px-6 py-3 glass-card-hover rounded-xl transition-all"
          >
            AI Chat
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/report')}
            className="flex items-center gap-2 px-6 py-3 glass-card-hover rounded-xl transition-all"
          >
            Generate Report
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Layout>
  )
}
