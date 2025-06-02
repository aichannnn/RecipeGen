import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login, reset } from "../store/slices/authSlice";



const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError && message) {
      // Consider using a toast notification library here instead of alert
      alert(`Login Error:${message}`);
      dispatch(reset());
    }

    if (isSuccess || userInfo) {
      navigate('/app');
    }

  }, [userInfo, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      alert("please fill in all fields");
      return;
    }
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-black text-white p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-4xl font-bold text-center text-custom-orange mb-8">
          Welcome Back!
        </h2>
        {/* {isError && !message && <p className="text-red-400 bg-red-900 p-3 rounded mb-4 text-center">An unknown error occurred.</p>} */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input
              type="email" name="email" id="email" required autoComplete="email"
              value={formData.email} onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-orange focus:border-custom-orange sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password" name="password" id="password" required autoComplete="current-password"
              value={formData.password} onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-orange focus:border-custom-orange sm:text-sm"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-custom-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-orange focus:ring-offset-gray-800 disabled:opacity-60 transition duration-150"
          >
            {isLoading ? 'Logging In...' : 'Login'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-custom-orange hover:text-orange-400 underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )

}

export default LoginPage;