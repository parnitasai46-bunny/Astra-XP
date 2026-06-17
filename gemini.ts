// Gemini API integration for ASTRA-X
// Falls back to simulated responses if API key is not available

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

export async function generateAIResponse(
  prompt: string,
  _context?: string
): Promise<string> {
  // If no API key, return simulated responses for MVP
  if (!GEMINI_API_KEY) {
    return generateSimulatedResponse(prompt);
  }

  try {
    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: _context
                    ? `${_context}\n\nUser query: ${prompt}`
                    : prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = (await response.json()) as GeminiResponse;
    return data.candidates[0]?.content?.parts[0]?.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return generateSimulatedResponse(prompt);
  }
}

function generateSimulatedResponse(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  // Earth Analysis responses
  if (lowerPrompt.includes("analyze") || lowerPrompt.includes("environmental")) {
    return `## Environmental Analysis

Based on the current data, here's what I'm seeing:

**Current Condition:** The city is experiencing moderate environmental stress. Temperature levels are slightly above historical averages, indicating early signs of urban heat island effects. Air quality remains acceptable but shows seasonal variations.

**Key Risks:**
- Rising temperatures could increase energy demand by 15-20% during summer months
- Water security shows vulnerability during extended dry periods
- Vegetation coverage is below optimal levels for urban cooling

**Community Implications:**
- Residents in low-income areas face higher exposure to heat stress
- Agricultural productivity in surrounding regions may decline
- Infrastructure stress on cooling systems during peak periods

**Future Concerns:**
Without intervention, the city could see a 2-3°C temperature increase by 2050, with corresponding impacts on public health, energy costs, and livability.`;
  }

  // Scenario simulation responses
  if (lowerPrompt.includes("simulation") || lowerPrompt.includes("scenario")) {
    return `## Scenario Impact Analysis

Running the simulation with current parameters...

**Results:**
- Temperature Impact: +1.8°C average increase
- Water Security: -12% availability during dry seasons
- Vegetation Health: -8% canopy coverage due to heat stress
- Air Quality Index: Moderate degradation (+15 points)
- Climate Risk Score: Elevated from 45 to 62

**Critical Thresholds:**
The simulation indicates that at current rates, the city will cross into "High Risk" category within 15-20 years. Key tipping points include sustained temperatures above 35°C for more than 30 days annually.

**Recommendations:**
Immediate intervention in green infrastructure and water management could reduce these impacts by 40-60%.`;
  }

  // Intervention responses
  if (lowerPrompt.includes("intervention") || lowerPrompt.includes("solution")) {
    return `## Intervention Impact Assessment

**Combined Interventions Analysis:**

The selected interventions show promising results:

1. **Tree Planting Program** - Estimated 2-3°C local cooling effect, improved air quality by 18%
2. **Rainwater Harvesting** - 25% reduction in municipal water stress
3. **Green Infrastructure** - Reduced urban heat island effect by 30%
4. **Renewable Energy** - 40% reduction in carbon footprint
5. **Water Conservation** - 15% improvement in water security score

**Combined Impact:**
- Overall sustainability score improved from 52 to 78
- Climate risk reduced from "High" to "Moderate"
- Projected temperature increase mitigated by 1.2°C
- Community resilience score up 35%

**Cost-Benefit:**
Every $1 invested in these interventions yields approximately $4.50 in avoided climate damages and health cost savings.`;
  }

  // Chat/negotiation responses
  if (lowerPrompt.includes("factory") || lowerPrompt.includes("build")) {
    return `## Impact Assessment: Industrial Expansion

If more factories are built:

**Economic Impact:**
- Job creation: +2,500 direct positions
- GDP contribution: +$180M annually
- Tax revenue: +$22M for infrastructure

**Environmental Impact:**
- Air quality index: -18 points (degradation)
- Water usage: +35% industrial consumption
- Carbon emissions: +12,000 tonnes CO2/year
- Local temperature: +0.8°C from heat generation
- Noise pollution increase in 5km radius

**Community Impact:**
- Property values: Mixed (industrial zone -8%, residential +3% from jobs)
- Health costs: +$4.2M annually in respiratory treatments
- Traffic congestion: +25% during shift changes

**Recommendation:** Consider green building standards and emission controls to offset 60% of the environmental impact while maintaining economic benefits.`;
  }

  if (lowerPrompt.includes("green") || lowerPrompt.includes("park")) {
    return `## Impact Assessment: Green Zone Expansion

Adding green zones:

**Environmental Benefits:**
- Local temperature reduction: -1.5°C
- Air quality improvement: +22 points
- Stormwater absorption: +35% capacity
- Carbon sequestration: 450 tonnes CO2/year
- Biodiversity habitat increase

**Community Benefits:**
- Property values: +12-18% within 1km radius
- Mental health improvements: Reduced stress levels
- Recreation space: 2.3 hectares per 1,000 residents
- Community cohesion: Increased social interaction

**Economic Impact:**
- Initial investment: $8.5M
- Annual maintenance: $420K
- Healthcare cost savings: $2.1M/year
- Tourism/recreation value: $1.8M/year
- ROI: Positive within 3.5 years

This is a highly recommended intervention with strong multi-dimensional benefits.`;
  }

  // Report generation
  if (lowerPrompt.includes("report") || lowerPrompt.includes("summary")) {
    return `## Sustainability Report Summary

### Current Conditions
The environmental baseline shows a city at a critical transition point. Current sustainability metrics indicate moderate stress across temperature, water, and air quality indicators.

### Future Risks
Without meaningful intervention, projections show escalating risks across all environmental dimensions by 2040-2050.

### Interventions Tested
Multiple scenarios were evaluated including urban greening, water management, renewable energy adoption, and conservation programs. Combined approaches showed the strongest positive impact.

### Best Outcome
The optimal scenario combines aggressive green infrastructure expansion with water conservation and renewable energy transition, achieving a 78% sustainability score.

### AI Recommendations
1. Prioritize urban tree canopy expansion (fastest ROI)
2. Implement district-level water harvesting systems
3. Transition municipal energy to 60% renewable by 2035
4. Create climate-resilient building codes
5. Establish community-based environmental monitoring`;
  }

  // Default response for general chat
  return `I am ASTRA, your Earth Digital Twin AI assistant. I can help you with:

- Analyzing environmental conditions for any city
- Running future scenario simulations
- Evaluating intervention strategies
- Generating sustainability reports
- Answering questions about climate and environmental science

What would you like to explore today?`;
}

export async function generateReport(
  cityName: string,
  scores: Record<string, number>,
): Promise<string> {
  const prompt = `Generate a comprehensive sustainability report for ${cityName} with the following environmental scores: ${JSON.stringify(scores)}. Include: current conditions, future risks, interventions tested, best outcome, sustainability score, and AI recommendations. Format as structured markdown.`;
  return generateAIResponse(prompt);
}

export async function analyzeEnvironment(
  cityName: string,
  scores: Record<string, number>
): Promise<string> {
  const prompt = `Analyze the environmental conditions for ${cityName} based on these scores: Temperature ${scores.temperature}/100, Water Security ${scores.water}/100, Vegetation Health ${scores.vegetation}/100, Air Quality ${scores.air}/100, Climate Risk ${scores.risk}/100. Explain current condition, key risks, community implications, and future concerns in language a student can understand. No technical jargon.`;
  return generateAIResponse(prompt);
}
