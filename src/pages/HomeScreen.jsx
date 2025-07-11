import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DateFilterSelect from '@/components/home-components/DateFilterSelect';
import AlbumCard from '@/components/home-components/AlbumCard';
import AlbumService from '@/services/AlbumService'; // Adjust the import path as needed

const HomeScreen = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await AlbumService.listAlbums();
        setAlbums(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch albums');
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-md sm:max-w-lg md:max-w-4xl">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          id="search-input"
          placeholder="Поиск по названию..."
          className="p-3 border border-gray-300 rounded-lg w-full sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Поиск альбомов"
        />
        <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-1/3">
          <DateFilterSelect />
          <Link
            to="/create-album"
            className="bg-blue-300 text-white p-3 rounded-lg w-full hover:bg-blue-400 text-center block"
          >
            + Добавить
          </Link>
        </div>
      </div>
      <div id="album-list" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading && <p>Loading albums...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && albums.length === 0 && <p>No albums found.</p>}
        {!loading &&
          albums.map((album) => (
            <AlbumCard
              key={album.id}
              to={`/album/${album.id}`}
              imageSrc={album.main_img}
              title={album.title}
              date={album.date}
            />
          ))}
      </div>
    </div>
  );
};

export default HomeScreen;