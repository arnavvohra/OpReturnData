const {Pool} = require('pg');
const {tableName} = require('../../config');
const {dbConfig} = require('../../config');

const pool = new Pool(dbConfig);

const getOpReturnData = async (req, res) => {
  try{
    const opReturnData = req.params.opReturnData;
    console.log("Returning results for opreturn value : ",opReturnData);
    let results = await pool.query(`select txhash, blockhash from ${tableName} where opreturn = ($1)`, [opReturnData]); 
    if (results.rows.length ===0){
      res.status(404).json("OP_RETURN value doesn't exist");
    }
    else{
      res.status(400).json(results.rows);
    }
  }
  catch(error){ res.status(404).json({error : error}); } 
}

const postOpReturnData = async (opReturnData, txhash, blockhash, blockheight) => {
  await pool.query(`insert into ${tableName} (opreturn, txhash, blockhash, blockheight) values ($1, $2, $3, $4)`, 
  [opReturnData, txhash, blockhash, blockheight]);
}

const getLastBlockHeight = async () => {
    let results = await pool.query(`select blockheight from ${tableName} order by created_at desc limit 1`);
    let blockHeight = results.rows[0].blockheight;
    blockHeight = parseInt(blockHeight);
    return blockHeight;
}

module.exports = {getOpReturnData, postOpReturnData, getLastBlockHeight};