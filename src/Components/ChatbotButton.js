import React, { useState } from 'react';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import { createChatBotMessage } from 'react-chatbot-kit';

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
          `${job.jobTitle}: ${shortDescription}`,
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
          `${newsItem.newsTitle}: ${shortDescription}`,
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
          `${story.alumni_name}: ${shortDescription}`,
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
          `${event.eventTitle}: ${shortDescription}\nVenue: ${event.eventVenue}\nDate: ${event.eventDate}\nTime: ${event.eventTiming}`,
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
      const bookingMessages = bookings.map(booking => {
        const message = this.createChatBotMessage(
          `Title: ${booking.eventTitle}\nDate: ${booking.eventDate}\nTime: ${booking.eventTime} - ${booking.eventEndTime}`,
          {
            withAvatar: true,
            delay: 500
          }
        );
        return message;
      });
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, ...bookingMessages],
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
    { text: 'Jobs', handler: props.actionProvider.handleJobs, id: 1 },
    { text: 'News', handler: props.actionProvider.handleNews, id: 2 },
    { text: 'Success Stories', handler: props.actionProvider.handleSuccessStories, id: 3 },
    { text: 'Events', handler: props.actionProvider.handleEvents, id: 4 },
    { text: 'Auditorium Bookings', handler: props.actionProvider.handleBookings, id: 5 },
  ];

  return (
    <div className="flex flex-col items-start">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={option.handler}
          className="mb-2 p-2 bg-blue-500 text-white rounded-md"
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};

// Define JobLink component
const JobLink = ({ payload }) => {
  return (
    <div>
      <button
        className="p-2 bg-blue-500 text-white rounded-md"
        onClick={() => window.open(payload.url, "_blank")}
      >
        See Details
      </button>
    </div>
  );
};

// Define ViewAllLink component
const ViewAllLink = ({ payload }) => {
  return (
    <div>
      <button
        className="p-2 bg-blue-500 text-white rounded-md"
        onClick={() => window.open(payload.url, "_blank")}
      >
        View All
      </button>
    </div>
  );
};

// Define NewsLink component
const NewsLink = ({ payload }) => {
  return (
    <div>
      <button
        className="p-2 bg-blue-500 text-white rounded-md"
        onClick={() => window.open(payload.url, "_blank")}
      >
        Read More
      </button>
    </div>
  );
};

// Define SuccessLink component
const SuccessLink = ({ payload }) => {
  return (
    <div>
      <button
        className="p-2 bg-blue-500 text-white rounded-md"
        onClick={() => window.open(payload.url, "_blank")}
      >
        Read More
      </button>
    </div>
  );
};

// Define EventLink component
const EventLink = ({ payload }) => {
  return (
    <div>
      <button
        className="p-2 bg-blue-500 text-white rounded-md"
        onClick={() => window.open(payload.url, "_blank")}
      >
        Read More
      </button>
    </div>
  );
};

// Define chatbot configuration
const config = {
  botName: 'Hammad Sayen Bot',
  initialMessages: [
    createChatBotMessage('How can we help you today?', {
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

const ChatbotButton = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  const handleButtonClick = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <button
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full z-50"
        onClick={handleButtonClick}
      >
        Chat
      </button>
      {showChatbot && (
        <div className="fixed bottom-32 right-6 bg-white shadow-lg rounded-lg w-80 h-96 z-50">
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )}
    </div>
  );
};

export default ChatbotButton;
