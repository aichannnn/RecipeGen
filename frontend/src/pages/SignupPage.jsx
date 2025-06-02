import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register, reset } from "../store/slices/authSlice";


const SignupPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError && message) {
      alert(`Signup Error: ${message}`);
      dispatch(reset());
    }

    if (isSuccess || userInfo) {
      navigate('/app');
    }

  }, [userInfo, isError, isSuccess, message, navigate, dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }
    dispatch(register(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-custom-black text-white p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-4xl font-bold text-center text-custom-orange mb-8">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input
              type="text" name="username" id="username" required autoComplete="username"
              value={formData.username} onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-orange focus:border-custom-orange sm:text-sm"
              placeholder="Choose a username"
            />
          </div>
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
              type="password" name="password" id="password" required autoComplete="new-password"
              value={formData.password} onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-orange focus:border-custom-orange sm:text-sm"
              placeholder="Create a strong password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-custom-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-orange focus:ring-offset-gray-800 disabled:opacity-60 transition duration-150"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-custom-orange hover:text-orange-400 underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );


}

export default SignupPage;