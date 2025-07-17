import React, { useRef } from 'react';

const FileUploader = ({ albumId, jwt, setUploadStatus, uploadStatus }) => {
  const fileInputRef = useRef(null);

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
    formData.append('album_id', albumId);

    try {
      setUploadStatus('Загрузка...');
      const response = await fetch(`https://213.176.65.159.nip.io/albums/tg-upload/${albumId}`, {
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
      setUploadStatus(`Медиа успешно загружено:}`);
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

  return (
    <>
      <button
        onClick={handleFileSelect}
        className="fixed bottom-6 right-6 bg-blue-600 text-white text-2xl font-bold w-14 h-14 rounded-full flex items-center justify-center hover:bg-blue-700 transition duration-200 shadow-lg"
      >
        +
      </button>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        multiple
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
    </>
  );
};

export default FileUploader;