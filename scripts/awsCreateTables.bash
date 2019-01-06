mysql -h musicdb.cfdmamy6mjtj.ap-southeast-2.rds.amazonaws.com -P 3306 -u andyyu2004 -p
 <<QUERY

use musicwebsite;

create table Tracks (
	trackid bigint unsigned primary key,
	filename varchar(256) NOT NULL,
	encoding varchar(50) NOT NULL,
	title varchar(100),
	length smallint unsigned,
	artist bigint unsigned NOT NULL,
	album bigint unsigned NOT NULL,
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
