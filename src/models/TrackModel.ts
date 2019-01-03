
type id = number;

export default interface TrackModel {
  trackid: id;
  filename: string;
  encoding: string;
  length?: number;
  title?: string;
  artist?: id;
  album?: id;
  genre?: string;
  trackNumber?: number;
  lyrics?: string;
  comments?: string;
  bitrate?: number;
}