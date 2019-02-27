import { getAllTracks, getTrackFile, getFileStream } from '../repositories/track';
import { getAllAlbums, getAlbumById } from '../repositories/album';
import { getFileS3 } from '../services/aws';
import * as HttpStatus from 'http-status-codes';
import { Request, Response } from 'express';
import * as fuzzy from 'fuzzyset.js';
import { getArtists, getArtistById } from '../repositories/artist';

// Should log all errors to err file 

async function getTracksInfo(req: Request, res: Response) {
  const { userid } = req.authInfo;
  console.log("Fetch All Tracks For User ", req.user);
  try {
    const allTracks = await getAllTracks(userid).catch(err => { throw err; });
    res.status(HttpStatus.OK).json(allTracks);
  } catch (error) {
    console.log(error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
  }
}

async function getAlbumsInfo(req: Request, res: Response) {
  const { userid } = req.authInfo;
  try {
    const allAlbums = await getAllAlbums(userid).catch(err => { throw err; });
    res.status(200).send(allAlbums);
  } catch (err) {
    console.log(err);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
  }
}

async function getTrack(req: Request, res: Response) {
  const { userid } = req.authInfo;
  // console.log(req.headers);
  try {
    console.log("Streaming Track");
    const { id, encoding } = req.params;
    const [stream, fileSize] = await getFileStream(userid, encoding, id).catch(err => { throw err; });
    const head = {
      'content-length': fileSize,
      'content-type': `audio/${encoding.substring(1)}`,
      'accept-ranges': 'bytes'
    }
    res.writeHead(HttpStatus.OK, head);
    return stream.pipe(res);  
  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function getAlbum(req: Request, res: Response) {
  const { userid } = req.authInfo;
  const { id } = req.params;
  try {
    const album = await getAlbumById(userid, id);
    res.status(HttpStatus.OK).send(album);
  } catch(error) {
    console.log(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error});
  }
}

async function getArtist(req: Request, res: Response) {
  const { userid } = req.authInfo;
  const { id } = req.params;
  try {
    const artist = await getArtistById(userid, id);
    res.status(HttpStatus.OK).send(artist);
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
  }
}

async function getArtistInfo(req: Request, res: Response) {
  const { userid } = req.authInfo;
  try {
    const artists = await getArtists(userid);
    console.log(artists);
    res.send(artists);
  } catch(error) {
    console.log(error);
    res.json({ error });
  }
}

// Torrent

function normaliseFileName(fname) {
  return fname.split('.').slice(0, -1).join('.')
}

async function getTrackByMagnet(req: any, res: Response) {
  console.log(req.params);
  const torrentClient = req.torrentClient;
  const { magnetURI, fileName } = req.params;

  try {
    torrentClient.add('magnet:?' + magnetURI, torrent => {
      console.log('Client is downloading:', torrent.infoHash)
      if(!torrent.files.length) {
        return res.status(404).send(`No files found in torrent!`)
      }
      torrent.files.forEach(file => file.deselect());
      const names = fuzzy(torrent.files.map(a => normaliseFileName(a.name)))

      console.log('got', names.get(fileName, [[0, 'shit']], 0))
      const [[, maximalMatch], ] = names.get(fileName, [[0, 'shit']], 0)
      const file = torrent.files.find(a => normaliseFileName(a.name) === maximalMatch);

      if(!file) {
        return res.status(404).send(`No match for track name!`)
      }

      console.log(file.name);
      const stream = file.createReadStream();
      stream.on('end', () => {
        console.log(file.name, 'is finished downloading!')
        torrentClient.destroy();
      })
      stream.on('error', () => {
        console.log('torrent has errored!')
        torrentClient.destroy();
      })
      console.log('Started streaming ', file.name);

      const head = {
        // 'Content-Type': `audio/${encoding}`,
        filename: file.name,
      };
      res.writeHead(200, head);
      stream.pipe(res);
    });
  }
  catch(error) {
    torrentClient.destroy();
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });
  }
}

// async function getTrack(req: Request, res: Response) {
//   try {
//     const { id } = req.params;
//     // const data = <any> await getTrackFile(filename);
//     // const file = data.body;
//     // console.log(data);
//     // res.set('content-type', 'audio/mp3');
//     // res.set('accept-ranges', 'bytes');
//     // res.status(200).send(data);
//   } catch (err) {
//     return res.status(500).send(err);
//   }
// }

export { 
  getTracksInfo,
  getAlbumsInfo,
  getTrack,
  getTrackByMagnet,
  getAlbum,
  getArtistInfo,
  getArtist,
};