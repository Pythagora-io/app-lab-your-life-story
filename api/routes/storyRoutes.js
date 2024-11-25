import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireUser } from '../middlewares/authMiddleware.js';
import StoryService from '../services/storyService.js';

const router = express.Router();

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/stories', requireUser, upload.array('images', 10), async (req, res) => {
  try {
    const { title } = req.body;
    const imageFiles = req.files;

    console.log('Received image files:', imageFiles);

    if (!title || !imageFiles || imageFiles.length === 0) {
      return res.status(400).json({ error: 'Title and at least one image are required' });
    }

    const imagePaths = imageFiles.map(file => file.path.replace(/^.*[\\\/]/, 'uploads/'));
    console.log('Image paths before saving:', imagePaths);

    const story = await StoryService.createStory(req.user._id, title, imagePaths);

    console.log('Saved story:', story);

    res.status(201).json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'An error occurred while creating the story' });
  }
});

router.get('/stories', requireUser, async (req, res) => {
  try {
    const stories = await StoryService.getUserStories(req.user._id);
    res.json(stories);
  } catch (error) {
    console.error('Error fetching user stories:', error);
    res.status(500).json({ error: 'An error occurred while fetching stories' });
  }
});

router.get('/stories/:id', requireUser, async (req, res) => {
  try {
    const story = await StoryService.getStoryById(req.params.id, req.user._id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ error: 'An error occurred while fetching the story' });
  }
});

router.delete('/stories/:id', requireUser, async (req, res) => {
  try {
    await StoryService.deleteStory(req.params.id, req.user._id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ error: 'An error occurred while deleting the story' });
  }
});

export default router;