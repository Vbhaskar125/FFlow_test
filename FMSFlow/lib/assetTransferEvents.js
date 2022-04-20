'use strict'

const {Contract}= require('fabric-contract-api')

class assetTransferEvents extends Contract{
    async CreateBatch(ctx, _batchNumber, _hatcheryName, _count, _location, _owner){
        const batch={
            batchNumber: _batchNumber,
            hatcheryName: _hatcheryName,
            count:_count,
            location:_location,
            owner: _owner
        };
        const batchBuffer= Buffer.from(JSON.stringify(batch));
        ctx.stub.setEvent('Batch_created', batchBuffer);
        return ctx.stub.putState(_id, batchBuffer);
    }

    async transferBatch(ctx, _id, _newOwner){
        const batch = await readState(ctx, _id);
        batch.owner = _newOwner;
        const batchBuffer = Buffer.from(JSON.stringify(batch));
        ctx.stub.setEvent('BatchTransferred',batchBuffer)
        return ctx.stub.putState(_id, batchBuffer)
    }
}

//helper functions

async function readState(ctx, _id){
    const batchBuffer= ctx.stub.getState(_id);
    if(!batchBuffer||batchBuffer.length ==0){
        throw new Error(`the batch with id ${_id} does not exist`);
    }
    const batchString = batchBuffer.toString()
    const batch= batchString.parse(batchString)
    return batch;
}