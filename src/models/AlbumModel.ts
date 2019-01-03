type id = number;

export default interface AlbumModel {
  albumid: id;
  albumname: string;
  artist: id;
  year?: number;
  trackCount?: number;
}
