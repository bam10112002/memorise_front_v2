import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import WS_BASE_URL from '@/services/conf';

const AlbumDetailsScreen = ({ showNotification }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [albumData, setAlbumData] = useState({ title: '', description: '', date: '', media: [] });
  const [wsError, setWsError] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE_URL}/albums/ws/${id}`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setWsError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setAlbumData({
          title: data.title || `Название альбома ${id}`,
          description: data.description || 'Описание отсутствует',
          date: data.date || 'Дата не указана',
          media: data.media || []
        });
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        setWsError('Ошибка получения данных альбома');
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsError('Ошибка подключения к серверу');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWsError('Соединение с сервером разорвано');
    };

    return () => {
      ws.close();
    };
  }, [id]);

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
      {wsError ? (
        <p className="text-red-500 text-center mb-4">{wsError}</p>
      ) : (
        <>
          <h1 id="album-title" className="text-2xl sm:text-3xl font-bold text-center mb-4">
            {albumData.title}
          </h1>
          <p id="album-description" className="text-gray-500 text-sm mb-2 text-center">
            Описание: {albumData.description}
          </p>
          <p id="album-date" className="text-gray-500 text-sm mb-4 text-center">
            Дата: {albumData.date}
          </p>
          <div id="media-gallery" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {albumData.media.length > 0 ? (
              albumData.media.map((media, index) => (
                <div
                  key={index}
                  onClick={() => navigate(`/media/${media.id}`)}
                  className="bg-white rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"
                >
                  <img
                    src={media.url || 'https://avatars.mds.yandex.net/i?id=fa44ca26af14671d6bcc67a7f2f9644dbcddda5b-4899615-images-thumbs&n=13'}
                    alt={media.alt || `Медиа ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                Медиа отсутствуют
              </p>
            )}
          </div>
        </>
      )}
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