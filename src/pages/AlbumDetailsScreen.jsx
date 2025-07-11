import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AlbumDetailsScreen = ({showNotification}) => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-6 max-w-md sm:max-w-lg md:max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate('/')}
          className="text-blue-500 font-semibold hover:text-blue-600"
        >
          ← Назад
        </button>
        <div></div>
      </div>
      <h1 id="album-title" className="text-2xl sm:text-3xl font-bold text-center mb-4">
        Название альбома {id}
      </h1>
      <p id="album-description" className="text-gray-500 text-sm mb-2 text-center">
        Описание:
      </p>
      <p id="album-date" className="text-gray-500 text-sm mb-4 text-center">Дата:</p>
      <div id="media-gallery" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <div
          onClick={() => navigate('/media/media1')}
          className="bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
        >
          <img
            src="https://cdn.culture.ru/images/f0d6fa8f-816a-59be-9240-3cda95339b63"
            alt="Фото 1"
            className="w-full h-32 object-cover rounded-md"
          />
        </div>
        <div
          onClick={() => navigate('/media/media2')}
          className="bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
        >
          <img
            src="https://inbusiness.kz/uploads/25/images/E9PTDEIU.jpg"
            alt="Фото 2"
            className="w-full h-32 object-cover rounded-md"
          />
        </div>
      </div>
      <div className="fixed bottom-4 left-4 right-4 sm:static sm:flex sm:gap-3 sm:flex-wrap">
        <button
          onClick={() => showNotification('Функция будет доступна в Telegram miniApp')}
          className="bg-blue-500 text-white p-3 rounded-lg w-full sm:w-auto mb-2 sm:mb-0 hover:bg-blue-600"
        >
          + Добавить медиа
        </button>
        <button
          onClick={() => showNotification('Функция будет доступна в Telegram miniApp')}
          className="bg-blue-300 text-white p-3 rounded-lg w-full sm:w-auto mb-2 sm:mb-0 hover:bg-blue-400"
        >
          Пригласить
        </button>
      </div>
    </div>
  );
};

export default AlbumDetailsScreen;