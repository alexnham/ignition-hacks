import { useState } from "react"
import { PencilSquareIcon } from '@heroicons/react/24/outline'; // Import a cool icon
import { useNavigate, Link } from 'react-router-dom';
import { useSignup } from "../hooks/useSignup";
import NavBar from '../components/NavBar'


const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { signup, isLoading, error } = useSignup();

  // const handleLoginClick = () => {
  //   navigate('/login');
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(name, email, password);
    await signup(name, email, password)

    // If no error exists after signup, navigate to the homepage
    if (!error) {
      navigate('/');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">

      <NavBar />
      {/* <h1 className='text-xl absolute top-10 left-10'>Logged In As: Dr. Khangura</h1>

      <button
        onClick={handleLoginClick}
        className="absolute top-10 right-10 px-4 py-2 text-white bg-blue-500 rounded-md"
      >
        Log In
      </button> */}

      <div className="flex justify-center absolute top-10 mb-6">
        <Link to={"/"}>
          <PencilSquareIcon className="h-16 w-16 text-blue-500" />
        </Link>
      </div>

      <form
        className="signup w-full max-w-xl bg-white shadow-xl rounded-lg p-12"
        onSubmit={handleSubmit}
      >
        <h3 className="text-3xl font-bold mb-8 text-gray-900">Sign up</h3>

        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Full Name:
        </label>
        <input
          id="name"
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-6"
        />

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

        <button disabled={isLoading}
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign up
        </button>
        {error && (
          <div className="border border-red-500 bg-red-100 text-red-500 text-sm font-semibold mt-4 p-3 rounded">
            {error}
          </div>
        )}
      </form>
    </div>
  )
}

export default Signup;
