'use server';

/**
 * @fileOverview A content optimization AI agent.
 *
 * - optimizeContent - A function that handles the content optimization process.
 * - OptimizeContentInput - The input type for the optimizeContent function.
 * - OptimizeContentOutput - The return type for the optimizeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeContentInputSchema = z.object({
  contentBlock: z
    .string()
    .describe('The content block to be optimized, as a string of HTML.'),
  targetAudience: z.string().describe('The target audience for the content.'),
  websiteType: z.string().describe('The type of website (e.g., blog, news, e-commerce).'),
});
export type OptimizeContentInput = z.infer<typeof OptimizeContentInputSchema>;

const OptimizeContentOutputSchema = z.object({
  optimizedContent: z
    .string()
    .describe('The optimized content block, with layout suggestions, as a string of HTML.'),
  explanation: z
    .string()
    .describe('An explanation of the changes made and the reasoning behind them.'),
});
export type OptimizeContentOutput = z.infer<typeof OptimizeContentOutputSchema>;

export async function optimizeContent(input: OptimizeContentInput): Promise<OptimizeContentOutput> {
  return optimizeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeContentPrompt',
  input: {schema: OptimizeContentInputSchema},
  output: {schema: OptimizeContentOutputSchema},
  prompt: `You are an expert in content optimization and layout design.
  Given a content block, target audience, and website type, you will optimize the content block for maximum engagement.
  Provide layout suggestions to improve user experience, readability, and overall effectiveness.

  Content Block: {{{contentBlock}}}
  Target Audience: {{{targetAudience}}}
  Website Type: {{{websiteType}}}

  Consider these example websites:
  Lifehacker Product, tech, lifestyle hacks Practical tips, “how-to” guides, clever everyday hacks People who like actionable advice and improvements lifehacker.com
  Medium Essays, ideas, stories Huge variety of user-written articles — self-improvement, tech, culture, personal stories Readers who enjoy thoughtful, personal, or reflective writing medium.com
  Longreads Long-form journalism, essays In-depth stories and narrative pieces, curated from across the web Readers who like immersive, detailed articles longreads.com
  Reader’s Digest Lifestyle, humor, inspiration Short, uplifting reads, jokes, lists, life lessons Those who prefer lighter or positive reads rd.com
  Quora (Spaces) General knowledge, ideas Community-written pieces on any topic — life, work, relationships People who enjoy informal, varied perspectives quora.com
  BuzzFeed Pop culture, trends, quizzes Fun, visual, easily shareable stories about everyday life & entertainment Casual readers who like trending, humorous content buzzfeed.com
  Thought Catalog Personal essays, culture Emotionally raw, creative writing from independent authors People interested in reflective or relatable stories thoughtcatalog.com
  Pocket (Discover) Curated reading list Handpicked articles on any topic, from multiple publishers Readers who like exploring quality writing from various sources getpocket.com/explore
  Vox (Explainers) Culture, science, society (non-breaking news) “Explainer” style content that helps you understand topics deeply Curious minds who want clarity, not just headlines vox.com
  The Conversation Expert opinion & analysis Articles written by academics and researchers for the public Readers who prefer credible, well-sourced perspectives theconversation.com
  Output the optimized content and explanation in HTML format.
  `,
});

const optimizeContentFlow = ai.defineFlow(
  {
    name: 'optimizeContentFlow',
    inputSchema: OptimizeContentInputSchema,
    outputSchema: OptimizeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
