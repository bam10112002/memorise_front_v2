import React from 'react';

const MediaGallery = ({ media }) => {
  return (
    <div id="media-gallery" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      {media.length > 0 ? (
        media.map((media, index) => (
          <div key={index} className="rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow p-0 m-0 overflow-hidden aspect-[3/4]">
            <img src={media} alt={`Медиа ${index + 1}`} className="w-full h-full object-cover rounded-md" loading="lazy" />
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center col-span-full">
          Медиа отсутствуют
        </p>
      )}
    </div>
  );
};

export default MediaGallery;