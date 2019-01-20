import * as mysql from 'mysql';

// mysql -u RDS_username -p -h RDS_endpoint
let pool;

if (process.env.USE_RDS !== '0') {
  console.log("Using RDS");
  pool = mysql.createPool({
    connectionLimit: 10, 
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
    port: 3306,
  });
} else {
  console.log("Using Local DB")
  pool = mysql.createPool({
    connectionLimit: 10, 
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
}


pool.on('connection', conn => console.log("Mysql connected"));

pool.on('error', err => console.log(err));

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
