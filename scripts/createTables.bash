mysql -u root -ppassword <<QUERY

use musicwebsite;

ALTER DATABASE musicwebsite CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

create table Users (
	userid bigint unsigned primary key,
	password varchar(1024) NOT NULL,
	salt varchar(256) NOT NULL,
	email varchar(70) NOT NULL,
	name varchar(100)
);

create table Artists (
	artistid bigint unsigned primary key,
  artistname varchar(100) NOT NULL,
	userid bigint unsigned NOT NULL,
	foreign key(userid) references Users(userid)
);

create table Albums (
	albumid bigint unsigned primary key,
	albumname varchar(100) NOT NULL,
	artist bigint unsigned NOT NULL,
	foreign key(artist) references Artists(artistid),
	userid bigint unsigned NOT NULL,
	foreign key(userid) references Users(userid),
	year smallint unsigned,
	trackcount tinyint unsigned
);

create table Tracks (
	trackid bigint unsigned primary key,
	artist bigint unsigned NOT NULL,
	foreign key(artist) references Artists(artistid),
	album bigint unsigned NOT NULL,
	foreign key(album) references Albums(albumid),
	userid bigint unsigned NOT NULL,
	foreign key(userid) references Users(userid),
	encoding varchar(50) NOT NULL,
	title varchar(100),
	filename varchar(256) NOT NULL,
	length smallint unsigned,
	genre varchar(50),
	trackNumber tinyint unsigned,
	lyrics text,
	comments varchar(256),
	bitrate smallint
);

create table UserTracks (
	userid bigint unsigned NOT NULL,
	foreign key(userid) references Users(userid),
	trackid bigint unsigned NOT NULL,
	foreign key(trackid) references Tracks(trackid),
	primary key (userid, trackid)
);

QUERY
