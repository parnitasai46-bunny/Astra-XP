import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useApp } from '@/context/AppContext'
import { trpc } from '@/providers/trpc'
import { Layout } from '@/components/Layout'
import {
  MessageCircle,
  Send,
  Bot,
  User,
  ArrowRight,
  Loader2,
  Globe,
  Factory,
  TreePine,
  Droplets,
  Sun,
  Zap,
} from 'lucide-react'
import { Input } from '@/components/ui/input'


const quickPrompts = [
  {
    icon: Factory,
    label: 'Build Factories',
    prompt: 'What happens if we build more factories in this city?',
  },
  {
    icon: TreePine,
    label: 'Add Green Zones',
    prompt: 'What would be the impact of adding more green zones and parks?',
  },
  {
    icon: Droplets,
    label: 'Water Policy',
    prompt: 'How would stricter water conservation policies affect the city?',
  },
  {
    icon: Sun,
    label: 'Solar Initiative',
    prompt: 'What if the city switched to 80% renewable energy?',
  },
  {
    icon: Zap,
    label: 'Public Transit',
    prompt: 'What would be the environmental impact of expanding public transit?',
  },
  {
    icon: Globe,
    label: 'Carbon Tax',
    prompt: 'How would a carbon tax affect local businesses and emissions?',
  },
]

export default function ChatPage() {
  const navigate = useNavigate()
  const { state, addChatMessage } = useApp()
  const { selectedCity, sessionId, chatMessages } = state
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const chatMutation = trpc.ai.chat.useMutation({
    onSuccess: (data) => {
      addChatMessage({
        role: 'assistant',
        content: data.response,
      })
    },
  })

  const handleSend = (message: string) => {
    if (!sessionId || !message.trim()) return
    addChatMessage({ role: 'user', content: message.trim() })
    chatMutation.mutate({
      message: message.trim(),
      sessionId,
      context: selectedCity
        ? `We are analyzing environmental conditions for ${selectedCity.name}, ${selectedCity.country}. Temperature Score: ${state.scores.temperatureScore}, Water Security: ${state.scores.waterSecurityScore}, Vegetation Health: ${state.scores.vegetationHealth}, Air Quality: ${state.scores.airQuality}, Climate Risk: ${state.scores.climateRiskScore}`
        : undefined,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    handleSend(input)
    setInput('')
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages])

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

  return (
    <Layout>
      <div className="h-[calc(100vh-3.5rem)] flex flex-col max-w-4xl mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-[#8A8D98] uppercase tracking-wider">
              Earth Negotiation Simulator
            </span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Chat with the Digital Twin</h1>
          <p className="text-[#8A8D98] text-sm">
            Negotiate with Earth and explore the consequences of different decisions for{' '}
            {selectedCity.name}
          </p>
        </div>

        {/* Chat Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          {chatMessages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Welcome to the Earth Negotiation Simulator
              </h2>
              <p className="text-[#8A8D98] mb-8 max-w-lg mx-auto">
                I am the Digital Twin of {selectedCity.name}. Ask me about the consequences 
                of different decisions, or choose a quick prompt below to get started.
              </p>

              {/* Quick Prompts Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
                {quickPrompts.map((prompt) => {
                  const Icon = prompt.icon
                  return (
                    <button
                      key={prompt.label}
                      onClick={() => handleSend(prompt.prompt)}
                      className="glass-card-hover p-4 text-left transition-all"
                    >
                      <Icon className="w-5 h-5 text-blue-400 mb-2" />
                      <p className="text-sm font-medium">{prompt.label}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-blue-500/20'
                    : 'bg-cyan-500/20'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-blue-400" />
                ) : (
                  <Bot className="w-4 h-4 text-cyan-400" />
                )}
              </div>
              <div
                className={`max-w-[80%] p-4 rounded-xl ${
                  msg.role === 'user'
                    ? 'bg-blue-500/20 text-[#F4F4F4]'
                    : 'glass-card text-[#E0E0E0]'
                }`}
              >
                <div className="text-sm whitespace-pre-line leading-relaxed">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {chatMutation.isPending && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 text-[#8A8D98]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/5">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the Digital Twin about environmental decisions..."
              className="flex-1 h-12 bg-[#111318]/80 border-white/10 rounded-xl placeholder:text-[#8A8D98]/50"
            />
            <button
              type="submit"
              disabled={!input.trim() || chatMutation.isPending}
              className="h-12 px-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-xl transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Bottom Navigation */}
        <div className="px-4 pb-4 flex justify-center">
          <button
            onClick={() => navigate('/report')}
            className="flex items-center gap-2 px-6 py-2 text-sm text-[#8A8D98] hover:text-white transition-colors"
          >
            Generate Report
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Layout>
  )
}
