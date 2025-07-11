import React from 'react';

const Notification = ({ message }) => {
  return (
    <div
      className={`fixed top-4 left-4 right-4 bg-green-500 text-white p-3 rounded-lg text-center max-w-md mx-auto sm:max-w-lg ${
        message ? '' : 'hidden'
      }`}
    >
      <p>{message}</p>
    </div>
  );
};

export default Notification;