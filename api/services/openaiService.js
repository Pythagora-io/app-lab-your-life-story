import OpenAI from 'openai';
import UserService from './userService.js';
import fs from 'fs';
import path from 'path';

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

  static async convertTextToSpeech(userId, text) {
    try {
      const user = await UserService.get(userId);
      if (!user || !user.dalleApiKey) {
        throw new Error('OpenAI API key not found for user');
      }

      const openai = new OpenAI({ apiKey: user.dalleApiKey });

      const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: text,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      const outputDir = path.join(process.cwd(), 'uploads', 'audio');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      const outputPath = path.join(outputDir, `${Date.now()}.mp3`);
      fs.writeFileSync(outputPath, buffer);

      return outputPath.replace(/^.*[\\\/]/, 'uploads/audio/');
    } catch (error) {
      console.error('Error converting text to speech with OpenAI:', error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            throw new Error('Invalid or expired API key');
          case 429:
            throw new Error('API rate limit exceeded');
          default:
            throw new Error('An error occurred while converting text to speech');
        }
      }
      throw error;
    }
  }
}

export default OpenAIService;