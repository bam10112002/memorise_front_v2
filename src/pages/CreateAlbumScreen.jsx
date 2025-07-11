import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlbumService from '@/services/AlbumService'; // Adjust the import path as needed

const CreateAlbumScreen = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`); // Debug log
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (!formData.title) {
        throw new Error('Album name is required');
      }
      await AlbumService.createAlbum(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to save album');
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
        <h1 className="text-2xl sm:text-3xl font-bold text-center">Создать альбом</h1>
      </div>
      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          id="album-name"
          name="title"
          placeholder="Название альбома"
          value={formData.title}
          onChange={handleInputChange}
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Название альбома"
        />
        <input
          type="date"
          id="album-date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Дата события"
        />
        <textarea
          id="album-description"
          name="description"
          placeholder="Описание (опционально)"
          value={formData.description}
          onChange={handleInputChange}
          className="p-3 border border-gray-300 rounded-lg w-full h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Описание альбома"
        />
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <div className="fixed bottom-4 left-4 right-4 sm:static sm:flex sm:gap-3">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white p-3 rounded-lg w-full sm:w-auto hover:bg-blue-600"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default CreateAlbumScreen;