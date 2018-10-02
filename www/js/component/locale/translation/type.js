// @flow

export type LangDataType = {|
    /* eslint-disable id-match, id-length */
    +META__LANGUAGE_NAME: string,

    // +HEADER__TOP_TEXT: string,
    +BUTTON__START_GAME: string,
    +BUTTON__LOAD_FILE: string,

    +TURN_X: string,
    +TURN_O: string,
    +YOU_ARE_SPECTATOR: string,
    +YOU_PLAY_FOR_X: string,
    +YOU_PLAY_FOR_O: string,
    +PICK_UP_A_PRIZE: string,
    +RESET_GAME: string,

    +END_GAME_RESULT__X_WIN: string,
    +END_GAME_RESULT__O_WIN: string,
    +END_GAME_RESULT__DRAW: string,

    +LOGIN_POPUP__PLEASE_LOG_IN_OR_JOIN_NOW: string,
    +LOGIN_POPUP__INPUT_USERNAME: string,
    +LOGIN_POPUP__INPUT_PASSWORD: string,
    +LOGIN_POPUP__BUTTON_LOGIN: string,
    +LOGIN_POPUP__BUTTON_JOIN_NOW: string,
    +LOGIN_POPUP__LINK_LOST_PASSWORD: string,

    // spec symbols
    +SPACE: ' '
    /* eslint-enable id-match */
|};

// eslint-disable-next-line id-match
export type LangKeyType = $Keys<LangDataType>;
