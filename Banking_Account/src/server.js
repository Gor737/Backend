const app = require('./app');
const { getPool, isExistDb } = require('./config/database');
const {PORT} = require('./config/env');


const start = async () => {
    try{ 
        await isExistDb();
        getPool();
    
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        })
    }catch(err){
        console.log(err.message);
        process.exit(1);
    }
}

start();