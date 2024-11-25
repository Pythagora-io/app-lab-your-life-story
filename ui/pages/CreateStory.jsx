import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDestructive } from "@/components/ui/alert";

export default function CreateStory() {
  const [title, setTitle] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await axios.post('/api/stories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/my-stories');
    } catch (error) {
      console.error('Error creating story:', error);
      setError(error.response?.data?.error || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Story</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <AlertDestructive title="Error" description={error} />}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Story Title</Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="images">Upload Images</Label>
                <Input
                  id="images"
                  type="file"
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Story'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}