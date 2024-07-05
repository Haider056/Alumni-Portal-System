import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import { useAuth } from './authContext';
import Login from './Components/Login';
import Signup from './Components/SignUp';
import Home from './Components/Home';
import JobPage from './Components/JobPage';
import Footer from './Components/Footer';
import Header from './Components/Header';
import CreatePortfolio from './Components/CreatePortfolio';
import Portfolio from './Components/Portfolio';
import News from './Components/News';
import ChatbotButton from './Components/ChatbotButton';
import ResetPassword from './Components/PasswordReset';
import PostJoborInternship from './Admin/PostJoborInternship';
import PastJoborInternship from './Alumni/PastJoborInternship';
import PostAlumniSuccessStories from './Alumni/PostAlumniSuccessStories';
import SuccessStories from './Alumni/SuccessStories';
import PostNews from './Admin/PostNews';
import PostUpComingEvents from './Admin/PostUpcomingEvents';
import PostedNews from './Admin/PostedNews';
import PostedEvents from './Admin/PostedEvents';
import EventDetails from './Components/UpComingEventsDetails';
import UpComingEvents from './Components/UpcomingEvents';
import PostedSuccessStories from './Alumni/PostedSucessStory';
import Jobdescription from './Components/JobDescription';
import ViewApplication from './Alumni/ViewApplications';
import NewsDescription from './Components/newsDescription';

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  const PrivateRoute = ({ element, path }) => {
    return isLoggedIn ? element : <Navigate to="/" />;
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/jobPage" element={<PrivateRoute element={<JobPage />} />} />
      <Route path="/Footer" element={<Footer />} />
      <Route path="/Header" element={<Header />} />
      <Route path="/CreatePortfolio" element={<PrivateRoute element={<CreatePortfolio />} />} />
      <Route path="/Portfolio" element={<PrivateRoute element={<Portfolio />} />} />
      <Route path="/News" element={<PrivateRoute element={<News />} />} />
      <Route path="/Home" element={<PrivateRoute element={<Home />} />} />
      <Route path="/ResetPassword" element={<PrivateRoute element={<ResetPassword />} />} />
      <Route path="/UpcomingEvents" element={<PrivateRoute element={<UpComingEvents />} />} />
      <Route path="/JobDescription/:jobId" element={<PrivateRoute element={<Jobdescription />} />} />
      <Route path="/newsDescription/:newsId" element={<PrivateRoute element={<NewsDescription />} />} />
      {/* Admin Routes */}
      <Route path="/PostJoborInternship" element={<PrivateRoute element={<PostJoborInternship />} />} />
      <Route path="/PostNews" element={<PrivateRoute element={<PostNews />} />} />
      <Route path="/PostEvents" element={<PrivateRoute element={<PostUpComingEvents />} />} />
      <Route path="/PostedNews" element={<PrivateRoute element={<PostedNews />} />} />
      <Route path="/PostedEvents" element={<PrivateRoute element={<PostedEvents />} />} />
      {/* Alumni Routes */}
      <Route path="/PastJoborInternship" element={<PrivateRoute element={<PastJoborInternship />} />} />
      <Route path="/SuccessStories" element={<PrivateRoute element={<SuccessStories />} />} />
      <Route path="/event/:id" element={<PrivateRoute element={<EventDetails />} />} />
      <Route path="/PostAlumniSuccessStories" element={<PrivateRoute element={<PostAlumniSuccessStories />} />} />
      <Route path="/PostedSuccessStories" element={<PrivateRoute element={<PostedSuccessStories />} />} />
      <Route path="/viewApplication/:id" element={<ViewApplication />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
      <ChatbotButton />
    </Router>
  );
}

export default App;
