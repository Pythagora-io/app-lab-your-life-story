import OpenAI from 'openai';
import UserService from './userService.js';

class OpenAIService {
  static async generateStory(userId, imageSummaries) {
    try {
      const user = await UserService.get(userId);
      if (!user || !user.dalleApiKey) {
        throw new Error('OpenAI API key not found for user');
      }

      const openai = new OpenAI({ apiKey: user.dalleApiKey });

      const prompt = `Based on the following image summaries, create a compelling and engaging short story:\n\n${imageSummaries.join('\n\n')}`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating story with OpenAI:', error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Invalid or expired API key');
          case 429:
            throw new Error('API rate limit exceeded');
          default:
            throw new Error('An error occurred while generating the story');
        }
      }
      throw error;
    }
  }

  static async improveStory(userId, generatedStory, imageSummaries, instruction) {
    try {
      const user = await UserService.get(userId);
      if (!user || !user.dalleApiKey) {
        throw new Error('OpenAI API key not found for user');
      }

      const openai = new OpenAI({ apiKey: user.dalleApiKey });

      const prompt = `
        Original story:
        ${generatedStory}

        Image summaries:
        ${imageSummaries.join('\n')}

        Instruction:
        ${instruction}

        Please improve the story based on the given instruction while considering the image summaries.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.7,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error improving story with OpenAI:', error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Invalid or expired API key');
          case 429:
            throw new Error('API rate limit exceeded');
          default:
            throw new Error('An error occurred while improving the story');
        }
      }
      throw error;
    }
  }
}

export default OpenAIService;