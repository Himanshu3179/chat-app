import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import apiClient from '../lib/axios';
import { useAuthStore } from '../store/auth.store'; // Import the auth store

// Define the shape of our form data
type RegisterFormData = {
  username: string;
  email: string;
  password: string;
};

// Define the expected API response (same as login)
interface AuthResponse {
  token: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore(); // Get the setUser function from our store
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  // TanStack Query mutation for handling the registration API call
  const { mutate, isPending, error } = useMutation<
    AuthResponse, // Expect the new AuthResponse
    Error,
    RegisterFormData
  >({
    mutationFn: (data) =>
      apiClient.post('/auth/register', data).then((res) => res.data),
    // --- THIS IS THE FIX ---
    onSuccess: (data) => {
      // On success, save the user and token to our store
      setUser(data.user, data.token);
      // And navigate directly to the chat page
      navigate('/chat');
    },
  });

  const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
    mutate(data);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Create Account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Join us and start chatting</p>
        </div>
        
        {/* We no longer need the isSuccess message as we redirect immediately */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input 
                label="Username"
                type="text" 
                placeholder="your_username" 
                {...register('username', { required: 'Username is required' })}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

            <Input 
                label="Email Address"
                type="email" 
                placeholder="you@example.com" 
                {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

            <Input 
                label="Password"
                type="password" 
                placeholder="••••••••" 
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            
            {error && <p className="text-red-500 text-sm text-center">Registration failed. The email may already be in use.</p>}

            <div className="pt-2">
                <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating Account...' : 'Create Account & Login'}
                </Button>
            </div>
        </form>

        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;