// @flow

/* global FileReader */

import type {ServerCellDataType, SymbolTacType, SymbolTicType, SymbolType} from './api';
import {symbolMap} from './api';
import {isString} from '../../lib/is';

export type GetWinnerType = {|
    +value: SymbolType,
    +cellList: Array<ServerCellDataType>
|};

// eslint-disable-next-line complexity
function getLine(cellList: Array<ServerCellDataType>, lineIndex: number): Array<ServerCellDataType> | null {
    switch (lineIndex) {
        case 0:
            return [cellList[0], cellList[1], cellList[2]];
        case 1:
            return [cellList[3], cellList[4], cellList[5]];
        case 2:
            return [cellList[6], cellList[7], cellList[8]];

        case 3:
            return [cellList[0], cellList[3], cellList[6]];
        case 4:
            return [cellList[1], cellList[4], cellList[7]];
        case 5:
            return [cellList[2], cellList[5], cellList[8]];

        case 6:
            return [cellList[0], cellList[4], cellList[8]];
        case 7:
            return [cellList[2], cellList[4], cellList[6]];

        default:
            console.error('can not find line index', lineIndex);
    }

    return null;
}

function isNeededLine(line: Array<ServerCellDataType>, winnerType: SymbolType): boolean {
    if (line.length === 0) {
        return false;
    }

    return line.every((item: ServerCellDataType): boolean => item.value === winnerType);
}

export function getWinner(cellList: Array<ServerCellDataType>, winnerList: Array<SymbolType>): GetWinnerType | null {
    let result: GetWinnerType | null = null;

    const itemListList = new Array(8)
        .fill(null)
        .map((value: null, item: number): Array<ServerCellDataType> | null => getLine(cellList, item));

    winnerList.every(
        (winnerTypeInList: SymbolType): boolean => {
            const neededLine =
                itemListList.find(
                    (line: Array<ServerCellDataType> | null): boolean => {
                        if (line === null) {
                            return false;
                        }

                        return isNeededLine(line, winnerTypeInList);
                    }
                ) || null;

            if (neededLine === null) {
                return true;
            }

            result = {
                value: winnerTypeInList,
                cellList: neededLine
            };

            return false;
        }
    );

    return result;
}

export function isAllCellFilled(cellList: Array<ServerCellDataType>, cellTypeList: Array<SymbolType>): boolean {
    return cellList.every((cellInList: ServerCellDataType): boolean => cellTypeList.includes(cellInList.value));
}

export function isWinCell(winCellList: Array<ServerCellDataType>, cell: ServerCellDataType): boolean {
    return Boolean(winCellList.find((cellInList: ServerCellDataType): boolean => cellInList.index === cell.index));
}

export async function readFileFromInput(file: File): Promise<string> {
    return new Promise((resolve: (fileData: string) => void) => {
        const reader = new FileReader();

        reader.addEventListener('load', (): void => resolve(isString(reader.result) ? reader.result : ''), false);

        reader.readAsText(file);
    });
}

export function getActiveSymbol(cellList: Array<ServerCellDataType>): SymbolTicType | SymbolTacType {
    const {tic, tac} = symbolMap;
    const cellTicList = cellList.filter((cellInList: ServerCellDataType): boolean => cellInList.value === tic);
    const cellTacList = cellList.filter((cellInList: ServerCellDataType): boolean => cellInList.value === tac);

    return cellTicList.length === cellTacList.length ? tic : tac;
}
