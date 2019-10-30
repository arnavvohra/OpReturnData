const {addSingleBlockOpReturnData} = require('./add-singleblock');
//Function for adding OP_RETURN data of newly mined blocks
const addMultipleBlocks = async (startHeight, endHeight, bitcoindClient, dbQueries) => {
        for (let currentblockHeight = startHeight; currentblockHeight <= endHeight; currentblockHeight++ ){
            const blockHash = await bitcoindClient.getBlockHash(currentblockHeight);
            const block = await bitcoindClient.getBlock(blockHash);
            await addSingleBlockOpReturnData(block, bitcoindClient, dbQueries);
            }
        }

module.exports = {addMultipleBlocks};