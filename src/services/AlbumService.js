import axios from 'axios';
import API_BASE_URL from './conf.js';

const AlbumService = {
  async createAlbum(album) {
    const response = await axios.post(`${API_BASE_URL}/albums/`, album);
    return response.data;
  },

  async listAlbums() {
    const response = await axios.get(`${API_BASE_URL}/albums/`);
    return response.data;
  },

  async getAlbum(id) {
    const response = await axios.get(`${API_BASE_URL}/albums/${id}`);
    return response.data;
  }
};

export default AlbumService;
