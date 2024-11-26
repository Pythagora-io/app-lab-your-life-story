import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSpinner from '@/components/LoadingSpinner';
import { AlertDestructive } from "@/components/ui/alert";

export default function StoryDetail() {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [generatingStory, setGeneratingStory] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [improvedStory, setImprovedStory] = useState('');
  const [improvingStory, setImprovingStory] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`/api/stories/${id}`);
        setStory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching story:', error);
        setError('Failed to fetch story details. Please try again.');
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  const handleGenerateStory = async () => {
    setGeneratingStory(true);
    setError('');
    try {
      const response = await axios.post(`/api/stories/${id}/generate`);
      setGeneratedStory(response.data.generatedStory);
    } catch (error) {
      console.error('Error generating story:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to generate story. Please try again.');
      }
    } finally {
      setGeneratingStory(false);
    }
  };

  const handleImproveStory = async () => {
    setImprovingStory(true);
    setError('');
    try {
      const response = await axios.post(`/api/stories/${id}/improve`, { instruction });
      setImprovedStory(response.data.improvedStory);
    } catch (error) {
      console.error('Error improving story:', error);
      setError('Failed to improve story. Please try again.');
    } finally {
      setImprovingStory(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <AlertDestructive title="Error" description={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="animate__animated animate__fadeIn mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{story.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {story.images.map((image, index) => (
              <div key={index} className="space-y-2">
                <img
                  src={`/${image}`}
                  alt={`Story image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
                <p className="text-sm text-gray-600">{story.imageSummaries[index]}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="animate__animated animate__fadeIn">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Generated Story</CardTitle>
        </CardHeader>
        <CardContent>
          {!generatedStory && (
            <Button
              onClick={handleGenerateStory}
              disabled={generatingStory}
              className="mb-4"
            >
              {generatingStory ? 'Generating...' : 'Generate Story'}
            </Button>
          )}
          {generatingStory && <LoadingSpinner />}
          {generatedStory && (
            <div className="prose max-w-none">
              <p>{generatedStory}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="animate__animated animate__fadeIn mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Improve Story</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Enter instructions to improve the story"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            className="mb-4"
          />
          <Button
            onClick={handleImproveStory}
            disabled={improvingStory || !generatedStory}
            className="mb-4"
          >
            {improvingStory ? 'Improving...' : 'Improve Story'}
          </Button>
          {improvingStory && <LoadingSpinner />}
          {improvedStory && (
            <div className="prose max-w-none">
              <h3>Improved Story:</h3>
              <p>{improvedStory}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}