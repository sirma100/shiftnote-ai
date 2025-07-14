import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const formatShiftNote = async (
  rawInput: string,
  templatePrompt: string,
  clientName?: string
): Promise<string> => {
  try {
    const systemPrompt = `You are an AI assistant specialized in formatting shift notes for Australian support workers in NDIS, aged care, SIL, and SDA services. Your task is to transform raw, informal shift notes into professional, structured documentation that meets industry standards.

${templatePrompt}

Key Guidelines:
- Use professional, respectful language
- Be person-centered and dignified
- Only include information that was provided
- Don't make assumptions or add information not in the original notes
- Use Australian terminology and spelling
- If client name is provided, use it respectfully throughout
- Maintain confidentiality and privacy standards
- Focus on facts, not interpretations
- Use present tense for activities and past tense for completed actions

${clientName ? `The participant/client's name is: ${clientName}` : 'Use generic terms like "participant", "client", or "resident" as appropriate.'}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Please format these shift notes:\n\n${rawInput}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const formattedNote = response.choices[0]?.message?.content;
    if (!formattedNote) {
      throw new Error('No response from OpenAI');
    }

    return formattedNote;
  } catch (error) {
    console.error('OpenAI formatting error:', error);
    throw new Error('Failed to format shift note. Please try again.');
  }
};
