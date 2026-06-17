import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '@/context/AppContext'
import { trpc } from '@/providers/trpc'
import { Layout } from '@/components/Layout'
import {
  BarChart3,
  Users,
  Thermometer,
  Building2,
  Droplets,
  TreePine,
  Play,
  ArrowRight,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const scenarios = [
  {
    id: 'population_growth',
    label: 'Population Growth',
    description: 'Simulate effects of rapid population increase on resources and infrastructure',
    icon: Users,
    color: '#3B82F6',
  },
  {
    id: 'heatwave_increase',
    label: 'Heatwave Increase',
    description: 'Model the impact of more frequent and intense heatwave events',
    icon: Thermometer,
    color: '#F59E0B',
  },
  {
    id: 'urban_expansion',
    label: 'Urban Expansion',
    description: 'Explore consequences of rapid urbanization and land use change',
    icon: Building2,
    color: '#8B5CF6',
  },
  {
    id: 'water_scarcity',
    label: 'Water Scarcity',
    description: 'Simulate the effects of declining water availability',
    icon: Droplets,
    color: '#06B6D4',
  },
  {
    id: 'deforestation',
    label: 'Deforestation',
    description: 'Model impacts of significant forest and green space loss',
    icon: TreePine,
    color: '#10B981',
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

export default function SandboxPage() {
  const navigate = useNavigate()
  const { state, addSimulation } = useApp()
  const { selectedCity, scores, sessionId } = state

  const [selectedScenario, setSelectedScenario] = useState(scenarios[0].id)
  const [intensity, setIntensity] = useState([50])
  const [result, setResult] = useState<{
    afterScores: Record<string, number>
    impactSummary: string
  } | null>(null)

  const simulateMutation = trpc.simulation.create.useMutation({
    onSuccess: (data) => {
      setResult(data)
      addSimulation({
        scenarioType: selectedScenario,
        intensity: intensity[0],
        beforeScores: { ...scores },
        afterScores: data.afterScores as unknown as typeof scores,
        impactSummary: data.impactSummary,
      })
    },
  })

  const handleSimulate = () => {
    if (!sessionId) return
    simulateMutation.mutate({
      sessionId,
      scenarioType: selectedScenario,
      intensity: intensity[0],
      beforeScores: scores as unknown as Record<string, number>,
    })
  }

  const handleReset = () => {
    setResult(null)
    setIntensity([50])
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

  const comparisonData = result
    ? Object.entries(scoreLabels).map(([key, label]) => ({
        metric: label,
        before: scores[key as keyof typeof scores] ?? 0,
        after: (result.afterScores[key] as number) ?? 0,
      }))
    : []

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-[#8A8D98] uppercase tracking-wider">
              Future Sandbox
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Scenario Simulation</h1>
          <p className="text-[#8A8D98]">
            Explore what happens if we change the future for {selectedCity.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scenario Selection */}
          <div className="space-y-4">
            <h2 className="font-semibold">Select Scenario</h2>
            {scenarios.map((scenario) => {
              const Icon = scenario.icon
              const isSelected = selectedScenario === scenario.id
              return (
                <button
                  key={scenario.id}
                  onClick={() => {
                    setSelectedScenario(scenario.id)
                    setResult(null)
                  }}
                  className={`w-full glass-card p-4 text-left transition-all ${
                    isSelected
                      ? 'border-blue-500/50 bg-blue-500/5'
                      : 'glass-card-hover'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${scenario.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: scenario.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{scenario.label}</h3>
                      <p className="text-sm text-[#8A8D98]">{scenario.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Controls & Results */}
          <div className="space-y-6">
            {/* Intensity Slider */}
            <div className="glass-card p-6">
              <h2 className="font-semibold mb-4">Simulation Intensity</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-[#8A8D98]">Low Impact</span>
                  <span className="text-sm font-mono-data font-bold">{intensity[0]}%</span>
                  <span className="text-sm text-[#8A8D98]">High Impact</span>
                </div>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSimulate}
                  disabled={simulateMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-xl font-semibold transition-all"
                >
                  {simulateMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  Run Simulation
                </button>
                {result && (
                  <button
                    onClick={handleReset}
                    className="p-3 glass-card-hover rounded-xl transition-all"
                    title="Reset"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Results */}
            {result && (
              <>
                {/* Impact Summary */}
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Impact Summary
                  </h3>
                  <p className="text-[#8A8D98] text-sm leading-relaxed">
                    {result.impactSummary}
                  </p>
                </div>

                {/* Before/After Comparison Chart */}
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4">Before vs After Comparison</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="metric" tick={{ fill: '#8A8D98', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#8A8D98', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1E2028',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="before" fill="#3B82F6" fillOpacity={0.5} name="Before" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="after" fill="#F59E0B" fillOpacity={0.8} name="After" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Score Changes */}
                <div className="glass-card p-6">
                  <h3 className="font-semibold mb-4">Score Changes</h3>
                  <div className="space-y-3">
                    {comparisonData.map((item) => {
                      const diff = item.after - item.before
                      const isPositive = diff > 0
                      return (
                        <div
                          key={item.metric}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                        >
                          <span className="text-sm">{item.metric}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-mono-data text-sm text-[#8A8D98]">
                              {item.before}
                            </span>
                            <ArrowRight className="w-3 h-3 text-[#8A8D98]" />
                            <span className="font-mono-data text-sm font-bold">
                              {item.after}
                            </span>
                            <div
                              className={`flex items-center gap-1 text-xs ${
                                isPositive ? 'text-emerald-400' : 'text-red-400'
                              }`}
                            >
                              {isPositive ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {diff > 0 ? '+' : ''}
                              {diff}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <button
            onClick={() => navigate('/intervention')}
            className="flex items-center gap-2 px-6 py-3 glass-card-hover rounded-xl transition-all"
          >
            Test Interventions
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center gap-2 px-6 py-3 glass-card-hover rounded-xl transition-all"
          >
            AI Chat
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Layout>
  )
}
