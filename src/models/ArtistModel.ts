type id = number;

export default interface ArtistModel{
  artistid: id;
  artistname: string;
  userid: id;
  albumCount?: number;
  trackCount?: number;
}