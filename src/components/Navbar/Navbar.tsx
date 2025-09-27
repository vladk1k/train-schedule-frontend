import { Link } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '../ui/button';

export function Navbar() {
  const { user, accessToken, reset } = useAuthStore((state) => state.auth);
  const isAuthenticated = !!accessToken && !!user;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        
        <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          🚆 Train Schedule
        </Link>

        <nav className="flex items-center space-x-4">
          {isAuthenticated && (
            <>
              <span className="text-sm font-medium text-gray-600 hidden sm:inline">
                Hello, {user.userName}!
              </span>
              <Button onClick={reset} variant="ghost" size="sm" className="space-x-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </>
          ) }
        </nav>
      </div>
    </header>
  );
}