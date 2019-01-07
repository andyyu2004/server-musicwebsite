
type id = number;

export default interface TrackModel {
  trackid: id;
  filename: string;
  encoding: string;
  album: id;
  artist: id;
  userid: id;
  length?: number;
  title?: string;
  genre?: string;
  trackNumber?: number;
  lyrics?: string;
  comments?: string;
  bitrate?: number;
}