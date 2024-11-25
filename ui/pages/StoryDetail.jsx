import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from '@/components/LoadingSpinner';
import { AlertDestructive } from "@/components/ui/alert";

export default function StoryDetail() {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <AlertDestructive title="Error" description={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="animate__animated animate__fadeIn">
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
    </div>
  );
}