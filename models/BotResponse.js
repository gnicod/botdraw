import { cloneCell, formatValue } from "../utils.js";

export default class BotResponse {

  constructor(name, message) {
    this.name = name;
    this.message = message
    this.vertex = null;
    this.buttons = [];
    this.heightItem = 30;
    this.vertexWith = 150;
  }

  insertIntoGraph(graph, parent) {
    this.vertex = graph.insertVertex(parent, null, formatValue(this.name, 'BotResponse', {message: this.message}),
      this.vertexWith, 150, 150, 150,
      'text;strokeColor=#000;fillColor=#FFFFFF;align=left;verticalAlign=top;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=southnorth;');
  }


  addReplyButton(name) {
    const posY = this.heightItem + (this.buttons.length) * this.heightItem
    var field = new mxCell(formatValue('','ButtonLine'), new mxGeometry(0, posY, this.vertexWith, this.heightItem), 'text;strokeColor=#0011ff;fillColor=none;align=left;verticalAlign=bottom;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
    field.vertex = true;
    this.buttons.push(field);
    const cloned = cloneCell(field, formatValue(name, 'ReplyButton'))
    cloned.id =  this.vertex.id + '-' + this.buttons.length
    const child = this.vertex.insert(cloned);
    console.log("child", child)
  }

  addInlineButton(name, action) {
    const posY = this.heightItem + (this.buttons.length) * this.heightItem
    var field = new mxCell(formatValue('','ButtonLine'), new mxGeometry(0, posY, this.vertexWith, this.heightItem), 'text;strokeColor=#0011ff;fillColor=none;align=left;verticalAlign=bottom;spacingLeft=4;spacingRight=4;overflow=hidden;rotatable=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;');
    field.vertex = true;
    this.buttons.push(field);
    const cloned = cloneCell(field, formatValue(name, 'InlineButton', {action}))
    cloned.id =  this.vertex.id + '-' + this.buttons.length
    this.vertex.insert(cloned);
  }

}
