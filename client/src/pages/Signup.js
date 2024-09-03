import { useState } from "react"

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(name, email, password);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-6">
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

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign up
        </button>
      </form>
    </div>
  )
}

export default Signup;
