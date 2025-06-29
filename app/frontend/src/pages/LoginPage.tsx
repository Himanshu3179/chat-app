import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import apiClient from '../lib/axios';
import { useAuthStore } from '../store/auth.store';

type LoginFormData = { email: string; password: string; };
interface LoginResponse { token: string; user: { _id: string; username: string; email: string; };}

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const { mutate, isPending, error } = useMutation<LoginResponse, Error, LoginFormData>({
    mutationFn: (data) => apiClient.post('/auth/login', data).then((res) => res.data),
    onSuccess: (data) => {
      setUser(data.user, data.token);
      navigate('/chat');
    },
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => mutate(data);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Welcome Back</h1>
          {/* FIX: Lighter subtitle text for dark mode */}
          <p className="mt-2 text-gray-600 dark:text-gray-300">Sign in to continue</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          
          {error && <p className="text-red-500 text-sm text-center">Login failed. Please check your credentials.</p>}

          <div className="pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>
        </form>

        {/* FIX: Lighter bottom link text for dark mode */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-300">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;