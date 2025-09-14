import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const { signUp, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const { data, error } = await signUp(email, password, {
        first_name: firstName
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('Success! Please check your email to verify your account.');
        setEmail('');
        setPassword('');
        setFirstName('');
      }
    } catch (err) {
      setMessage(`Unexpected error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-aperio-blue mb-6 text-center">
        Test Database Connection
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aperio-blue focus:border-transparent"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aperio-blue focus:border-transparent"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aperio-blue focus:border-transparent"
            placeholder="Enter your password (min 6 characters)"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-aperio-blue hover:bg-blue-700 focus:ring-2 focus:ring-aperio-blue focus:ring-offset-2'
          } text-white`}
        >
          {isSubmitting ? 'Creating Account...' : 'Test Signup'}
        </button>
      </form>

      {/* Display messages */}
      {message && (
        <div className={`mt-4 p-3 rounded-md text-sm ${
          message.includes('Error') || message.includes('error')
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      {/* Display auth errors */}
      {error && (
        <div className="mt-4 p-3 rounded-md text-sm bg-red-50 text-red-700 border border-red-200">
          Auth Error: {error}
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500 text-center">
        This is a test component to verify database connection.
        <br />
        Check your Supabase dashboard after signup.
      </div>
    </div>
  );
}