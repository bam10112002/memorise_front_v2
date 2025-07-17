import React from 'react';

const InviteButton = ({ albumId }) => {
  const handleShareClick = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.openTelegramLink(
        `https://t.me/share/url?url=https://t.me/memorise_photo_bot?start=${albumId}`
      );
    } else {
      alert("Telegram WebApp не найден.");
    }
  };

  return (
    <button
      onClick={handleShareClick}
      className="bg-blue-300 text-white p-3 rounded-lg w-full sm:w-auto mb-2 sm:mb-0 hover:bg-blue-400"
    >
      Пригласить
    </button>
  );
};

export default InviteButton;