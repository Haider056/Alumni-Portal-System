import { useState } from "react";
import Logo from './Assets/logo.png';
import { useAuth } from '../authContext';
import { useNavigate } from 'react-router-dom';
 function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const handleLogoutClick = async () => {
    const logoutSuccessful = await handleLogout();
    if (logoutSuccessful) {
      navigate('/'); 
    }
  };
  return (
    <div className="flex items-center justify-between border-b border-gray-400 py-8">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300&family=Raleway:ital,wght@0,400;0,600;0,700;1,300&family=Rubik:wght@500&display=swap');

        .hideMenuNav {
          display: none;
        }
        .showMenuNav {
          display: block;
          position: absolute;
          width: 100%;
          height: 100vh;
          top: 0;
          left: 0;
          background: white;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
        }

        a {
          color: #000000; /* Extreme black color */
          text-decoration: none;
          font-weight: bold;
        }

        body {
          font-family: 'Montserrat', sans-serif;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Raleway', sans-serif;
        }
        p {
          font-family: 'Rubik', sans-serif;
        }
      `}</style>

      <div>
        <img src={Logo} alt="logo" style={{ width: '120px', height: '70px' }} />
      </div>

      <nav>
        <section className="MOBILE-MENU flex lg:hidden">
          <div
            className="HAMBURGER-ICON space-y-2"
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
          </div>

          <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
            <div
              className="absolute top-0 right-0 px-8 py-8"
              onClick={() => setIsNavOpen(false)}
            >
              <svg
                className="h-8 w-8 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <ul className="flex flex-col items-center justify-between min-h-[250px]">
              <li className="border-b border-gray-400 my-8 uppercase">
                <a href="/home">Home</a>
              </li>
              <li className="border-b border-gray-400 my-8 uppercase">
                <a href="/jobPage">Job or Internship</a>
              </li>
            
              <li className="border-b border-gray-400 my-8 uppercase">
                <a href="/News">News</a>
              </li>
              <li className="border-b border-gray-400 my-8 uppercase">
                <a href="/portfolio">Upcoming Events</a>
              </li>
           
              <li>
            <button onClick={handleLogoutClick}>Logout</button>
          </li>
            </ul>
          </div>
        </section>

        <ul className="DESKTOP-MENU hidden space-x-8 lg:flex mr-12">
          <li>
            <a href="/Home">Home</a>
          </li>
          <li>
            <a href="/jobPage">Job or Internship</a>
          </li>
       
          <li>
            <a href="/News">News or Upcoming Events</a>
          </li>
      
          <li>
            <a href="/Portfolio"> Portfolio</a>
          </li>
          <li>
            <button onClick={handleLogoutClick}>Logout</button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;