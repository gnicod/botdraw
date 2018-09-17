export const cloneCell = (cell, value) => {
  var clone = cell.clone();
  if (value != null) {
    clone.value = value;
  }
  return clone;
};

/**
*  Return a xml formatted value with label and type
**/
export const formatValue = (label, type, extras = {}) => {
  var doc = mxUtils.createXmlDocument();
  var node = doc.createElement('Node')
  node.setAttribute('label', label);
  node.setAttribute('type', type);
  Object.keys(extras).forEach(function (key) {
    console.log("extra ", extras[key])
    node.setAttribute(key, extras[key]);
  });
  return node;
}

export const generateRecipe = (model) => {
  function getDest(cell) {
    let cellIds = []
    const dests = []
    if (cell.children) {
      cellIds = cell.children.filter(el => el.value.getAttribute("type") == 'InlineButton' || el.value.getAttribute("type") == 'ReplyButton').map(el => el.getId())
    }
    cellIds.push(cell.id)
    console.log(cellIds)
    for (const i in cell.edges) {
      const edge = cell.edges[i]
      console.log("FUUUU ", cellIds, edge.target.id, cellIds.indexOf(String(edge.target.id)))
      if (cellIds.indexOf(String(edge.target.id)) >= 0) {
        dests.push(edge.target.value.getAttribute('label'))
      }
    }
    return dests
  }
  const recipes = { "states": {} }
  for (const i in model.cells) {
    let key = ''
    const cell = model.cells[i]
    const node = cell.value
    if (typeof node != 'undefined' && typeof node.getAttribute != 'undefined') {
      const type = node.getAttribute("type")
      const label = node.getAttribute("label")
      key = label
      recipes['states'][label] = {
        'text': label
      }
      // console.log(type, label, cell.id)
      if (cell.children) {
        const reply_buttons = cell.children.filter(elt => {
          if (typeof elt.value == 'undefined') { return false }
          if (typeof elt.value.getAttribute == 'undefined') { return false }
          return elt.value.getAttribute('type') == 'ReplyButton'
        }).map(el => el.value.getAttribute('label'))
        const inline_buttons = cell.children.filter(elt => {
          if (typeof elt.value == 'undefined') { return false }
          if (typeof elt.value.getAttribute == 'undefined') { return false }
          return elt.value.getAttribute('type') == 'InlineButton'
        }).map(el => {
          return {
            text: el.value.getAttribute('label'),
            action: el.value.getAttribute('action'),
          }
        })
        recipes['states'][label]['reply_keyboard'] = [reply_buttons]
        recipes['states'][label]['inline_keyboard'] = [inline_buttons]
      }

      console.log('dests', getDest(cell))
    }

  }
  console.log(JSON.stringify(recipes))
}