// @flow

/* global window */

import appConst from '../../app/const';

import {Waves} from '../../lib/waves-api';

export type SymbolTicType = 1;
export type SymbolTacType = 10;
export type SymbolNoDefineType = 0;
export type SymbolType = SymbolTicType | SymbolTacType | SymbolNoDefineType;

type SymbolMapType = {|
    +tic: SymbolTicType,
    +tac: SymbolTacType,
    +noDefine: SymbolNoDefineType
|};

export type ServerCellDataType = {
    +value: SymbolType,
    +index: number
};

export const symbolMap: SymbolMapType = {
    tic: 1,
    tac: 10,
    noDefine: 0
};

type CellStateType = SymbolType;
type CellStateListType = {|
    +cellList: Array<CellStateType>
|};

type RawServerCellDataType = {key: mixed, value: mixed};

function extractCellList(parsedResponse: Array<RawServerCellDataType>): Array<SymbolType> {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].map(
        // eslint-disable-next-line complexity
        (cellName: number): CellStateType => {
            const cell =
                parsedResponse.find(
                    (cellInList: RawServerCellDataType): boolean => cellInList.key === `cell${cellName}`
                ) || null;

            if (cell === null) {
                console.error(`Can not find cell with key = cell${cellName}`);
                return symbolMap.noDefine;
            }

            const {value} = cell;

            if (value === symbolMap.noDefine) {
                return symbolMap.noDefine;
            }

            if (value === symbolMap.tic) {
                return symbolMap.tic;
            }
            if (value === symbolMap.tac) {
                return symbolMap.tac;
            }

            console.error('cell.value is not support', cell);

            return symbolMap.noDefine;
        }
    );
}

export async function getCellListState(): Promise<CellStateListType | Error> {
    return window
        .fetch(appConst.api.cellStateList)
        .then((response: Response): Promise<Array<RawServerCellDataType>> => response.json())
        .then(
            (parsedResponse: Array<RawServerCellDataType>): CellStateListType => {
                return {
                    cellList: extractCellList(parsedResponse)
                };
            }
        )
        .catch(
            (error: Error): Error => {
                console.error('can not get cell state list');
                console.error(error);
                return error;
            }
        );
}

export async function setCellListState(cellIndex: number, symbol: SymbolType, privateKey: string): Promise<mixed> {
    // const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);

    const blockData = await Waves.API.Node.blocks.height();

    const data = [
        {
            key: 'cell' + (cellIndex + 1),
            value: symbol,
            type: 'integer'
        },
        {
            key: 'deadline',
            value: blockData.height + 5,
            type: 'integer'
        }
    ];

    const dataTxObj = {
        data,
        fee: await Waves.tools.getMinimumDataTxFee(data) + 400000,
        sender: appConst.game.address,
        senderPublicKey: appConst.game.publicKey
    };

    const dataTx = await Waves.tools.createTransaction(Waves.constants.DATA_TX_NAME, dataTxObj);

    dataTx.addProof(privateKey);

    const dataTxJSON = await dataTx.getJSON();

    return await Waves.API.Node.transactions.rawBroadcast(dataTxJSON);
}

export async function reset(privateKey: string): Promise<mixed> {
    // const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);

    const data = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(
        (cellIndexInList: number): RawServerCellDataType => ({
            key: 'cell' + (cellIndexInList + 1),
            value: symbolMap.noDefine,
            type: 'integer'
        })
    );

    const dataTxObj = {
        data,
        fee: await Waves.tools.getMinimumDataTxFee(data) + 400000,
        sender: appConst.game.address,
        senderPublicKey: appConst.game.publicKey
    };

    const dataTx = await Waves.tools.createTransaction(Waves.constants.DATA_TX_NAME, dataTxObj);

    dataTx.addProof(privateKey);

    const dataTxJSON = await dataTx.getJSON();

    return await Waves.API.Node.transactions.rawBroadcast(dataTxJSON);
}

export async function pickUpAPrize(recipientAddress: string, privateKey: string): Promise<mixed> {
    // const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);

    // const balanceData = await Waves.API.Node.addresses.balance(appConst.game.address);

    const fee = 500000;

    const transferTxObj = {
        recipient: recipientAddress,
        amount: 6e7,
        sender: appConst.game.address,
        fee,
        senderPublicKey: appConst.game.publicKey,
        assetId: 'WAVES',
        attachment: '',
        feeAssetId: 'WAVES',
        timestamp: Date.now()
    };

    console.log(transferTxObj);

    const transferTx = await Waves.tools.createTransaction(Waves.constants.TRANSFER_TX_NAME, transferTxObj);

    transferTx.validatedData.type = 4;
    transferTx.validatedData.version = 2;

    transferTx.addProof(privateKey);

    const transferTxJSON = await transferTx.getJSON();

    // debugger

    // transferTxJSON.type = 4;
    // transferTxJSON.version = 2;

    console.log(transferTxJSON);

    await Waves.API.Node.transactions.rawBroadcast(transferTxJSON);
}

/*
export async function pickUpAPrize3(recipientAddress: string, privateKey: string): Promise<mixed> {
    const transferData = {
        // An arbitrary address; mine, in this example
        recipient: recipientAddress,

        // ID of a token, or WAVES
        assetId: 'WAVES',

        // The real amount is the given number divided by 10^(precision of the token)
        amount: 1e6,

        // The same rules for these two fields
        feeAssetId: 'WAVES',
        fee: 500000,

        // 140 bytes of data (it's allowed to use Uint8Array here)
        attachment: '',

        timestamp: Date.now()
    };

    // const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);

    Waves.API.Node.transactions
        .broadcast('transfer', transferData, {
            publicKey: '7Gg1zvg6JrQh4XTZScvpwsPE28LUL8rGnkWNbiqtUUob',
            privateKey: '84nej9CjkeT8pnXamBYy3asmqcrXfwJFowSyRaVYwzdC'
        })
        .then(responseData => {
            console.log(responseData);
        });
}
*/
