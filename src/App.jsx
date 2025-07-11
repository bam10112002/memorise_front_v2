import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomeScreen from '@/pages/HomeScreen';
import CreateAlbumScreen from '@/pages/CreateAlbumScreen';
import AlbumDetailsScreen from '@/pages/AlbumDetailsScreen';
import Notification from '@/components/Notification';

const App = () => {
  const [notificationMessage, setNotificationMessage] = useState('');

  const showNotification = (message) => {
    setNotificationMessage(message);
    setTimeout(() => setNotificationMessage(''), 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/create-album" element={<CreateAlbumScreen />} />
          <Route path="/album/:id" element={<AlbumDetailsScreen showNotification={showNotification} />} />
        </Routes>
      </BrowserRouter>
      <Notification message={notificationMessage} />
    </div>
  );
};

export default App;