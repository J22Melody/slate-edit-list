'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var Options = require('./options');
var onEnter = require('./onEnter');
var onTab = require('./onTab');
var onBackspace = require('./onBackspace');
var makeSchema = require('./makeSchema');

var wrapInList = require('./transforms/wrapInList');
var unwrapList = require('./transforms/unwrapList');
var splitListItem = require('./transforms/splitListItem');
var increaseItemDepth = require('./transforms/increaseItemDepth');
var decreaseItemDepth = require('./transforms/decreaseItemDepth');

var getItemDepth = require('./getItemDepth');
var isList = require('./isList');
var isSelectionInList = require('./isSelectionInList');
var getCurrentItem = require('./getCurrentItem');
var getCurrentList = require('./getCurrentList');
var getItemsAtRange = require('./getItemsAtRange');
var getPreviousItem = require('./getPreviousItem');

var KEY_ENTER = 'enter';
var KEY_TAB = 'tab';
var KEY_BACKSPACE = 'backspace';

/**
 * A Slate plugin to handle keyboard events in lists.
 * @param {Options} [opts] Options for the plugin
 * @return {Object}
 */

function EditList() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    opts = new Options(opts);

    /**
     * Bind a transform to be only applied in list
     */
    function bindTransform(fn) {
        return function (transform) {
            var state = transform.state;


            if (!isSelectionInList(opts, state)) {
                return transform;
            }

            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            return fn.apply(undefined, _toConsumableArray([opts, transform].concat(args)));
        };
    }

    /**
     * User is pressing a key in the editor
     */
    function onKeyDown(e, data, state) {
        // Build arguments list
        var args = [e, data, state, opts];

        switch (data.key) {
            case KEY_ENTER:
                return onEnter.apply(undefined, args);
            // case KEY_TAB:
            //     return onTab(...args);
            // case KEY_BACKSPACE:
            //     return onBackspace(...args);
        }
    }

    var schema = makeSchema(opts);

    return {
        onKeyDown: onKeyDown,

        schema: schema,

        utils: {
            getCurrentItem: getCurrentItem.bind(null, opts),
            getCurrentList: getCurrentList.bind(null, opts),
            getItemDepth: getItemDepth.bind(null, opts),
            getItemsAtRange: getItemsAtRange.bind(null, opts),
            getPreviousItem: getPreviousItem.bind(null, opts),
            isList: isList.bind(null, opts),
            isSelectionInList: isSelectionInList.bind(null, opts)
        },

        transforms: {
            decreaseItemDepth: bindTransform(decreaseItemDepth),
            increaseItemDepth: bindTransform(increaseItemDepth),
            splitListItem: bindTransform(splitListItem),
            unwrapList: bindTransform(unwrapList),
            wrapInList: wrapInList.bind(null, opts)
        }
    };
}

module.exports = EditList;