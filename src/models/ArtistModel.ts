type id = number;

export default interface ArtistModel{
  artistid: id;
  artistname: string;
  albumCount?: number;
  trackCount?: number;
}