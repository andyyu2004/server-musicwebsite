mysql -u root -p <<QUERY

use musicwebsite;

create table Users (
	email varchar(70) primary key,
	password varchar(1024) NOT NULL,
	salt varchar(256) NOT NULL,
	name varchar(100)
);

create table Tracks (
	trackid bigint unsigned primary key,
	filename varchar(256) NOT NULL,
	encoding varchar(50) NOT NULL,
	artist bigint unsigned NOT NULL,
	album bigint unsigned NOT NULL,
	user varchar(70) NOT NULL,
	title varchar(100),
	length smallint unsigned,
	genre varchar(50),
	trackNumber tinyint unsigned,
	lyrics text,
	comments varchar(256),
	bitrate smallint
);

create table Albums (
	albumid bigint unsigned primary key,
    albumname varchar(100) NOT NULL,
    artist bigint unsigned NOT NULL,
    year smallint unsigned,
    trackcount tinyint unsigned
);

create table Artists (
	artistid bigint unsigned primary key,
    artistname varchar(100) NOT NULL
);

QUERY
