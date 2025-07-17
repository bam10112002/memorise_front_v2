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
      console.log('WebSocket подключен');
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
        console.error('Ошибка обработки сообщения WebSocket:', error);
        setWsError('Ошибка получения данных альбома');
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('Ошибка WebSocket:', error);
      setWsError('Ошибка подключения к серверу');
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket отключен');
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
      setTimeout(() => setUploadStatus(''), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('album_id', id);

    try {
      setUploadStatus('Загрузка...');
      const response = await fetch(`https://213.176.65.159.nip.io/albums/tg-upload/${id}`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });

      if (!response.ok) {
        throw new Error(`Ошибка загрузки: ${response.statusText}`);
      }

      const data = await response.json();
      setUploadStatus(`Медиа успешно загружено`);
      fileInputRef.current.value = '';
      setTimeout(() => setUploadStatus(''), 3000);
    } catch (error) {
      setUploadStatus(`Ошибка: ${error.message}`);
      setTimeout(() => setUploadStatus(''), 3000);
    }
  };

  const handleFileSelect = () => {
    if (window.Telegram?.WebApp) {
      fileInputRef.current.click();
    } else {
      fileInputRef.current.click();
    }
  };

  const handleShareClick = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.openTelegramLink(
        "https://t.me/share/url?url=https://t.me/memorise_photo_bot?start=" + id
      );
    } else {
      alert("Telegram WebApp не найден.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-md sm:max-w-lg md:max-w-4xl relative">
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
          <div id="media-gallery" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {albumData.media.length > 0 ? (
              albumData.media.map((media, index) => (
                <div key={index} className="rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow p-0 m-0 overflow-hidden aspect-[3/4]">
                    <img src={media} alt = {`Медиа ${index + 1}`} className="w-full h-full object-cover rounded-md" loading="lazy"/>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                Медиа отсутствуют
              </p>
            )}
          </div>
          <button
            onClick={handleFileSelect}
            className="fixed bottom-6 right-6 bg-blue-600 text-white text-2xl font-bold w-14 h-14 rounded-full flex items-center justify-center hover:bg-blue-700 transition duration-200 shadow-lg"
          >
            +
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,video/*"
            className="hidden"
            onChange={uploadFile}
          />
          {uploadStatus && (
            <div
              id="upload-status"
              className={`fixed bottom-20 right-6 px-4 py-2 rounded-md shadow-lg transition-opacity duration-300 ${
                uploadStatus.includes('Ошибка')
                  ? 'bg-red-500 text-white'
                  : uploadStatus.includes('успешно')
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {uploadStatus}
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:gap-3 sm:flex-wrap justify-center mt-6">
            <button
              onClick={handleShareClick}
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