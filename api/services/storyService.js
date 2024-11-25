import { Story } from '../models/init.js';
import DalleService from './dalleService.js';

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
}

export default StoryService;