import * as mysql from 'mysql';

//type QueryResult = [any?, mysql.FieldInfo[]?]

const pool = mysql.createPool({
  connectionLimit: 10, 
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'music',
});

export default async function query(query, ...params): Promise<any[]> {
  return new Promise((resolve, reject) => {
    pool.query(query, ...params, (err, res: any[], fields) => {
      if(err) {
        reject(err)
      }
      resolve(res)
    })
  })
}
