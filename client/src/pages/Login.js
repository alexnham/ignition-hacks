import { useState } from "react";
import { PencilSquareIcon } from '@heroicons/react/24/outline'; // Import a cool icon
import { useNavigate, Link } from 'react-router-dom';
import { useLogin } from "../hooks/useLogin";
import NavBar from '../components/NavBar'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Attempt to log in and wait for the result
    await login(email, password);

    console.log("Error: ", error);

    // if (!error) {
    //   navigate('/');
    // }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
      <NavBar />

      <div className="flex justify-center absolute top-10 mb-6">
        <Link to={"/"}>
          <PencilSquareIcon className="h-16 w-16 text-blue-500" />
        </Link>
      </div>

      <form
        className="login w-full max-w-xl bg-white shadow-xl rounded-lg p-12"
        onSubmit={handleSubmit}
      >
        <h3 className="text-3xl font-bold mb-8 text-gray-900">Log in</h3>

        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email:
        </label>
        <input
          id="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline mb-6"
        />

        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password:
        </label>
        <input
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 text-lg leading-tight focus:outline-none focus:shadow-outline mb-8"
        />

        {/* Container for buttons */}
        <div className="flex justify-between gap-4">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={isLoading}
          >
            Log in
          </button>

          <button
            type="button"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </button>
        </div>

        {error && (
          <div className="border border-red-500 bg-red-100 text-red-500 text-sm font-semibold mt-4 p-3 rounded">
            {error}
          </div>
        )}

      </form>
    </div>
  );
}

export default Login;
