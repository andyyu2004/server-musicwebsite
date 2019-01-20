type id = number;

export default interface AlbumModel {
  albumid: id;
  album: string;
  artistid: id;
  userid: id;
  year?: number;
  trackCount?: number;
}
