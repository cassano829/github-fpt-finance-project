import axios from 'axios';
import { GoogleAlbum } from 'types/google-photo';
import { getGoogleAccessToken } from 'utils/utils';
import request from 'utils/axios';
type Parameter = Partial<{
  pageSize: number;
  pageToken: string;
  excludeNonAppCreatedData: boolean;
}>;

type GooglePhotoAlbum = {
  title: string;
};

const googlePhotoAxios = axios.create({
  baseURL: 'https://photoslibrary.googleapis.com/v1'
});

googlePhotoAxios.interceptors.request.use((options) => {
  const { method } = options;
  const token = getGoogleAccessToken();
  options.headers['Authorization'] = `Bearer ${token}`;

  if (method === 'put' || method === 'post') {
    Object.assign(options.headers, {
      'Content-Type': 'application/json;charset=UTF-8'
    });
  }

  return options;
});

export const getAllAlbums = (params: Parameter = {}) => {
  return googlePhotoAxios.get<{ albums: GoogleAlbum[] }>('/albums', {
    params: {
      excludeNonAppCreatedData: true,
      ...params
    }
  });
};

export const getAlbumById = (albumId: string) => {
  return googlePhotoAxios.get<GoogleAlbum>(`/albums/${albumId}`, {});
};

export const getAlbumsOfBrand = (params: Parameter = {}) => {
  return request.get<{ albums: GoogleAlbum[] }>('/brands/google-albums', {
    params: {
      excludeNonAppCreatedData: true,
      ...params
    }
  });
};
export const createAlbum = (albumData: any) => {
  return googlePhotoAxios.post<GoogleAlbum>('/albums', {
    album: albumData
  });
};
export const createAlbumOfBrand = (albumData: any) => {
  return request.post<GoogleAlbum>('/brands/google-albums', albumData);
};
const googlePhotoApi = {
  createAlbum,
  getAlbumById,
  getAllAlbums,
  getAlbumsOfBrand,
  createAlbumOfBrand
};

export default googlePhotoApi;
