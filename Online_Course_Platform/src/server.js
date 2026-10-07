const app = require('./app');
require('./models');
const {PORT} = require('./config/env');
const { ensureDatabaseExists, sequelize } = require('./config/database');

const start = async () => {
    try{
        await ensureDatabaseExists();
        await sequelize.authenticate();
        await sequelize.sync({alter:true});
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    }catch(err){
        console.log(err.message);
        process.exit(1);
    }
}

start();
