import { Link } from 'react-router-dom';

export default function Homepage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Welcome to DocTalk</h1>

      <div className="space-x-4">
        <Link to="/login">
          <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none">
            Log In
          </button>
        </Link>

        <Link to="/signup">
          <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
