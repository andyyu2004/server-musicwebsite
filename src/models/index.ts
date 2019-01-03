export { default as TrackModel } from './TrackModel';
export { default as AlbumModel } from './AlbumModel';
export { default as ArtistModel } from './ArtistModel';
export { default as UserModel } from './UserModel';

/* 
Plan Data Structure

{
  artists: {
    id0: artistOPbj0 :: ArtistType,
  },
  album: {
    id0: albumObj0 :: AlbumType,
  },
  tracks: {
    id0: trackObj0 :: TrackType,
    id1: trackObj1,
    ...
  },
}

interface ArtistType = {
  uid :: ID; 
  name :: string;
  albums: [album0.id, album1.id, ... ] :: [ ID ];
  
}

interface AlbumType = {
  uid :: ID;
  artist :: string;
  name :: string;
  tracks : [track0.id, track1.id, ... ] :: [ ID ];
  year :: number;
}

interface TrackType = {
  uid :: ID;
  artist :: ID;
  album :: ID; 
  title :: string;
  length :: number;
  genre :: string; // Show genre as mixed if not all tracks are the same
  trackNumber :: number;
  lyrics :: string;
  comments: string;
  bitrate:: number;
  filepath? :: string;
  artwork? :: ?;

}

create table Tracks (
	id char(36) NOT NULL,
  artist char(36),
  album char(36),
  title varchar(100),
  length tinyint unsigned,
  genre varchar(50),
  trackNumber tinyint unsigned,
  lyrics text,,
  comments varchar(256),
  bitrate smallint,
  filepath varchar(256)
);
// */

