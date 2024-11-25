import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import UserService from './userService.js';

class DalleService {
  static async analyzeImage(userId, imagePath) {
    try {
      const user = await UserService.get(userId);
      if (!user || !user.dalleApiKey) {
        throw new Error('DALL-E API key not found for user');
      }

      const openai = new OpenAI({ apiKey: user.dalleApiKey });

      // Read the image file and convert to base64
      const imageBuffer = fs.readFileSync(path.join(process.cwd(), imagePath));
      const base64Image = imageBuffer.toString('base64');

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "What's in this image? Provide a brief summary." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
            ],
          },
        ],
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error analyzing image with DALL-E:', error);
      throw error;
    }
  }
}

export default DalleService;