import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import WS_BASE_URL from '@/services/conf';
import { useLogin } from '@/services/AuthContext';

const AlbumDetailsScreen = ({ showNotification }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [albumData, setAlbumData] = useState({ title: '', description: '', date: '', media: [] });
  const [wsError, setWsError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
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

  const uploadFile = async () => {
    const file = fileInputRef.current.files[0];
    setUploadStatus('');

    if (!file) {
      setUploadStatus('Пожалуйста, выберите файл для загрузки.');
      return;
    }

    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    if (!userId) {
      setUploadStatus('ID пользователя не найден. Убедитесь, что Telegram WebApp инициализирован.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);
    formData.append('album_id', id);

    try {
      setUploadStatus('Загрузка...');
      const response = await fetch(`https://213.176.65.159.nip.io/albums/upload/${id}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.statusText}`);
      }

      const data = await response.json();
      setUploadStatus(`Файл успешно загружен! ID файла: ${data.file_id}`);
      fileInputRef.current.value = ''; // Clear input
    } catch (error) {
      setUploadStatus(`Ошибка: ${error.message}`);
    }
  };

  // Функция для обработки клика по кнопке выбора файла
  const handleFileSelect = () => {
    if (window.Telegram?.WebApp) {
      // Если доступен Telegram WebApp, можно добавить дополнительную логику
      fileInputRef.current.click(); // Программно вызываем клик по input
    } else {
      fileInputRef.current.click(); // Обычный вызов для не-Telegram окружения
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
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Загрузить медиа</h2>
            <div className="flex flex-col gap-4">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,video/*" // Ограничиваем выбор изображениями и видео
                className="hidden" // Скрываем стандартный input
                onChange={uploadFile} // Автоматически загружаем после выбора
              />
              <button
                onClick={handleFileSelect}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Выбрать из галереи
              </button>
            </div>
            {uploadStatus && (
              <p
                id="upload-status"
                className={`mt-4 text-center ${
                  uploadStatus.includes('Ошибка')
                    ? 'text-red-500'
                    : uploadStatus.includes('успешно')
                    ? 'text-green-500'
                    : 'text-blue-500'
                }`}
              >
                {uploadStatus}
              </p>
            )}
          </div>
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
                      src={`https://213.176.65.159.nip.io/albums${media.url}`}
                      alt={media.alt || `Медиа ${index + 1}`}
                      className="w-full aspect-[4/3] object-contain rounded-md"
                    />
                  ) : (
                    <video
                      src={`https://213.176.65.159.nip.io/albums${media.url}`}
                      alt={media.alt || `Медиа ${index + 1}`}
                      className="w-full aspect-[4/3] object-contain rounded-md"
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
          <div className="flex flex-col sm:flex-row sm:gap-3 sm:flex-wrap justify-center mt-6">
            <button
              onClick={() => showNotification('Функция будет доступна в Telegram miniApp')}
              className="bg-blue-300 text-white p-3 rounded-lg w-full sm:w-auto mb-2 sm:mb-0 hover:bg-blue-400"
            >
              Пригласить
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AlbumDetailsScreen;