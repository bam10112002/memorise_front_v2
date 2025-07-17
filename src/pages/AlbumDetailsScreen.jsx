import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import WS_BASE_URL from '@/services/conf';
import { useLogin } from '@/services/AuthContext';

import FileUploader from '@/components/album-details/FileUploader';
import MediaGallery from '@/components/album-details/MediaGallery';
import InviteButton from '@/components/album-details/InviteButton';

const AlbumDetailsScreen = ({ showNotification }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [albumData, setAlbumData] = useState({ title: '', description: '', date: '', media: [] });
  const [wsError, setWsError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const { login } = useLogin();
  const jwt = login.jwt;

  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE_URL}/albums/ws?album=${id}&token=${jwt}`);

    ws.onopen = () => {
      console.log('WebSocket подключен');
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
        console.error('Ошибка обработки сообщения WebSocket:', error);
        setWsError('Ошибка получения данных альбома');
      }
    };

    ws.onerror = (error) => {
      console.error('Ошибка WebSocket:', error);
      setWsError('Ошибка подключения к серверу');
    };

    ws.onclose = () => {
      console.log('WebSocket отключен');
      setWsError('Соединение с сервером разорвано');
    };

    return () => {
      ws.close();
    };
  }, [id, jwt]);

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
          <MediaGallery media={albumData.media} />
          <FileUploader
            albumId={id}
            jwt={jwt}
            setUploadStatus={setUploadStatus}
            uploadStatus={uploadStatus}
          />
          <div className="flex flex-col sm:flex-row sm:gap-3 sm:flex-wrap justify-center mt-6">
            <InviteButton albumId={id} />
          </div>
        </>
      )}
    </div>
  );
};

export default AlbumDetailsScreen;