
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {WS_BASE_URL, API_BASE_URL} from '@/services/conf';
import { useLogin } from '@/services/AuthContext';

const AlbumDetailsScreen = ({ showNotification }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [albumData, setAlbumData] = useState({ title: '', description: '', date: '', media: [] });
  const [wsError, setWsError] = useState(null);
  const fileInputRef = useRef(null);
  const wsRef = useRef(null);
  const { login } = useLogin();
  const jwt = login.jwt;

  useEffect(() => {
    wsRef.current = new WebSocket(`${WS_BASE_URL}/albums/ws?album=${id}&token=${jwt}`);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setWsError(null);
    };

    wsRef.current.onmessage = (event) => {
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

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsError('Ошибка подключения к серверу');
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      setWsError('Соединение с сервером разорвано');
    };

    return () => {
      wsRef.current.close();
    };
  }, [id, jwt]);

  const handleAddMedia = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0 && wsRef.current.readyState === WebSocket.OPEN) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileType = file.type.startsWith('image/') ? 'addPhoto' : 
                          file.type.startsWith('video/') ? 'addVideo' : null;
          
          if (fileType) {
            const message = {
              type: fileType,
              albumId: id,
              file: e.target.result.split(',')[1], // Remove data URI prefix
              fileName: file.name,
              mimeType: file.type
            };
            
            try {
              wsRef.current.send(JSON.stringify(message));
              showNotification('Медиа отправлено, ожидается обработка');
            } catch (error) {
              console.error('Error sending file:', error);
              showNotification('Ошибка при отправке медиа');
            }
          } else {
            showNotification('Неподдерживаемый тип файла');
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      showNotification('Не удалось отправить медиа: соединение не установлено');
    }
  };

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
                  {media.type.startsWith('image/') ? (
                    <img
                      src={media.url}
                      alt={media.alt || `Медиа ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  ) : (
                    <video
                      src={`${API_BASE_URL}${media.url}`}
                      alt={media.alt || `Медиа ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                      controls
                    />
                  )}
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
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={handleAddMedia}
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