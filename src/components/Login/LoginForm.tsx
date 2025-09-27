import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from '@tanstack/react-router';
import { Button } from '../ui/button'; 
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useApi } from '@/lib/api';

import { useAuthStore, type AuthUser } from '@/store/authStore';

const loginSchema = z.object({
  username: z.string().min(1, { message: "User Name is required" }),
  password: z.string().min(6, { message: "Password must have at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuthStore((state) => state.auth); 

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const { login } = useApi();

  const { handleSubmit, register, formState: { errors, isSubmitting } } = form;

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const response = await login(values);
      
      const { access_token, user } = response.data;
      setAccessToken(access_token);

      const authUser: AuthUser = { userName: user.username };
      setUser(authUser);
      
      navigate({ to: '/schedules' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login error:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription className="text-gray-500">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">User Name</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Enter your user name"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full rounded-xl py-2 text-lg font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logining...' : 'Login'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
