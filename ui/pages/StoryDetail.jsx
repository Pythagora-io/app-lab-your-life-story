import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertDestructive } from '@/components/ui/alert';
import LoadingSpinner from '@/components/LoadingSpinner';

const StoryDetail = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedStory, setGeneratedStory] = useState('');
  const [generatingStory, setGeneratingStory] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [improvingStory, setImprovingStory] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`/api/stories/${id}`);
        setStory(response.data);
        setGeneratedStory(response.data.generatedStory || '');
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch story details');
        setLoading(false);
      }
    };

    fetchStory();
  }, [id]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.onended = () => setIsPlaying(false);
    audio.onloadedmetadata = () => setDuration(audio.duration);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);

    return () => {
      audio.pause();
      audio.onended = null;
      audio.onloadedmetadata = null;
      audio.ontimeupdate = null;
    };
  }, []);

  const handlePlayPause = async () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src) {
        setAudioLoading(true);
        try {
          const response = await axios.post(`/api/stories/${id}/narrate`);
          const latestAudioPath = response.data.audioPath;
          setStory(prevStory => ({ ...prevStory, audioPath: latestAudioPath }));
          audioRef.current.src = `/${latestAudioPath}`;
        } catch (error) {
          console.error('Error fetching audio:', error);
          setError('Failed to fetch audio. Please try again.');
          setAudioLoading(false);
          return;
        }
      }
      await audioRef.current.play();
      setIsPlaying(true);
      setAudioLoading(false);
    }
  };

  const handleStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleGenerateStory = async () => {
    setGeneratingStory(true);
    setError('');
    try {
      const response = await axios.post(`/api/stories/${id}/generate`);
      setStory(prevStory => ({ ...prevStory, generatedStory: response.data.generatedStory }));
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
      setStory(prevStory => ({ ...prevStory, generatedStory: response.data.improvedStory, isImproved: true }));
      setGeneratedStory(response.data.improvedStory);
    } catch (error) {
      console.error('Error improving story:', error);
      setError('Failed to improve story. Please try again.');
    } finally {
      setImprovingStory(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <AlertDestructive title="Error" description={error} />;
  if (!story) return <AlertDestructive title="Error" description="Story not found" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="animate__animated animate__fadeIn mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-3xl font-bold">{story.title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handlePlayPause}
              variant="outline"
              disabled={audioLoading || !story.generatedStory}
            >
              {audioLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              onClick={handleStop}
              variant="outline"
              disabled={!isPlaying && currentTime === 0}
            >
              Stop
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {story.audioPath && (
            <div className="mt-4">
              <Input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
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
          <p className="text-sm text-blue-600 italic mt-2">
            Tip: After improving the story, refresh the page to listen to the new version!
          </p>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryDetail;