import { IAudioMetadata } from 'music-metadata'
type id = number;

export default interface TrackModel {
  trackid: id;
  filename: string;
  encoding: string;
  albumid: id;
  artistid: id;
  userid: id;
  length?: number;
  title?: string;
  genre?: string;
  trackNumber?: number;
  lyrics?: string;
  comments?: string;
  bitrate?: number;
}

export interface AudioMetadata extends IAudioMetadata {
  filename?: string
}