require('dotenv').config();
var config = {};

config.bitcoindClientConfig = {
    username : process.env.rpcuser, //rpcuser
    password: process.env.rpcpassword, //rpcpassword
    network: process.env.network, 
    version: process.env.bitcoind_version
};
config.zeromqTCP = process.env.zeromqTCP; // Match value specified in bitcoin.conf file.
config.dbConfig = {
    user: process.env.postgres_username,
    password: process.env.postgres_password,
    host: process.env.postgres_host,
    port: process.env.postgres_port,
    database: process.env.postgresdb_name
    };
config.tableName = process.env.table_name; // Table that gets created in database
config.startHeight; // Block height from which you want to store opreturn data in database
 //config.sampleOpreturnData = "6a4c5000004c680002352235b45cb840b8c97f9f3c8a460d3b3ccfff932a73ef2517f05a74c17447092e6e05fe1a2cd2e10f33746051d95dac33470405f5e14cdc7f5e27de9305ad5bc9212a4ce706aebc7497"
// Above opreturn data is in block 1000000 with txhash : c8bab6b6cb4ef362116bf860f64f603e9ea9e6bbf126c2057ee079f16d0cb885

module.exports = config;