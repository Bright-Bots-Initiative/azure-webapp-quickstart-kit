
// src/pages/StudentLogin.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../services/api';
import GameBackground from '../components/GameBackground';
import AppMascot from '../components/BrightBoostRobot';

const StudentLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await loginUser(email, password);
      // Verify this is a student account
      if (response.user.role !== 'student') {
        setError('This login is only for students. Please use the teacher login if you are a teacher.');
        setIsLoading(false);
        return;
      }
      login(response.token, response.user);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GameBackground>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full max-w-4xl">
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-webapp-primary mb-4">
              Student Login
            </h1>
            <p className="text-lg text-webapp-primary mb-6">
              Ready to continue your learning adventure?
            </p>
            <AppMascot className="hidden md:block" />
          </div>
          
          <div className="game-card p-6 flex-1 w-full max-w-md">
            <AppMascot className="md:hidden mx-auto mb-6" size="sm" />
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-webapp-primary mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-white border-2 border-webapp-tertiary text-webapp-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-webapp-secondary focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-webapp-primary mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-white border-2 border-webapp-tertiary text-webapp-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-webapp-secondary focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`button-shadow w-full py-3 px-4 rounded-xl text-white font-bold ${
                  isLoading ? 'bg-webapp-tertiary/70' : 'bg-webapp-tertiary'
                } transition-colors`}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-webapp-primary">
                Don't have an account?{' '}
                <Link to="/student/signup" className="text-webapp-secondary font-bold hover:underline transition-colors">
                  Sign up
                </Link>
              </p>
              <p className="text-sm text-webapp-primary mt-2">
                <Link to="/" className="text-webapp-secondary font-bold hover:underline transition-colors">
                  Back to Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default StudentLogin;
