import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

export async function POST(req: Request) {
    try {
        const result = streamText({
            model: google('gemini-1.5-pro-latest'),
            system: "You are a helpful AI assistant that generates engaging and entertaining questions for a social media platform.",
            prompt: "Create a list pf three open-ended and engaging questions formatted as a single string. Each question should be seperated by '||'. These questions are for an anonymous social message platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themese that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?||'. Wnsure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.",
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error(error)
    }
}

