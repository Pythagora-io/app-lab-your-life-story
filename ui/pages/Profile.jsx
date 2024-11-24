import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertDestructive, AlertSuccess } from "@/components/ui/alert";

export default function Profile() {
  const [dalleApiKey, setDalleApiKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    const fetchDalleApiKey = async () => {
      try {
        const response = await axios.get('/api/dalle-api-key');
        setDalleApiKey(response.data.dalleApiKey || '');
      } catch (error) {
        console.error('Error fetching DALL-E API key:', error);
      }
    };

    fetchDalleApiKey();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Verify the API key
      const verificationResponse = await axios.post('/api/verify-dalle-api-key', { dalleApiKey });

      if (verificationResponse.data.valid) {
        // If valid, save the API key
        const saveResponse = await axios.post('/api/dalle-api-key', { dalleApiKey });
        setVerificationResult({ success: true, message: 'DALL-E API Key verified and saved successfully.' });
      } else {
        setVerificationResult({ success: false, message: 'Invalid DALL-E API Key. Please check and try again.' });
      }
    } catch (error) {
      console.error('Error verifying or saving DALL-E API Key:', error);
      setVerificationResult({ success: false, message: 'Error verifying or saving DALL-E API Key. Please try again.' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dalleApiKey">DALL-E API Key</Label>
                <Input
                  id="dalleApiKey"
                  type="password"
                  value={dalleApiKey}
                  onChange={(e) => setDalleApiKey(e.target.value)}
                  placeholder="Enter your DALL-E API key"
                />
              </div>
              <Button type="submit" disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Verify and Save API Key'}
              </Button>
              {verificationResult && (
                verificationResult.success ? (
                  <AlertSuccess
                    title="Success"
                    description={verificationResult.message}
                  />
                ) : (
                  <AlertDestructive
                    title="Error"
                    description={verificationResult.message}
                  />
                )
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}