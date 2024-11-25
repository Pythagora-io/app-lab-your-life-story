import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDestructive } from "@/components/ui/alert";
import LoadingSpinner from '@/components/LoadingSpinner';

export default function MyStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await axios.get('/api/stories');
      setStories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setError('Failed to fetch stories. Please try again.');
      setLoading(false);
    }
  };

  const handleDelete = async (storyId) => {
    try {
      await axios.delete(`/api/stories/${storyId}`);
      setStories(stories.filter(story => story._id !== storyId));
    } catch (error) {
      console.error('Error deleting story:', error);
      setError('Failed to delete story. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Stories</h1>
        <Button onClick={() => navigate('/create-story')} className="animate__animated animate__pulse">
          Create Story
        </Button>
      </div>
      {error && <AlertDestructive title="Error" description={error} />}
      {stories.length === 0 ? (
        <p>You haven't created any stories yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Card key={story._id} className="animate__animated animate__fadeIn">
              <CardHeader>
                <CardTitle>{story.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Created: {new Date(story.createdAt).toLocaleDateString()}</p>
                <div className="mt-4 flex justify-between">
                  <Button onClick={() => navigate(`/stories/${story._id}`)}>View</Button>
                  <Button variant="destructive" onClick={() => handleDelete(story._id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}