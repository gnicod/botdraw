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
export const formatValue = (label, type, extras={}) => {
  var doc = mxUtils.createXmlDocument();
  var node = doc.createElement('Node')
  node.setAttribute('label', label);
  node.setAttribute('type', type);
  Object.keys(extras).forEach(function (key) {
    node.setAttribute(key, extras[key]);
  });
  return node;
}


/**

model = graph.getModel()
function getDest(cell) {
   cellId = cell.id
   for(i in cell.edges) {
       edge = cell.edges[i]
       console.log("edge, ", edge)
       if(cellId != edge.target.id) {
            console.log("ok")
       }
   } 
}

function generateReciepe() {
    recipes = {"states": {}}
    for(i in model.cells ) {
       key = ''
       cell = model.cells[i] 
       node  = cell.value
       if(typeof node != 'undefined' && typeof node.getAttribute != 'undefined') {
          type = node.getAttribute("type")
          label = node.getAttribute("label")
          key = label
          recipes[label] = {
             'text': label
          }
          console.log(type, label, cell.id)
    if(cell.children){
           buttons = cell.children.filter(elt => {
                if(typeof elt.value == 'undefined') { return false }
                if(typeof elt.value.getAttribute == 'undefined') { return false }
				return elt.value.getAttribute('type') == 'ReplyButton'
           }).map(el => el.value.getAttribute('label'))
           console.log("children" , buttons)
           recipes[key]['reply_keyboard'] = [buttons]
       }
       
       getDest(cell)
       }
   
    }
    console.log(recipes)
}
generateReciepe()
 */