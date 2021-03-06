
module.exports = function(plugin, state) {
    const selectedBlock = state.document.getDescendant('_selection_key');
    const transform = state.transform();
    state = transform.collapseToStartOf(selectedBlock).move(2).apply();

    return plugin.transforms.decreaseItemDepth(state.transform())
        .apply();
};
