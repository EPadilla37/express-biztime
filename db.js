/** Database setup for BizTime. */
const { Client } = require('pg'); 

const DB_URI = process.env.NODE_ENV === ' test' 
    ? 'postgresql:///biztime_test'
    : 'postgresql:///biztime'; 

    const db = new Client({
        user: 'postgres',
        password: 'padilla',
        host: 'localhost', // Change this to your PostgreSQL server's hostname or IP address
        port: 5432,        // Change this to your PostgreSQL server's port
        database: 'biztime'
    }); 

db.connect(); 

module.exports = db; 
