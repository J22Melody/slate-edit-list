const unwrapList = require('./transforms/unwrapList');
const getCurrentItem = require('./getCurrentItem');

/**
 * User pressed Delete in an editor
 */
function onBackspace(event, data, state, opts) {
    const { startOffset, selection } = state;

    // Only unwrap...
    // ... with a collapsed selection
    if (selection.isExpanded) return;

    // ... when at the beginning of nodes
    if (startOffset > 0) return;
    // ... in a list
    const currentItem = getCurrentItem(opts, state);
    if (!currentItem) return;
    // ... more precisely at the beginning of the current item
    if (!selection.isAtStartOf(currentItem)) return;

    if (state.startBlock.length === 0) {
      event.preventDefault();
      // return unwrapList(opts, state.transform()).apply();
      var li = state.document.getClosest(state.startBlock.key, node => node.type === 'list-item')
      var list = state.document.getClosest(state.startBlock.key, node => node.type === 'numbered-list' || node.type === 'bulleted-list')
      if (list.nodes.size === 1) {
        return state.transform().removeNodeByKey(li.key).removeNodeByKey(list.key).apply()
      } else {
        return state.transform().removeNodeByKey(li.key).apply()
      }
    }
}

module.exports = onBackspace;
