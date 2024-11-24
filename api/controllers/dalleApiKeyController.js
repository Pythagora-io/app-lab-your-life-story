import UserService from '../services/userService.js';
import OpenAI from 'openai';

export const storeDalleApiKey = async (req, res) => {
  console.log('Storing DALL-E API key for user:', req.user.id);
  try {
    const { dalleApiKey } = req.body;
    if (!dalleApiKey) {
      return res.status(400).json({ error: 'DALL-E API key is required' });
    }
    const updatedUser = await UserService.updateDalleApiKey(req.user.id, dalleApiKey);
    console.log('Updated user:', updatedUser);
    res.json({ message: 'DALL-E API key stored successfully', dalleApiKey: updatedUser.dalleApiKey });
  } catch (error) {
    console.error('Error storing DALL-E API key:', error);
    res.status(500).json({ error: 'Failed to store DALL-E API key' });
  }
};

export const retrieveDalleApiKey = async (req, res) => {
  console.log('Retrieving DALL-E API key for user:', req.user.id);
  try {
    const user = await UserService.get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ dalleApiKey: user.dalleApiKey });
  } catch (error) {
    console.error('Error retrieving DALL-E API key:', error);
    res.status(500).json({ error: 'Failed to retrieve DALL-E API key', details: error.message });
  }
};

export const verifyDalleApiKey = async (req, res) => {
  const { dalleApiKey } = req.body;

  if (!dalleApiKey) {
    return res.status(400).json({ error: 'DALL-E API key is required' });
  }

  const openai = new OpenAI({ apiKey: dalleApiKey });

  try {
    // Attempt to make a simple request to verify the API key
    await openai.models.list();
    res.json({ valid: true, message: 'DALL-E API key is valid' });
  } catch (error) {
    console.error('Error verifying DALL-E API key:', error);
    res.status(400).json({ valid: false, error: 'Invalid DALL-E API key' });
  }
};