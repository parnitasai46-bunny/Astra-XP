import { useNavigate } from 'react-router'
import { useApp } from '@/context/AppContext'
import { Layout } from '@/components/Layout'
import {
  Thermometer,
  Droplets,
  Leaf,
  Wind,
  AlertTriangle,
  BarChart3,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts'

const scoreCards = [
  {
    key: 'temperatureScore' as const,
    label: 'Temperature',
    icon: Thermometer,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    glow: 'glow-amber',
  },
  {
    key: 'waterSecurityScore' as const,
    label: 'Water Security',
    icon: Droplets,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    glow: 'glow-blue',
  },
  {
    key: 'vegetationHealth' as const,
    label: 'Vegetation Health',
    icon: Leaf,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    glow: 'glow-green',
  },
  {
    key: 'airQuality' as const,
    label: 'Air Quality',
    icon: Wind,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    glow: 'glow-blue',
  },
  {
    key: 'climateRiskScore' as const,
    label: 'Climate Risk',
    icon: AlertTriangle,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    glow: 'glow-red',
  },
  {
    key: 'sustainabilityScore' as const,
    label: 'Sustainability',
    icon: BarChart3,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    glow: '',
  },
]

// Mock historical data for charts
const generateHistoryData = (baseValue: number) => {
  return Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    value: Math.round(baseValue + (Math.random() - 0.5) * 20),
  }))
}

const generateTrendData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    temperature: Math.round(55 + Math.sin(i * 0.2) * 15 + Math.random() * 5),
    water: Math.round(60 + Math.cos(i * 0.15) * 20 + Math.random() * 5),
    vegetation: Math.round(50 + Math.sin(i * 0.1) * 25 + Math.random() * 3),
  }))
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { state } = useApp()
  const { selectedCity, scores } = state

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

  const radarData = scoreCards.map((card) => ({
    metric: card.label,
    score: scores[card.key] ?? 0,
    fullMark: 100,
  }))

  const tempHistory = generateHistoryData(scores.temperatureScore)
  const trendData = generateTrendData()

  const getScoreStatus = (score: number) => {
    if (score >= 70) return { label: 'Good', color: 'text-emerald-400', icon: TrendingUp }
    if (score >= 50) return { label: 'Moderate', color: 'text-amber-400', icon: TrendingUp }
    return { label: 'Critical', color: 'text-red-400', icon: TrendingDown }
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-[#8A8D98] uppercase tracking-wider">
              Digital Twin Dashboard
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {selectedCity.name}, {selectedCity.country}
          </h1>
          <p className="text-[#8A8D98]">
            Real-time environmental monitoring and analysis
          </p>
        </div>

        {/* Score Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {scoreCards.map((card) => {
            const Icon = card.icon
            const score = scores[card.key] ?? 0
            const status = getScoreStatus(score)
            const StatusIcon = status.icon
            return (
              <div
                key={card.key}
                className={`glass-card p-4 ${score < 50 ? card.glow : ''}`}
              >
                <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <p className="text-2xl font-bold font-mono-data">{score}</p>
                <p className="text-xs text-[#8A8D98] mb-1">{card.label}</p>
                <div className={`flex items-center gap-1 ${status.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  <span className="text-xs">{status.label}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Radar Chart */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-6">Environmental Profile</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: '#8A8D98', fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#8A8D98', fontSize: 10 }}
                />
                <Radar
                  name={selectedCity.name}
                  dataKey="score"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Temperature History */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-6">Temperature Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={tempHistory}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#8A8D98', fontSize: 12 }} />
                <YAxis tick={{ fill: '#8A8D98', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E2028',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#F59E0B"
                  fillOpacity={1}
                  fill="url(#tempGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Multi-metric Trend */}
        <div className="glass-card p-6 mb-8">
          <h3 className="font-semibold mb-6">30-Day Environmental Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#8A8D98', fontSize: 12 }} />
              <YAxis tick={{ fill: '#8A8D98', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E2028',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
                name="Temperature"
              />
              <Line
                type="monotone"
                dataKey="water"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                name="Water Security"
              />
              <Line
                type="monotone"
                dataKey="vegetation"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                name="Vegetation"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Environmental Summary */}
        <div className="glass-card p-6 mb-8">
          <h3 className="font-semibold mb-4">Environmental Summary</h3>
          <div className="space-y-3">
            {scoreCards.map((card) => {
              const score = scores[card.key] ?? 0
              const percentage = score
              return (
                <div key={card.key} className="flex items-center gap-4">
                  <div className="w-32 text-sm text-[#8A8D98]">{card.label}</div>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        score >= 70
                          ? 'bg-emerald-400'
                          : score >= 50
                          ? 'bg-amber-400'
                          : 'bg-red-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-right font-mono-data text-sm">{score}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Navigation CTA */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate('/analysis')}
            className="flex items-center gap-2 px-6 py-3 glass-card-hover rounded-xl transition-all"
          >
            <Activity className="w-4 h-4 text-blue-400" />
            AI Analysis
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/sandbox')}
            className="flex items-center gap-2 px-6 py-3 glass-card-hover rounded-xl transition-all"
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            Future Sandbox
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/intervention')}
            className="flex items-center gap-2 px-6 py-3 glass-card-hover rounded-xl transition-all"
          >
            <Leaf className="w-4 h-4 text-emerald-400" />
            Intervention Lab
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="flex items-center gap-2 px-6 py-3 glass-card-hover rounded-xl transition-all"
          >
            <Wind className="w-4 h-4 text-cyan-400" />
            AI Chat
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Layout>
  )
}
