mysql -u root -ppassword <<QUERY

drop database musicwebsite;
create database musicwebsite;
use musicwebsite; 

# drop table if exists UserTracks;
# drop table if exists Tracks;
# drop table if exists Albums;
# drop table if exists Artists;
# drop table if exists Users;

QUERY
