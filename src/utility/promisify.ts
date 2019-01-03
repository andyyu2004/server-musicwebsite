export default function promisify(fn): (...any) => Promise<any> {
  return (...params) => new Promise((resolve, reject) => {
    fn(...params, (err, res?: any) => {
      if(err) {
        reject(err)
      }
      resolve(res)
    });
  });
}