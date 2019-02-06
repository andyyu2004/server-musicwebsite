import { IAudioMetadata } from 'music-metadata'
type id = number;

export default interface TrackModel {
  trackid: id;
  filename: string;
  encoding: string;
  albumid: id;
  artistid: id;
  userid: id;
  duration: number;
  sampleRate?: number;
  bitrate?: number;
  bitdepth?: number;
  title?: string;
  genre?: string;
  trackNumber?: number;
  lyrics?: string;
  comments?: string;
}

export interface AudioMetadata extends IAudioMetadata {
  filename?: string
}