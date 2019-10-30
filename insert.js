require('dotenv').config();
const zeromq = require('zeromq'), sock = zeromq.socket('sub');
const BitcoinCore = require('bitcoin-core');
const {startHeight} = require('./config');
const {bitcoindClientConfig} = require('./config');
const{zeromqTCP} = require('./config');
const models = require('./src/models');
const dbQueries = require('./src/services/queries');
const {addNewMinedBlocksOpReturnData} = require('./src/services/opreturn/add-newblock');
const {addMultipleBlocks} = require('./src/services/opreturn/add-multipleblocks');

const insertData = async () => {
    try{        
        const bitcoindClient = new BitcoinCore(bitcoindClientConfig);
        const blockCount = await bitcoindClient.getBlockCount();
        var startBlockHeight =  startHeight || blockCount; //Pick blockheight if defined in config otherwise use blockcount as starting height
        var endBlockHeight = blockCount;
        
        //Creates Table with columns mentioned in src/models and starts adding existing blocks' OP_RETURN data
        (async () => {          
            models.sequelize.sync().then(async () => {
                console.log(`Inserting Opreturn Data of SYNCED blocks from height ${startBlockHeight} to ${endBlockHeight}`);
                await addMultipleBlocks(startBlockHeight, endBlockHeight, bitcoindClient, dbQueries);
            });
        })();
        
        //Listens for new block mining event and adds OP_RETURN data accordingly
        sock.connect(zeromqTCP);     
        sock.on('message', async function(topic, message) {
                const blockHash = message.toString('hex');
                console.log(topic.toString(), blockHash);
                const block = await bitcoindClient.getBlock(blockHash);
                const newMinedBlockHeight = block.height;
                await addNewMinedBlocksOpReturnData(newMinedBlockHeight, endBlockHeight, bitcoindClient, dbQueries);
          })
        sock.subscribe('hashblock');
 
    }
    catch (error){console.log(error);}
}

insertData();