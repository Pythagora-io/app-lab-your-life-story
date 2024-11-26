import { Story } from '../models/init.js';
import DalleService from './dalleService.js';
import OpenAIService from './openaiService.js';

class StoryService {
  static async createStory(userId, title, imagePaths) {
    try {
      console.log('Creating story with image paths:', imagePaths);

      const relativeImagePaths = imagePaths.map(path => path.replace(/^.*?\/uploads\//, 'uploads/'));

      const imageSummaries = await Promise.all(
        relativeImagePaths.map(path => DalleService.analyzeImage(userId, path))
      );

      const story = new Story({
        userId,
        title,
        images: relativeImagePaths,
        imageSummaries,
        isImproved: false, // Added isImproved field with default false
      });
      await story.save();
      console.log('Story created successfully:', story);
      return story;
    } catch (error) {
      console.error('Error in createStory:', error);
      throw error;
    }
  }

  static async getUserStories(userId) {
    try {
      const stories = await Story.find({ userId }).sort({ createdAt: -1 });
      console.log(`Fetched stories for user ${userId}`);
      return stories;
    } catch (error) {
      console.error('Error in getUserStories:', error);
      throw error;
    }
  }

  static async deleteStory(storyId, userId) {
    try {
      const story = await Story.findOneAndDelete({ _id: storyId, userId });
      if (!story) {
        console.log(`Story not found or user not authorized to delete story with ID ${storyId}`);
        throw new Error('Story not found or user not authorized');
      }
      console.log(`Deleted story with ID ${storyId}`);
      return story;
    } catch (error) {
      console.error('Error in deleteStory:', error);
      throw error;
    }
  }

  static async getStoryById(storyId, userId) {
    try {
      const story = await Story.findOne({ _id: storyId, userId });
      if (!story) {
        console.log(`Story not found with ID ${storyId} for user ${userId}`);
        throw new Error('Story not found');
      }
      console.log(`Fetched story with ID ${storyId} for user ${userId}`);
      return story;
    } catch (error) {
      console.error('Error in getStoryById:', error);
      throw error;
    }
  }

  static async generateStory(storyId, userId) {
    try {
      const story = await Story.findOne({ _id: storyId, userId });
      if (!story) {
        throw new Error('Story not found');
      }

      const generatedStory = await OpenAIService.generateStory(userId, story.imageSummaries);

      story.generatedStory = generatedStory;
      await story.save();

      console.log(`Generated story for story ID ${storyId}`);
      return story;
    } catch (error) {
      console.error('Error in generateStory:', error);
      if (error.message === 'OpenAI API key not found for user') {
        throw new Error('DALL-E API key not set. Please set your API key in the profile page.');
      }
      throw error;
    }
  }

  static async improveStory(storyId, userId, instruction) {
    const story = await this.getStoryById(storyId, userId);
    if (!story) {
      throw new Error('Story not found');
    }

    const improvedStory = await OpenAIService.improveStory(userId, story.generatedStory, story.imageSummaries, instruction);

    story.generatedStory = improvedStory;
    story.isImproved = true; // Set the flag in the database
    await story.save();

    return improvedStory;
  }

  static async narrateStory(storyId, userId) {
    try {
      const story = await Story.findOne({ _id: storyId, userId: userId });
      if (!story) {
        throw new Error('Story not found');
      }

      if (!story.generatedStory) {
        throw new Error('Story text not generated yet');
      }

      if (story.isImproved || !story.audioPath) {
        const audioPath = await OpenAIService.convertTextToSpeech(userId, story.generatedStory);
        story.audioPath = audioPath;
        story.isImproved = false; // Reset the flag after generating new audio
        await story.save();
      }

      return story.audioPath;
    } catch (error) {
      console.error('Error narrating story:', error);
      throw error;
    }
  }
}

export default StoryService;