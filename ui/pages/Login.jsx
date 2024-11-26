import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AlertDestructive } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '../AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn, setUserEmail } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmailError(false);
    setPasswordError(false);

    if (!email) {
      setEmailError(true);
    }
    if (!password) {
      setPasswordError(true);
    }

    if (!email || !password) {
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login');
      const response = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
      console.log('Login successful, setting isLoggedIn and userEmail');
      setIsLoggedIn(true);
      setUserEmail(response.data.user.email);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error.response?.data?.error || 'An unexpected error occurred', error);
      setError(error.response?.data?.error || 'An unexpected error occurred');
      if (error.response?.data?.field === 'email') {
        setEmailError(true);
      } else if (error.response?.data?.field === 'password') {
        setPasswordError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="loginPage" className="w-full h-screen flex items-center justify-center px-4 animate__animated animate__fadeIn">
      <Card className="mx-auto max-w-sm">
        {error && <AlertDestructive title="Login Error" description={error} />}
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                error={emailError}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {false && <a href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </a>}
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={passwordError}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Loading...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="/register/" className="underline">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}