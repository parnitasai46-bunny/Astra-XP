import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '@/context/AppContext'
import { trpc } from '@/providers/trpc'
import { Layout } from '@/components/Layout'
import {
  Search,
  MapPin,
  ArrowRight,
  Globe,
  Thermometer,
  Droplets,
  Wind,
} from 'lucide-react'
import { Input } from '@/components/ui/input'

// Popular cities for quick selection
const popularCities = [
  { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.006 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
]

export default function LocationPage() {
  const navigate = useNavigate()
  const { setSelectedCity, setSessionId, setScores } = useApp()
  const [searchQuery, setSearchQuery] = useState('')

  const { data: cities } = trpc.city.list.useQuery()
  const { data: searchResults } = trpc.city.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  )

  const createSession = trpc.session.create.useMutation({
    onSuccess: (data) => {
      setSessionId(data.id)
      setScores({
        temperatureScore: data.temperatureScore ?? 0,
        waterSecurityScore: data.waterSecurityScore ?? 0,
        vegetationHealth: data.vegetationHealth ?? 0,
        airQuality: data.airQuality ?? 0,
        climateRiskScore: data.climateRiskScore ?? 0,
        sustainabilityScore: data.sustainabilityScore ?? 0,
      })
      navigate('/dashboard')
    },
  })

  const handleSelectCity = (city: { name: string; country: string; lat: number; lng: number; id?: number }) => {
    const cityData = {
      id: city.id ?? 0,
      name: city.name,
      country: city.country,
      lat: city.lat,
      lng: city.lng,
      population: null,
      region: null,
      climateZone: null,
    }
    setSelectedCity(cityData)
    createSession.mutate({ cityId: city.id ?? 0 })
  }

  const displayedCities = searchQuery.length > 0
    ? (searchResults ?? [])
    : (cities ?? [])

  return (
    <Layout showNav={false}>
      <div className="min-h-screen flex flex-col items-center px-6 py-12">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-[#8A8D98]">Step 1 of 7</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Select a Location</h1>
            <p className="text-[#8A8D98] text-lg">
              Choose a city to generate its Earth Digital Twin
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-8 max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A8D98]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city..."
              className="pl-12 h-14 bg-[#111318]/80 border-white/10 rounded-xl text-lg placeholder:text-[#8A8D98]/50"
            />
          </div>

          {/* Popular Cities */}
          {searchQuery.length === 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-medium text-[#8A8D98] uppercase tracking-wider mb-4">
                Popular Cities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {popularCities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => {
                      const dbCity = cities?.find(c => c.name === city.name)
                      if (dbCity) {
                        handleSelectCity(dbCity)
                      } else {
                        handleSelectCity(city)
                      }
                    }}
                    className="group glass-card-hover p-4 text-left transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <ArrowRight className="w-4 h-4 text-[#8A8D98] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="font-semibold">{city.name}</h3>
                    <p className="text-sm text-[#8A8D98]">{city.country}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchQuery.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-medium text-[#8A8D98] uppercase tracking-wider mb-4">
                Search Results ({displayedCities.length})
              </h2>
              {displayedCities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedCities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => handleSelectCity(city)}
                      className="group glass-card-hover p-4 text-left flex items-center gap-4 transition-all"
                    >
                      <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{city.name}</h3>
                        <p className="text-sm text-[#8A8D98]">{city.country}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#8A8D98] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 glass-card">
                  <Search className="w-12 h-12 text-[#8A8D98] mx-auto mb-4" />
                  <p className="text-[#8A8D98]">No cities found. Try a different search.</p>
                </div>
              )}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 text-center">
              <Globe className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="font-mono-data text-2xl font-bold">20+</p>
              <p className="text-xs text-[#8A8D98]">Cities Available</p>
            </div>
            <div className="glass-card p-4 text-center">
              <Thermometer className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="font-mono-data text-2xl font-bold">5</p>
              <p className="text-xs text-[#8A8D98]">Climate Scenarios</p>
            </div>
            <div className="glass-card p-4 text-center">
              <Droplets className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <p className="font-mono-data text-2xl font-bold">5</p>
              <p className="text-xs text-[#8A8D98]">Interventions</p>
            </div>
            <div className="glass-card p-4 text-center">
              <Wind className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="font-mono-data text-2xl font-bold">6</p>
              <p className="text-xs text-[#8A8D98]">Environment Metrics</p>
            </div>
          </div>

          {/* Loading state */}
          {createSession.isPending && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="glass-card p-8 text-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-semibold">Generating Digital Twin...</p>
                <p className="text-sm text-[#8A8D98] mt-2">Analyzing environmental data</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
