export type GoogleAlbum = {
  id: string;
  title: string;
  product_url: string;
  isWriteable: boolean;
  media_items_count: string;
  cover_photo_base_url: string;
  cover_photo_media_item_id: string;
  share_info: ShareInfo;
};
export type ShareInfo = {
  shareable_url: string;
  share_token: string;
  is_joined: boolean;
  is_owned: boolean;
  is_joinable: boolean;
  shared_album_options: SharedAlbumOptions;
};
export type SharedAlbumOptions = {
  is_collaborative: boolean;
  is_commentable: boolean;
};
