import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface City {
  id: number
  name: string
  country: string
  lat: number
  lng: number
  population: number | null
  region: string | null
  climateZone: string | null
}

export interface Scores {
  temperatureScore: number
  waterSecurityScore: number
  vegetationHealth: number
  airQuality: number
  climateRiskScore: number
  sustainabilityScore: number
}

export interface Simulation {
  id?: number
  scenarioType: string
  intensity: number
  beforeScores: Scores
  afterScores: Scores
  impactSummary: string
}

export interface ChatMessage {
  id?: number
  role: 'user' | 'assistant'
  content: string
  createdAt?: Date
}

interface AppState {
  selectedCity: City | null
  sessionId: number | null
  scores: Scores
  simulations: Simulation[]
  chatMessages: ChatMessage[]
  currentSimulation: Simulation | null
}

interface AppContextType {
  state: AppState
  setSelectedCity: (city: City) => void
  setSessionId: (id: number) => void
  setScores: (scores: Scores) => void
  updateScores: (partial: Partial<Scores>) => void
  addSimulation: (sim: Simulation) => void
  addChatMessage: (msg: ChatMessage) => void
  setChatMessages: (msgs: ChatMessage[]) => void
  setCurrentSimulation: (sim: Simulation | null) => void
  reset: () => void
}

const defaultScores: Scores = {
  temperatureScore: 0,
  waterSecurityScore: 0,
  vegetationHealth: 0,
  airQuality: 0,
  climateRiskScore: 0,
  sustainabilityScore: 0,
}

const initialState: AppState = {
  selectedCity: null,
  sessionId: null,
  scores: { ...defaultScores },
  simulations: [],
  chatMessages: [],
  currentSimulation: null,
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState)

  const setSelectedCity = useCallback((city: City) => {
    setState(prev => ({ ...prev, selectedCity: city }))
  }, [])

  const setSessionId = useCallback((id: number) => {
    setState(prev => ({ ...prev, sessionId: id }))
  }, [])

  const setScores = useCallback((scores: Scores) => {
    setState(prev => ({ ...prev, scores }))
  }, [])

  const updateScores = useCallback((partial: Partial<Scores>) => {
    setState(prev => ({ ...prev, scores: { ...prev.scores, ...partial } }))
  }, [])

  const addSimulation = useCallback((sim: Simulation) => {
    setState(prev => ({ ...prev, simulations: [...prev.simulations, sim] }))
  }, [])

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setState(prev => ({ ...prev, chatMessages: [...prev.chatMessages, msg] }))
  }, [])

  const setChatMessages = useCallback((msgs: ChatMessage[]) => {
    setState(prev => ({ ...prev, chatMessages: msgs }))
  }, [])

  const setCurrentSimulation = useCallback((sim: Simulation | null) => {
    setState(prev => ({ ...prev, currentSimulation: sim }))
  }, [])

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  return (
    <AppContext.Provider value={{
      state,
      setSelectedCity,
      setSessionId,
      setScores,
      updateScores,
      addSimulation,
      addChatMessage,
      setChatMessages,
      setCurrentSimulation,
      reset,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
