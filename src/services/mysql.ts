import * as mysql from 'mysql';

//type QueryResult = [any?, mysql.FieldInfo[]?]
// mysql -u RDS_username -p -h RDS_endpoint

const pool = mysql.createPool({
  connectionLimit: 10, 
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
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
