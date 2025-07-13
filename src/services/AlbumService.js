import axios from 'axios';
import API_BASE_URL from './conf.js';

const AlbumService = {
  async createAlbum(album, jwt) {
    const response = await axios.post(`${API_BASE_URL}/albums/`, album, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data;
  },

  async listAlbums(jwt) {
    const response = await axios.get(`${API_BASE_URL}/albums/`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data;
  },

  async getAlbum(id, jwt) {
    const response = await axios.get(`${API_BASE_URL}/albums/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    });
    return response.data;
  }
};

export default AlbumService;
