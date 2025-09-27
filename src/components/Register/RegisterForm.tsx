/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from '@tanstack/react-router';
import { Button } from '../ui/button'; 
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

import { useAuthStore, type AuthUser } from '@/store/authStore';
import { useApi } from '@/lib/api';

const registerSchema = z.object({
  username: z.string().min(3, { message: "User name must have at least 3 characters" }),
  password: z.string().min(6, { message: "Password must have at least 6 characters." }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuthStore((state) => state.auth); 

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { registration } = useApi();

  const { handleSubmit, register, formState: { errors, isSubmitting } } = form;

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const response = await registration(values);
      
      const { access_token, user } = response.data;
      setAccessToken(access_token);

      const authUser: AuthUser = { userName: user.username };
      setUser(authUser);
      
      navigate({ to: '/schedules' });
    } catch (error: any) {
      console.error("Registration error:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Registration</CardTitle>
          <CardDescription className="text-gray-500">
            Create an account to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">User Name</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="Min 3 characters"
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
                placeholder="Min 6 characters"
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
              {isSubmitting ? 'Registration...' : 'Register'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Log In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
