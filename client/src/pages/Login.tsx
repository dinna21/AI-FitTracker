import { AtSignIcon, LockIcon, UserIcon, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login, signup, user } = useAppContext();
  
  const [state, setState] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (state === 'signup' && !formData.username) {
      toast.error('Username is required for signup');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      if (state === 'login') {
        await login({
          email: formData.email,
          password: formData.password
        });
        toast.success('Successfully logged in!');
      } else {
        await signup({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        toast.success('Account created successfully!');
      }
      
      // Navigation will be handled by useEffect when user state updates
    } catch (error: any) {
      toast.error(error?.message || `Failed to ${state === 'login' ? 'sign in' : 'sign up'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleState = () => {
    setState(prev => prev === 'login' ? 'signup' : 'login');
    // Reset form when switching between login/signup
    setFormData({
      username: '',
      email: '',
      password: ''
    });
  };

  return (
    <>
    <div className="login-page-container">
      <div className="login-form">
        <h2 className="text-3xl dark:text-white font-medium text-gray-900 mb-2">
          {state === 'login' ? 'Sign In' : 'Sign Up'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {state === 'login' 
            ? "Please enter your credentials to sign in." 
            : "Please enter your details to create an account."}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Username field - only for signup */}
          {state === 'signup' && (
            <div className="mb-4">
              <label className="block font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="login-input"
                  placeholder="Enter your username"
                  disabled={isLoading}
                  required={state === 'signup'}
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="mb-4">
            <label className="block font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <AtSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="login-input"
                placeholder="Enter your email"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="mb-4">
            <label className="block font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="login-input"
                placeholder="Enter your password"
                disabled={isLoading}
                minLength={6}
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                {state === 'login' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              state === 'login' ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        {/* Toggle between login and signup */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          {state === 'login' 
            ? "Don't have an account? " 
            : "Already have an account? "}
          <button
            onClick={toggleState}
            className="text-green-600 dark:text-green-500 hover:underline font-medium"
            disabled={isLoading}
          >
            {state === 'login' ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
    </>
  );
};


export default Login;
