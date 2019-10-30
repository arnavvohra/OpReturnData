//Function for adding OP_RETURN data for given input block
const addSingleBlockOpReturnData = async (block, bitcoindClient, dbQueries) => {
    try{
        const blockTransactions = block.tx;
        //Loop through all transactions in a particular block
            for (transaction of blockTransactions){
              
                 const rawTransaction = await bitcoindClient.getRawTransaction(transaction, 1);
                const vout = rawTransaction.vout;
                let opReturnData;
                          
                    // Loop through outputs of a transaction to find op_return output
                    for (output of vout){
                        //output type is nulldata for OP_RETURN
                        if (output.scriptPubKey.type==='nulldata'){
                          opReturnData = output.scriptPubKey.hex; // HEX Value
                          // ASM Value : opReturnData = output.scriptPubKey.asm.split('OP_RETURN ')[1];
                          break;
                          //Only one OP_RETURN output is allowed per tx so we break when we find that output
                        }
                    }
                    if(opReturnData){
                          //if opreturndata exists in transaction we post into the database.
                          await dbQueries.postOpReturnData(opReturnData, rawTransaction.hash, block.hash, block.height);
                    }
            }   
        
        }    
        catch (error){
            if(error.code == '23505'){
                //Do nothing as this is caused when one tries to insert duplicate entries in database but gets rejected as transaction hash is unique
            }
            else{console.error(error);}      
        }
     }

     module.exports = {addSingleBlockOpReturnData};