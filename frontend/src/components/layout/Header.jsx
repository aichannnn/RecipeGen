import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom"
import { logout, reset } from "../../store/slices/authSlice";


const Logo = () => {
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 mr-2 text-custom-orange">
    <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" /> {/* Example star, replace with your logo design */}
  </svg>
}

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <header className="bg-orange-400
         text-black p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/app" className="flex items-center text-2xl font-bold hover:opacity-80 transition-opacity">
          {/* <img src="/path-to-your-logo.png" alt="Logo" className="h-10 mr-3" /> */}
          <Logo />
          <span className="text-custom-orange">Recipe</span>
          <span className="text-gray-200">Gen</span>
        </Link>
        <nav className="flex items-center space-x-6">
          {/* Optional: Links to other sections if you add them
                    <Link to="/app/history" className="hover:text-custom-orange transition-colors">History</Link>
                    <Link to="/app/favorites" className="hover:text-custom-orange transition-colors">Favorites</Link>
                    */}
          {userInfo && <span className="text-gray-200 text-sm font-semibold hidden md:block">Hi, {userInfo.username}</span>}
          <button
            onClick={handleLogout}
            className=" 
            hover:bg-orange-300 text-black font-semibold py-2 px-5 rounded-lg transition duration-150 ease-in-out hover:shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  )

}

export default Header;