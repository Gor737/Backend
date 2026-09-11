const fs = require("node:fs/promises");

const readFile = async(filePath) => {
    try{
        const data = await fs.readFile(filePath, 'utf-8');
        const parsedData = JSON.parse(data);
        return parsedData;
    }catch(err){
        throw err;
    }
}


const writeFile = async(filePath, data) => {
    try{
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }catch(err){
        throw err;
    }
}


module.exports = {readFile, writeFile};