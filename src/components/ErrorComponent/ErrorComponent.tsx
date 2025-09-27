import { Link } from "@tanstack/react-router";

export function ErrorComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded-lg shadow-md border border-red-200">
        <h1 className="text-2xl font-bold text-red-600 mb-4">404</h1>
        <p className="text-red-700">Something went wrong</p>
        <Link to="/schedules" className="text-blue-600 hover:underline mt-4 block">
          Go back to Home
        </Link>
      </div>
    </div>
  );
}