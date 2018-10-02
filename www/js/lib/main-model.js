// @flow

/* global module */

/* eslint-disable complexity */

/* eslint consistent-this: ["error", "model"] */

import {isNotFunction, isNotString, isNotUndefined, isNumber, isString} from './is';

type ActionType<ValueType> = (newValue: ValueType | void, oldValue: ValueType | void) => mixed;

type ListenersItemType<ValueType> = [ActionType<ValueType>, {}];

type ListenersType<KeyNameType, ValueType> = {
    [key: KeyNameType]: Array<ListenersItemType<ValueType>>
};

type ListeningItemType<LIModel, LIKeyName, LIAction, LIContext> = [LIModel, LIKeyName, LIAction, LIContext];

type ListeningType<LModel, LKeyName, LAction, LContext> = Array<ListeningItemType<LModel, LKeyName, LAction, LContext>>;

type AttrType<KeyNameType, ValueType> = {[key: KeyNameType]: ValueType};

/**
 *
 * @param {object} attributes of new MainModel instance
 * @return {MainModel} instance
 */
export default class MainModel<KeyNameType: string, ValueType> {
    attr: AttrType<KeyNameType, ValueType>;
    listeners: ListenersType<KeyNameType, ValueType>;
    listening: ListeningType<MainModel<KeyNameType, ValueType>, KeyNameType, ActionType<ValueType>, {}>;

    constructor(key?: KeyNameType, value?: ValueType) {
        const model = this;

        model.attr = {};
        model.listeners = {};
        model.listening = [];

        if (isNotUndefined(key) && isNotUndefined(value)) {
            model.attr[key] = value;
        }
    }

    /**
     * @return {void}
     */
    destroy() {
        const model = this;

        model.attr = {};
        model.offChange();
        model.stopListening();
    }

    /**
     *
     * @param {string} key of value
     * @param {*} [value] saved value
     * @return {MainModel} instance
     */
    set(key: KeyNameType, value: ValueType): this {
        return this.setKeyValue(key, value);
        // return isString(key) ? this.setKeyValue(key, value) : this.setObject(key);
    }

    /**
     *
     * @param {string} key of value
     * @return {*} saved value
     */
    get(key: KeyNameType): ValueType | void {
        const {attr} = this;

        return attr[key];
    }

    /**
     *
     * @param {string} key of value
     * @param {number} deltaValue to change current value
     * @return {MainModel} instance
     */
    changeBy(key: KeyNameType, deltaValue: ValueType): this {
        const model = this;

        const currentValue = model.get(key);

        if (isNumber(currentValue) && isNumber(deltaValue)) {
            return model.setKeyValue(key, currentValue + deltaValue);
        }

        console.error('delta and value should be number');

        return model;
    }

    /**
     *
     * @param {string} key of value
     * @return {MainModel} instance
     */
    unset(key: KeyNameType): this {
        const model = this;

        Reflect.deleteProperty(model.attr, key);
        return model;
    }

    /**
     *
     * @param {string} key of value
     * @param {function} action to execute
     * @param {*} [context] of action
     * @return {MainModel} instance
     */
    onChange(key: KeyNameType, action: ActionType<ValueType>, context?: {} = this): this {
        const model = this;
        const listeners = model.getListenersByKey(key);

        listeners.push([action, context]);

        return model;
    }

    /**
     *
     * @param {string} [key] of value
     * @param {function} [action] was execute
     * @param {*} [context] of action
     * @return {MainModel} instance
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity, max-statements
    offChange(key?: KeyNameType, action?: ActionType<ValueType>, context?: {} = this): this {
        const model = this;
        const argsLength = arguments.length;

        // key did not passed
        if (isNotString(key)) {
            model.listeners = {};
            return model;
        }

        const allListeners = model.getAllListeners();

        // action did not passed
        if (argsLength === 1) {
            allListeners[key] = [];
            return model;
        }

        if (isNotFunction(action)) {
            return model;
        }

        const listenersByKey = model.getListenersByKey(key);

        if (argsLength === 2) {
            allListeners[key] = listenersByKey.filter(
                <ActionValueType: ValueType>(listenerData: ListenersItemType<ActionValueType>): boolean => {
                    return listenerData[0] !== action;
                }
            );
            return model;
        }

        if (argsLength === 3) {
            allListeners[key] = listenersByKey.filter(
                <ActionValueType: ValueType>(listenerData: ListenersItemType<ActionValueType>): boolean => {
                    return listenerData[0] !== action || listenerData[1] !== context;
                }
            );

            return model;
        }

        return model;
    }

    /**
     *
     * @param {MainModel} mainModel - other model to start listen
     * @param {string} key of value
     * @param {function} action was execute
     * @param {*} [context] of action
     * @returns {MainModel} instance
     */
    listenTo(
        mainModel: MainModel<KeyNameType, ValueType>,
        key: KeyNameType,
        action: ActionType<ValueType>,
        context?: {} = this
    ): this {
        const model = this;
        const listening = model.getListening();

        listening.push([mainModel, key, action, context]);
        mainModel.onChange(key, action, context);

        return model;
    }

    /**
     * @param {MainModel} [mainModel] - other model to stop listen
     * @param {string} [key] of value
     * @param {function} [action] was execute
     * @param {*} [context] of action
     * @return {MainModel} instance
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    stopListening(
        mainModel?: MainModel<KeyNameType, ValueType>,
        key?: KeyNameType,
        action?: ActionType<ValueType>,
        context?: {} = this
    ): this {
        const model = this;
        const argsLength = arguments.length;
        const listening = model.getListening();

        if (argsLength === 0) {
            listening.forEach(
                (
                    listeningItem: ListeningItemType<MainModel<KeyNameType, ValueType>,
                        KeyNameType,
                        ActionType<ValueType>,
                        {}>
                ) => {
                    const [listMainModel, listKey, listAction, listContext] = listeningItem;

                    model.stopListening(listMainModel, listKey, listAction, listContext);
                }
            );
            return model;
        }

        if (argsLength === 1) {
            listening.forEach(
                (
                    listeningItem: ListeningItemType<MainModel<KeyNameType, ValueType>,
                        KeyNameType,
                        ActionType<ValueType>,
                        {}>
                ) => {
                    const [listMainModel, listKey, listAction, listContext] = listeningItem;

                    if (listMainModel === mainModel) {
                        model.stopListening(listMainModel, listKey, listAction, listContext);
                    }
                }
            );
            return model;
        }

        if (argsLength === 2) {
            listening.forEach(
                (
                    listeningItem: ListeningItemType<MainModel<KeyNameType, ValueType>,
                        KeyNameType,
                        ActionType<ValueType>,
                        {}>
                ) => {
                    const [listMainModel, listKey, listAction, listContext] = listeningItem;

                    if (listMainModel === mainModel && listKey === key) {
                        model.stopListening(listMainModel, listKey, listAction, listContext);
                    }
                }
            );
            return model;
        }

        if (argsLength === 3) {
            listening.forEach(
                (
                    listeningItem: ListeningItemType<MainModel<KeyNameType, ValueType>,
                        KeyNameType,
                        ActionType<ValueType>,
                        {}>
                ) => {
                    const [listMainModel, listKey, listAction, listContext] = listeningItem;

                    if (listMainModel === mainModel && listKey === key && listAction === action) {
                        model.stopListening(listMainModel, listKey, listAction, listContext);
                    }
                }
            );
            return model;
        }

        model.listening = listening.filter(
            (
                listeningItem: ListeningItemType<MainModel<KeyNameType, ValueType>,
                    KeyNameType,
                    ActionType<ValueType>,
                    {}>
            ): boolean => {
                const [listMainModel, listKey, listAction, listContext] = listeningItem;

                if (
                    mainModel &&
                    listMainModel === mainModel &&
                    listKey === key &&
                    listAction === action &&
                    listContext === context
                ) {
                    mainModel.offChange(listKey, listAction, listContext);
                    return false;
                }
                return true;
            }
        );

        return model;
    }

    /**
     *
     * @param {string} key of value
     * @param {*} [newValue] of instance
     * @param {*} [oldValue] of instance
     * @return {MainModel} instance
     */
    trigger(key: KeyNameType, newValue: ValueType | void, oldValue: ValueType | void): this {
        const model = this;
        const listeners = model.getListenersByKey(key);
        const argsLength = arguments.length;

        let oldValueArg = null;
        let newValueArg = null;

        if (argsLength === 1) {
            oldValueArg = model.get(key);
            newValueArg = oldValueArg;
        }

        if (argsLength === 2) {
            oldValueArg = model.get(key);
            newValueArg = newValue;
        }

        if (argsLength === 3) {
            oldValueArg = oldValue;
            newValueArg = newValue;
        }

        listeners.forEach(<ActionValueType: ValueType>(listenerData: ListenersItemType<ActionValueType>) => {
            Reflect.apply(listenerData[0], listenerData[1], [newValueArg, oldValueArg]);
        });

        return model;
    }

    /**
     *
     * @param {string} key - of value
     * @param {function} test - for new value of key
     * @param {function} onValid - run if key right
     * @param {function} onInvalid - run if key wrong
     * @param {*} [context] of actions
     * @returns {MainModel} instance
     */
    setValidation(
        key: KeyNameType,
        test: (...args: [ValueType, ValueType]) => boolean,
        onValid: (...args: [ValueType, ValueType]) => void,
        onInvalid: (...args: [ValueType, ValueType]) => void,
        context?: {} = this
    ): this {
        const model = this;

        model.onChange(
            key,
            (newValue: ValueType | void, oldValue: ValueType | void): void => {
                const args = [newValue, oldValue];

                return Reflect.apply(test, context, args) ?
                    Reflect.apply(onValid, context, args) :
                    Reflect.apply(onInvalid, context, args);
            },
            context
        );

        return model;
    }

    /**
     *
     * @return {object} all attributes
     */

    getAllAttributes(): AttrType<KeyNameType, ValueType> {
        return this.attr;
    }

    /**
     *
     * @return {object} all listeners
     */
    getAllListeners(): ListenersType<KeyNameType, ValueType> {
        return this.listeners;
    }

    /**
     *
     * @return {*[]} all listening
     */
    getListening(): ListeningType<MainModel<KeyNameType, ValueType>, KeyNameType, ActionType<ValueType>, {}> {
        return this.listening;
    }

    /**
     *
     * @param {string} key of value
     * @return {*[]} of listeners filtered by key
     */
    getListenersByKey(key: KeyNameType): Array<ListenersItemType<ValueType>> {
        const model = this;
        const listeners = model.listeners;

        if (listeners.hasOwnProperty(key)) {
            return listeners[key];
        }

        listeners[key] = [];

        return listeners[key];
    }

    // helpers
    setKeyValue(key: KeyNameType, newValue: ValueType): this {
        const model = this;
        const attr = model.attr;
        const oldValue = model.get(key);

        attr[key] = newValue;

        if (oldValue !== newValue) {
            model.trigger(key, newValue, oldValue);
        }
        return model;
    }

    /*
    setObject(obj: {|+[key: KeyNameType]: ValueType|}): this {
        const model = this;

        Object.keys(obj).forEach((key: KeyNameType) => {
            model.setKeyValue(key, obj[key]);
        });

        return model;
    }
    */
}
