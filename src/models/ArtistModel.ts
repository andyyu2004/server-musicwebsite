type id = number;

export default interface ArtistModel{
  artistid: id;
  artist: string;
  userid: id;
  albumCount?: number;
  trackCount?: number;
}