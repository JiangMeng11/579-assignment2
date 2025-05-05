// Converted from leader_focused_tone_adjuster-HlB6IZWz36vpnjXa9eMf3gngKBtYsy.py
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function adjustTone(items: string[]): Promise<string[]> {
  const adjustedItems: string[] = []

  for (const item of items) {
    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: createPrompt(item),
        temperature: 0.3,
        maxTokens: 200,
      })

      adjustedItems.push(text.trim())
    } catch (error) {
      console.error("Error adjusting tone:", error)
      // Fall back to original text if tone adjustment fails
      adjustedItems.push(item)
    }
  }

  return adjustedItems
}

function createPrompt(rawText: string): string {
  return `
    You are ERIN, an expert business communication AI assistant.
    Your job is to rewrite messy, technical, or casual team updates into clean, executive-friendly, action-focused language.
    No jargon, no unnecessary technical detail unless critical.
    Prioritize business outcomes, clarity, urgency, and professionalism. Tone is serious but human.

    Rewrite the following messy internal update into a crisp, executive-friendly bullet point.

    Input:
    ${rawText}

    Rules:
    - 1-2 short sentences max
    - Executive tone
    - Focus on outcomes or urgent risks
    - No technical jargon unless essential
    - Keep the original prefix (e.g., "Biggest Blocker:", "Top Risk:", etc.)
  `
}
