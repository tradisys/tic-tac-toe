// @flow

/* global window, setTimeout */

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import type {GlobalStateType} from '../../app/reducer';
import style from './style.scss';
import type {ServerCellDataType} from './api';
import {getCellListState, setCellListState, symbolMap, reset, pickUpAPrize} from './api';
import {getActiveSymbol, getWinner, isAllCellFilled, isWinCell, readFileFromInput} from './helper';
import Button from '@material-ui/core/Button';
import Locale from '../locale/c-locale';
import Cell from './cell/c-cell';
import type {AuthType, UserType} from '../auth/reducer';
import type {SetUserType} from '../auth/action';
import {setUser} from '../auth/action';
import {isString} from '../../lib/is';
import appConst from '../../app/const';
import classNames from 'classnames';

import {Waves} from '../../lib/waves-api';

type ReduxPropsType = {|
    +auth: AuthType
|};

type ReduxActionType = {|
    +setUser: (userState: UserType) => SetUserType
|};

type PassedPropsType = {};

type PropsType = $ReadOnly<$Exact<{
        ...$Exact<PassedPropsType>,
        ...$Exact<ReduxPropsType>,
        ...$Exact<ReduxActionType>,
        // ...$Exact<ContextRouterType>,
        +children: Node
    }>>;

type LogMessageType = 'success' | 'error' | 'info';

const logMessageTypeMap = {
    success: 'success',
    error: 'error',
    info: 'info'
};

type LogDataType = {
    +id: string,
    +message: string,
    type: LogMessageType
};

type StateType = {|
    // +isStarted: boolean,
    // +isListenServerStart: boolean,
    +log: {
        +list: Array<LogDataType>
    },
    +cellStateList: Array<ServerCellDataType>,
    +gameResult: '' | 'END_GAME_RESULT__X_WIN' | 'END_GAME_RESULT__O_WIN' | 'END_GAME_RESULT__DRAW',
    +winCellList: Array<ServerCellDataType>
|};

const reduxAction: ReduxActionType = {
    setUser
};

const serverListenPerion = 1e3;

class Game extends Component<ReduxPropsType, PassedPropsType, StateType> {
    props: PropsType;
    state: StateType;

    constructor(props: PropsType) {
        super(props);

        const view = this;

        view.state = view.getInitialState();
    }

    componentDidMount() {
        const view = this;

        view.startGame()
            .then((): void => console.log('then game has begun!'))
            .catch(
                (error: Error): Error => {
                    console.error('error with start game');
                    console.error(error);

                    return error;
                }
            );
    }

    getInitialState(): StateType {
        return {
            // isStarted: false,
            // isListenServerStart: false,
            // did not find better way to create needed array, fix it if you can
            log: {
                list: []
            },
            cellStateList: new Array(9)
                .fill({value: symbolMap.noDefine, index: 0})
                .map((value: ServerCellDataType, index: number): ServerCellDataType => ({...value, index})),
            gameResult: '',
            winCellList: []
        };
    }

    // isListenServerStart(): boolean {
    //     const view = this;
    //     const {props, state} = view;
    //
    //     return state.isListenServerStart;
    // }

    async fetchServerCellListData(): Promise<void> {
        const view = this;
        const {state} = view;
        const {cellStateList} = state;

        const serverCellStateList = await getCellListState();

        if (serverCellStateList instanceof Error) {
            return;
        }

        const newCellStateList = cellStateList.map(
            (cell: ServerCellDataType): ServerCellDataType => {
                return {...cell, value: serverCellStateList.cellList[cell.index]};
            }
        );

        view.setState({cellStateList: newCellStateList});
    }

    checkWinner() {
        const view = this;
        const {state} = view;
        const {cellStateList} = state;
        const activeSymbolList = [symbolMap.tic, symbolMap.tac];

        const winnerData = getWinner(cellStateList, activeSymbolList);

        if (winnerData !== null) {
            view.setState({
                gameResult: winnerData.value === symbolMap.tic ? 'END_GAME_RESULT__X_WIN' : 'END_GAME_RESULT__O_WIN',
                winCellList: winnerData.cellList
            });
            console.log('---> winner is:', winnerData);
            return;
        }

        if (isAllCellFilled(cellStateList, activeSymbolList)) {
            console.log('---> DRAW');
            view.setState({gameResult: 'END_GAME_RESULT__DRAW'});
            return;
        }

        view.setState({
            gameResult: '',
            winCellList: []
        });

        console.log('---> no winner and battlefield is not fulfill -> game must go on');
    }

    async startListenServer(): Promise<void> {
        const view = this;

        async function watch(): Promise<void> {
            await view.fetchServerCellListData();

            view.checkWinner();

            setTimeout(watch, serverListenPerion);
        }

        return watch();
    }

    async startGame(): Promise<void> {
        const view = this;

        await view.startListenServer();
    }

    renderGameResult(): Node {
        const view = this;
        const {state} = view;
        const {gameResult} = state;

        if (gameResult === '') {
            return '';
        }

        return <Locale stringKey={gameResult}/>;
    }

    // isMyTurn(): boolean {
    //     const view = this;
    //     const {props, state} = view;
    //     const {auth} = props;
    //
    //     return auth.user.symbol === getActiveSymbol(state.cellStateList);
    // }

    isMeSpectator(): boolean {
        const view = this;
        const {props, state} = view;
        const {auth} = props;

        return auth.user.symbol === symbolMap.noDefine;
    }

    // eslint-disable-next-line complexity
    async initUserFromString(string: string): Promise<void> {
        const view = this;
        const {props, state} = view;
        // const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);
        const seed = Waves.Seed.fromExistingPhrase(string);
        const {
            address,
            phrase,
            keyPair: {privateKey, publicKey}
        } = seed;

        if (!(isString(address) && isString(phrase) && isString(privateKey) && isString(publicKey))) {
            console.error('wrong types');
            return;
        }

        if ([appConst.user.symbolX.address, appConst.user.symbolO.address].includes(address)) {
            props.setUser({
                id: '',
                address,
                phrase,
                privateKey,
                publicKey,
                symbol: appConst.user.symbolX.address === address ? symbolMap.tic : symbolMap.tac
            });
            return;
        }

        props.setUser({
            id: '',
            address,
            phrase,
            privateKey,
            publicKey,
            symbol: symbolMap.noDefine
        });
    }

    async onCellClick(cellIndex: number): Promise<mixed> {
        const view = this;
        const {props} = view;
        const {auth} = props;

        return setCellListState(cellIndex, auth.user.symbol, auth.user.privateKey)
            .then(
                (result: mixed): mixed => {
                    view.pushToLog(JSON.stringify(result), logMessageTypeMap.success);
                    return result;
                }
            )
            .catch(
                (error: Error): Error => {
                    view.pushToLog(error.message, logMessageTypeMap.error);

                    return error;
                }
            );
    }

    renderActiveSymbolNode(): Node {
        const view = this;
        const {state, props} = view;
        const {cellStateList} = state;

        const activeSymbol = getActiveSymbol(cellStateList);

        return <Locale stringKey={activeSymbol === symbolMap.tic ? 'TURN_X' : 'TURN_O'}/>;
    }

    renderStatusBar(): Node {
        const view = this;
        const {state, props} = view;
        const {gameResult} = state;

        const isMeSpectator = view.isMeSpectator();

        const status = gameResult === '' ? view.renderActiveSymbolNode() : view.renderGameResult();

        if (isMeSpectator) {
            return (
                <p className={style.game_result_p} key="your-role">
                    <Locale stringKey="YOU_ARE_SPECTATOR"/> - {status}
                </p>
            );
        }

        const stringKey = props.auth.user.symbol === symbolMap.tic ? 'YOU_PLAY_FOR_X' : 'YOU_PLAY_FOR_O';

        return (
            <p className={style.game_result_p} key="your-role">
                <Locale stringKey={stringKey}/> - {status}
            </p>
        );
    }

    pushToLog(message: string, type: LogMessageType) {
        const view = this;
        const {state, props} = view;
        const {log} = state;

        log.list.push({
            id: String(Math.random()).substr(2),
            type,
            message
        });

        view.setState({log});
    }

    renderLog(): Node {
        const view = this;
        const {state, props} = view;
        const {log} = state;
        const maxMessageLength = 512;

        return (
            <div className={style.log_list_wrapper}>
                <div className={style.log_list}>
                    {log.list.map(
                        (logData: LogDataType): Node => {
                            const {message} = logData;
                            const messageLength = message.length;
                            const resultMessage =
                                messageLength > maxMessageLength ?
                                    message.substr(0, maxMessageLength - 3) + '\u2026' :
                                    message;

                            return (
                                <p
                                    className={classNames(style.log_message, {
                                        [style.log_message__success]: logData.type === logMessageTypeMap.success,
                                        [style.log_message__error]: logData.type === logMessageTypeMap.error,
                                        [style.log_message__info]: logData.type === logMessageTypeMap.info
                                    })}
                                    key={logData.id}
                                >
                                    {resultMessage}
                                </p>
                            );
                        }
                    )}
                </div>
            </div>
        );
    }

    render(): Node {
        const view = this;
        const {state, props} = view;
        const {cellStateList, winCellList} = state;
        const {auth} = props;

        return (
            <div className={style.wrapper}>
                {view.renderStatusBar()}

                <div className={style.field}>
                    {cellStateList.map(
                        (cell: ServerCellDataType): Node => {
                            return (
                                <Cell
                                    onClick={() => {
                                        // if (!isMyTurn) {
                                        //     return;
                                        // }
                                        view.onCellClick(cell.index)
                                            .then((): void => console.log(`Cell with index ${cell.index} clicked!`))
                                            .catch(
                                                (error: Error): Error => {
                                                    console.error('click error');
                                                    console.error(error);
                                                    return error;
                                                }
                                            );
                                    }}
                                    key={cell.index}
                                    value={cell.value}
                                    isWin={isWinCell(winCellList, cell)}
                                />
                            );
                        }
                    )}
                </div>

                <div className={style.button_wrapper}>
                    <input
                        onChange={(evt: SyntheticEvent<HTMLInputElement>) => {
                            readFileFromInput(evt.currentTarget.files[0])
                                .then(
                                    (fileText: string): Promise<void> => {
                                        view.pushToLog('File has been loaded', logMessageTypeMap.info);
                                        return view.initUserFromString(fileText.trim());
                                    }
                                )
                                .catch(
                                    (error: Error): Error => {
                                        view.pushToLog('Can not read file', logMessageTypeMap.error);
                                        console.error('can not read file');
                                        console.error(error);
                                        return error;
                                    }
                                );
                        }}
                        className={style.input_file}
                        type="file"
                    />

                    <Button
                        className={style.button}
                        // onClick={(): Promise<void> => view.startGame()}
                        // onKeyPress={(): Promise<void> => view.startGame()}
                        variant="contained"
                        color="primary"
                        type="button"
                    >
                        <Locale stringKey="BUTTON__LOAD_FILE"/>
                    </Button>

                    <Button
                        className={style.button}
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={() => {
                            pickUpAPrize(auth.user.address, auth.user.privateKey)
                                .then(
                                    (response: mixed): mixed => {
                                        view.pushToLog('You Picked up a prize!', logMessageTypeMap.success);

                                        return response;
                                    }
                                )
                                .catch(
                                    (error: Error): Error => {
                                        view.pushToLog(error.message, logMessageTypeMap.error);
                                        console.error('error with pick up a prize');
                                        console.error(error);

                                        return error;
                                    }
                                );
                        }}
                    >
                        <Locale stringKey="PICK_UP_A_PRIZE"/>
                    </Button>

                    <Button
                        className={style.button}
                        // onClick={(): Promise<void> => view.startGame()}
                        // onKeyPress={(): Promise<void> => view.startGame()}
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={() => {
                            reset(auth.user.privateKey)
                                .then(
                                    (result: mixed): mixed => {
                                        view.pushToLog(JSON.stringify(result), logMessageTypeMap.success);

                                        return result;
                                    }
                                )
                                .catch(
                                    (error: Error): Error => {
                                        view.pushToLog(error.message, logMessageTypeMap.error);
                                        console.error('error with reset game');
                                        console.error(error);

                                        return error;
                                    }
                                );
                        }}
                    >
                        <Locale stringKey="RESET_GAME"/>
                    </Button>
                </div>
                {view.renderLog()}
            </div>
        );
    }
}

export default connect(
    (state: GlobalStateType, props: PassedPropsType): ReduxPropsType => ({
        auth: state.auth
    }),
    reduxAction
)(Game);
