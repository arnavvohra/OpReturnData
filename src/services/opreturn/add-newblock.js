const {addMultipleBlocks} = require('./add-multipleblocks');
//Function for adding OP_RETURN data of newly mined blocks
const addNewMinedBlocksOpReturnData = async (newMinedBlockHeight, endBlockHeight, bitcoindClient ,dbQueries) => {
        const lastBlockHeight = await dbQueries.getLastBlockHeight();// Gets the block height of the latest added transaction to db
        //Add newly mined blocks only when we are finished with our first task of adding blocks till endBlockHeight.
        if(lastBlockHeight >= endBlockHeight){
            console.log(`Inserting Opreturn Data of new MINED blocks from height ${lastBlockHeight} to ${newMinedBlockHeight}`);
            await addMultipleBlocks(lastBlockHeight, newMinedBlockHeight, bitcoindClient, dbQueries);
        }
    }

module.exports = {addNewMinedBlocksOpReturnData};