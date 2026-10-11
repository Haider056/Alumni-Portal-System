import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import './Styles/chatbot.css';
import { createChatBotMessage } from 'react-chatbot-kit';
import { useLocation } from 'react-router-dom';
import { FiMessageSquare, FiX, FiBriefcase, FiFileText, FiAward, FiCalendar, FiHome, FiArrowUpRight } from 'react-icons/fi';
import { useAuth } from '../authContext';

const fmtDate = (value) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value || ''));
  const d = m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(value);
  return isNaN(d) ? String(value || '') : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};
const fmtTime = (t) => String(t || '').slice(0, 5);

// Define ActionProvider
class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  async fetchJobs() {
    try {
      const response = await fetch(`http://localhost:3001/auth/AllPostedJobs/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      return data.allPostJobsOrInternships.slice(-3); // Get the last three jobs
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return []; // Return an empty array or handle error as needed
    }
  }

  async fetchNews() {
    try {
      const response = await fetch(`http://localhost:3001/auth/getnews`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      return data.news.slice(-3); // Get the last three news
    } catch (error) {
      console.error('Error fetching news:', error);
      return []; // Return an empty array or handle error as needed
    }
  }

  async fetchSuccessStories() {
    try {
      const response = await fetch(`http://localhost:3001/auth/AllSuccessStories/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      const data = await response.json();
      return data.successStories.slice(-3); // Get the last three success stories
    } catch (error) {
      console.error('Error fetching success stories:', error);
      return []; // Return an empty array or handle error as needed
    }
  }

  async fetchEvents() {
    try {
      const response = await fetch('http://localhost:3001/auth/allEvents', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("Fetched event data:", data); // Debug log
      return data.slice(-3); // Get the last three events
    } catch (error) {
      console.error('Error fetching events:', error);
      return []; // Return an empty array or handle error as needed
    }
  }

  async fetchBookings() {
    try {
      const response = await fetch('http://localhost:3001/auth/bookings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log("Fetched booking data:", data); // Debug log
      return data; // Return all bookings
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return []; // Return an empty array or handle error as needed
    }
  }

  handleJobs = async () => {
    const jobs = await this.fetchJobs();
    if (jobs.length === 0) {
      const message = this.createChatBotMessage("Sorry, no jobs available at the moment.");
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    } else {
      const jobMessages = jobs.map(job => {
        const shortDescription = job.jobDescription.slice(0, 70); // Limit description to 70 characters
        const message = this.createChatBotMessage(
          `${job.jobTitle} · ${job.jobLocations}\n${shortDescription}…`,
          {
            widget: 'jobLink',
            withAvatar: true,
            delay: 500,
            payload: { url: `${window.location.origin}/JobDescription/${job.id}` }
          }
        );
        return message;
      });
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, ...jobMessages],
      }));
      const viewAllMessage = this.createChatBotMessage(
        `View all jobs:`,
        {
          widget: 'viewAllLink',
          withAvatar: true,
          delay: 500,
          payload: { url: `${window.location.origin}/jobpage` }
        }
      );
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, viewAllMessage],
      }));
    }
  };

  handleNews = async () => {
    const news = await this.fetchNews();
    if (news.length === 0) {
      const message = this.createChatBotMessage("Sorry, no news available at the moment.");
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    } else {
      const newsMessages = news.map(newsItem => {
        const shortDescription = newsItem.newsDescription.slice(0, 70); // Limit description to 70 characters
        const message = this.createChatBotMessage(
          `${newsItem.newsTitle}\n${shortDescription}…`,
          {
            widget: 'newsLink',
            withAvatar: true,
            delay: 500,
            payload: { url: `${window.location.origin}/newsDescription/${newsItem.id}` }
          }
        );
        return message;
      });
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, ...newsMessages],
      }));
      const viewAllMessage = this.createChatBotMessage(
        `View all news:`,
        {
          widget: 'viewAllLink',
          withAvatar: true,
          delay: 500,
          payload: { url: `${window.location.origin}/News` }
        }
      );
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, viewAllMessage],
      }));
    }
  };

  handleSuccessStories = async () => {
    const successStories = await this.fetchSuccessStories();
    if (successStories.length === 0) {
      const message = this.createChatBotMessage("Sorry, no success stories available at the moment.");
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    } else {
      const successMessages = successStories.map(story => {
        const shortDescription = story.success_story.slice(0, 70); // Limit description to 70 characters
        const message = this.createChatBotMessage(
          `${story.alumni_name}, ${story.department_name} '${String(story.graduation_year).slice(-2)}\n“${shortDescription}…”`,
          {
            widget: 'successLink',
            withAvatar: true,
            delay: 500,
            payload: { url: `${window.location.origin}/SuccessStories` }
          }
        );
        return message;
      });
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, ...successMessages],
      }));
      const viewAllMessage = this.createChatBotMessage(
        `View all success stories:`,
        {
          widget: 'viewAllLink',
          withAvatar: true,
          delay: 500,
          payload: { url: `${window.location.origin}/SuccessStories` }
        }
      );
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, viewAllMessage],
      }));
    }
  };

  handleEvents = async () => {
    console.log("Fetching events..."); // Debug log
    const events = await this.fetchEvents();
    console.log("Fetched events:", events); // Debug log
    
    if (events.length === 0) {
      const message = this.createChatBotMessage("Sorry, no events available at the moment.");
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    } else {
      const eventMessages = events.map(event => {
        const shortDescription = event.eventDescription.slice(0, 70); // Limit description to 70 characters
        const message = this.createChatBotMessage(
          `${event.eventTitle}\n${fmtDate(event.eventDate)} · ${event.eventTiming}\nVenue: ${event.eventLocations}\n${shortDescription}…`,
          {
            widget: 'eventLink',
            withAvatar: true,
            delay: 500,
            payload: { url: `${window.location.origin}/event/${event.id}` }
          }
        );
        return message;
      });
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, ...eventMessages],
      }));
      const viewAllMessage = this.createChatBotMessage(
        `View all events:`,
        {
          widget: 'viewAllLink',
          withAvatar: true,
          delay: 500,
          payload: { url: `${window.location.origin}/Upcomingevents` }
        }
      );
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, viewAllMessage],
      }));
    }
  };

  handleBookings = async () => {
    console.log("Fetching bookings..."); // Debug log
    const bookings = await this.fetchBookings();
    console.log("Fetched bookings:", bookings); // Debug log

    if (bookings.length === 0) {
      const message = this.createChatBotMessage("Sorry, no bookings available at the moment.");
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    } else {
      const intro = this.createChatBotMessage(`Auditorium bookings (${bookings.length}):`, { withAvatar: true });
      const bookingMessages = bookings.map(booking => {
        const message = this.createChatBotMessage(
          `${booking.eventTitle}\n${fmtDate(booking.eventDate)} · ${fmtTime(booking.eventTime)}–${fmtTime(booking.eventEndTime)}`,
          {
            withAvatar: true,
            delay: 500
          }
        );
        return message;
      });
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, intro, ...bookingMessages],
      }));
    }
  };
}

// Define MessageParser
class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('jobs')) {
      this.actionProvider.handleJobs();
    } else if (lowerCaseMessage.includes('news')) {
      this.actionProvider.handleNews();
    } else if (lowerCaseMessage.includes('success stories')) {
      this.actionProvider.handleSuccessStories();
    } else if (lowerCaseMessage.includes('events')) {
      this.actionProvider.handleEvents();
    } else if (lowerCaseMessage.includes('auditorium bookings')) {
      this.actionProvider.handleBookings();
    }
  }
}

// Define Options component
const Options = (props) => {
  const options = [
    { text: 'Jobs', icon: <FiBriefcase />, handler: props.actionProvider.handleJobs, id: 1 },
    { text: 'News', icon: <FiFileText />, handler: props.actionProvider.handleNews, id: 2 },
    { text: 'Success Stories', icon: <FiAward />, handler: props.actionProvider.handleSuccessStories, id: 3 },
    { text: 'Events', icon: <FiCalendar />, handler: props.actionProvider.handleEvents, id: 4 },
    { text: 'Auditorium Bookings', icon: <FiHome />, handler: props.actionProvider.handleBookings, id: 5 },
  ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          data-option={option.text}
          onClick={option.handler}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full border border-line-strong bg-surface text-[13px] font-medium text-ink-2 hover:border-accent hover:text-accent transition-colors"
          style={{ margin: 0 }}
        >
          <span className="text-ink-3">{option.icon}</span>
          {option.text}
        </button>
      ))}
    </div>
  );
};

const LinkButton = ({ payload, label }) => (
  <div>
  <button
    type="button"
    className="inline-flex items-center gap-1 h-7 px-2.5 rounded-ctl border border-line bg-surface text-xs font-medium text-accent hover:border-accent-line hover:bg-accent-soft"
    style={{ margin: 0 }}
    onClick={() => window.open(payload.url, "_blank")}
  >
    {label} <FiArrowUpRight />
  </button>
  </div>
);

const JobLink = ({ payload }) => <LinkButton payload={payload} label="See details" />;
const ViewAllLink = ({ payload }) => <LinkButton payload={payload} label="View all" />;
const NewsLink = ({ payload }) => <LinkButton payload={payload} label="Read more" />;
const SuccessLink = ({ payload }) => <LinkButton payload={payload} label="Read more" />;
const EventLink = ({ payload }) => <LinkButton payload={payload} label="Event details" />;

// Define chatbot configuration
const config = {
  botName: 'IST Assistant',
  customComponents: {
    header: () => null,
    botAvatar: () => (
      <div className="react-chatbot-kit-chat-bot-avatar-container"><p className="react-chatbot-kit-chat-bot-avatar-letter">IST</p></div>
    ),
  },
  initialMessages: [
    createChatBotMessage('Hi! I can look up the latest jobs, news, events and auditorium bookings. What would you like to see?', {
      widget: 'options',
    }),
  ],
  widgets: [
    {
      widgetName: 'options',
      widgetFunc: (props) => <Options {...props} />,
    },
    {
      widgetName: 'jobLink',
      widgetFunc: (props) => <JobLink {...props} />,
    },
    {
      widgetName: 'viewAllLink',
      widgetFunc: (props) => <ViewAllLink {...props} />,
    },
    {
      widgetName: 'newsLink',
      widgetFunc: (props) => <NewsLink {...props} />,
    },
    {
      widgetName: 'successLink',
      widgetFunc: (props) => <SuccessLink {...props} />,
    },
    {
      widgetName: 'eventLink',
      widgetFunc: (props) => <EventLink {...props} />,
    },
  ],
};

const HIDDEN_ON = ['/', '/signup', '/resetpassword'];

const ChatbotButton = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();

  if (!isLoggedIn || HIDDEN_ON.includes(pathname.toLowerCase())) return null;

  const handleButtonClick = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <>
      {showChatbot && (
        <div className="cb-panel fixed bottom-[88px] right-6 z-50 w-[380px] h-[560px] max-h-[calc(100vh-120px)] card shadow-pop overflow-hidden flex flex-col">
          <div className="flex items-center gap-3 px-4 h-14 border-b border-line shrink-0">
            <div className="h-8 w-8 rounded-ctl bg-ink text-white inline-flex items-center justify-center font-mono text-[11px] font-semibold">IST</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold leading-tight">Alumni assistant</div>
              <div className="text-xs text-ink-3 flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-success" /> Answers from live portal data</div>
            </div>
            <button type="button" aria-label="Close assistant" className="h-8 w-8 inline-flex items-center justify-center rounded-ctl text-ink-3 hover:bg-canvas hover:text-ink" style={{ margin: 0 }} onClick={handleButtonClick}>
              <FiX />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
              placeholderText="Ask about jobs, news, events…"
            />
          </div>
        </div>
      )}
      <button
        id="chatbot-launcher"
        type="button"
        aria-label={showChatbot ? 'Close assistant' : 'Open assistant'}
        className="fixed bottom-6 right-6 z-50 h-12 pl-4 pr-5 rounded-full bg-ink text-white inline-flex items-center gap-2 text-sm font-medium shadow-pop hover:bg-[#23262d]"
        style={{ margin: 0 }}
        onClick={handleButtonClick}
      >
        {showChatbot ? <FiX className="text-[17px]" /> : <FiMessageSquare className="text-[17px]" />}
        {showChatbot ? 'Close' : 'Ask IST'}
      </button>
    </>
  );
};

export default ChatbotButton;
