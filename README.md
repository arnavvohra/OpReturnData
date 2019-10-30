# OP Return Data
The purpose of this project is to store and index Bitcoin OP_RETURN data. This data is then served on HTTP endpoints as a JSON payloads.

## How do I set it up?
1) git clone https://github.com/arnavvohra/OpReturnData.git
2) cd OpReturnData
3) npm install


## What are the things I need to configure before I can start testing the code?

### 1. Bitcoin Node : Sync Bitcoin testnet node locally with the following parameters defined in bitcoin.conf file :

```server=1
rpcuser=arnav
rpcpassword=arnav
testnet=1
txindex=1
zmqpubhashblock=tcp://127.0.0.1:28332
```

rpcuser, rpcpassword and zmqpubhashblock can be different for you, if that's the case, update the details in .env file. 
Example values:

```
rpcuser = "arnav"
rpcpassword = "arnav"
network = "testnet"
bitcoind_version = "0.18.1"
zeromqTCP = "tcp://127.0.0.1:28332"
```

### 2. Postgres : Start postgres database server and update the details in .env file.
Example values:
```
postgres_username = "postgres"
postgres_password = "postgres"
postgres_host = "localhost"
postgres_port = 5432
postgresdb_name = "testdata1"
table_name = "testdata"
```
### 3. Starting block height : You can specify the starting block height from which you want to store and index OP_RETURN data.
The value can be specified in config.js file.

```config.startHeight; // Block height from which you want to store opreturn data in database```

For example if you want to start storing data from block height 1583000, then update config.startHeight like:

```config.startHeight = 1583000;```

#### By default, if no value is assigned to config.startHeight, the code starts storing OP_RETURN data from the last synced block in the local node and keeps adding new OP_RETURN data as new blocks get added or mined.

## How to run the code?
After setting up and making the required changes in .env and config.js file, you are all set to run the code.

For inserting opreturn data, run the command :
#### node insert.js

To run the REST API server which returns txhash and blockhash given an OP_RETURN value, open a new terminal window and run the command :
#### npm start

One can start requesting data over the HTTP endpoint even while OP_RETURN data is getting inserted in the database through 'insert.js'.

## Fetching OP_RETURN data
To fetch opreturn data, hit the following http endpoint with opReturnData being the hex value of OP_RETURN data (matching coinsecrets) :
http://localhost:${process.env.port||8080}/opreturn/${opReturnData}

This will return an array of objects with the corresponding transaction hash and block hash. Since OP_RETURN data can be same for many transactions, we return all transaction hashes and block hashes corresponding to the mentioned opReturnData.
Example result array
```
[{"txhash":"693633ad3a1ac83314fb0cc614353a42c8dee3f1df40d25b94171429b350c110","blockhash":"000000000000006ba44e863f46e712099866368a9f867e1b66dd7c6bf98c2906"},{"txhash":"ed3c2c27a436071915e41747b8df2b4db88aa47b1e957e097f3e314b9207fb16","blockhash":"000000000000006ba44e863f46e712099866368a9f867e1b66dd7c6bf98c2906"},{"txhash":"a6d9b2293dfdab0331b296211061afb115b953227b04c2ebcc0eacfec4e60c6b","blockhash":"000000000000006ba44e863f46e712099866368a9f867e1b66dd7c6bf98c2906"},{"txhash":"34ec233ad42d314cbaa5f4cd2703618ff679a033ee8abf5729fc591ccfe5e028","blockhash":"000000000000006ba44e863f46e712099866368a9f867e1b66dd7c6bf98c2906"}]
```


## What is happening behind the scenes?
We start looping through all transactions of blocks with height >= startHeight.
We look for transaction outputs with scriptPubKey type equal to 'nulldata' (only one output in a transaction can have scriptPubKey equal to 'nulldata') and we get the OP_RETURN data value from that and post to database.

The code also actively listens to blockchain and adds opreturn data of newly mined blocks to database as it comes in.
