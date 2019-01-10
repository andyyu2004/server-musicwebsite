import { getAllTracks, getTrackFile, getFileStream } from '../repositories/track';
import { getAllAlbums } from '../repositories/album';
import { getFileS3 } from '../services/aws';
import { Request, Response } from 'express';
import * as fuzzy from 'fuzzyset.js';

// Should log all errors to err file 

async function getTracksInfo(req: Request, res: Response) {
  const { userid } = req.authInfo;
  console.log("Fetch All Tracks For User ", req.user);
  try {
    const allTracks = await getAllTracks(userid).catch(err => { throw err; });
    res.status(200).send(allTracks);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
}

async function getAlbumsInfo(req: Request, res: Response) {
  const { userid } = req.authInfo;
  try {
    const allAlbums = await getAllAlbums(userid).catch(err => { throw err; });
    res.status(200).send(allAlbums);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
}

async function getTrack(req: Request, res: Response) {
  const { userid } = req.authInfo;
  try {
    console.log("Streaming Track");
    const { id, encoding } = req.params;
    const [stream, fileSize] = await getFileStream(userid, encoding, id).catch(err => { throw err; });
    const head = {
      'Content-Length': fileSize,
      'Content-Type': `audio/${encoding}`,
    }
    res.writeHead(200, head);
    return stream.pipe(res);  
  } catch (err) {
    return res.status(500).send(err);
  }
}

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
  catch(err) {
    torrentClient.destroy();
    return res.status(500).send(err);
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
};