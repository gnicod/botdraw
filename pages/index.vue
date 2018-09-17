<template>
  <section class="container">
    <div ref="graphContainer"
    style="position:relative;overflow:hidden;width:100%;height:100vh;background:#EEE;cursor:default;">
  </div>
  <div style="width:50%">
    <chat :flow="flow"/>
  </div>
</section>
</template>
<script>
import Chat from "../components/Chat";
import { cloneCell, generateRecipe } from "../utils.js";
import BotResponse from "../models/BotResponse.js";

export default {
  components: { Chat },
  data() {
    return {
      flow: {}
    };
  },
  methods: {
    getJson(graph) {
      const encoder = new mxCodec();
      const node = encoder.encode(graph.getModel());
      const testString = mxUtils.getXml(node); // fetch xml (string or document/node)
      return xmlToJSON.parseString(testString);
    }
  },
  mounted() {
    let container = this.$refs.graphContainer;
    if (!mxClient.isBrowserSupported()) {
      mxUtils.error("Browser is not supported!", 200, false);
    } else {
      // Disables the built-in context menu
      mxEvent.disableContextMenu(container);

      // Creates the graph inside the given container
      const graph = new mxGraph(container);
      window.graph = graph;

      /**
       *  Allow to pass xml in value
       **/
      graph.convertValueToString = function(cell) {
        if (mxUtils.isNode(cell.value)) {
          return cell.getAttribute("label", "");
        }
      };

      /**
       *  Allow to pass xml in value
       **/
      var cellLabelChanged = graph.cellLabelChanged;
      graph.cellLabelChanged = function(cell, newValue, autoSize) {
        if (mxUtils.isNode(cell.value)) {
          // Clones the value for correct undo/redo
          var elt = cell.value.cloneNode(true);
          elt.setAttribute("label", newValue);
          newValue = elt;
        }

        cellLabelChanged.apply(this, arguments);
      };

      // Enables rubberband selection
      new mxRubberband(graph);

      // Gets the default parent for inserting new cells. This
      // is normally the first child of the root (ie. layer 0).
      const parent = graph.getDefaultParent();

      graph.getLabel = function(state) {
        const label = mxGraph.prototype.getLabel.apply(this, arguments);
        if (state.edge) {
          return state.value.value;
        } else {
          return label;
        }
      };

      // Adds cells to the model in a single step
      graph.getModel().beginUpdate();
      try {
        const v1 = new BotResponse("flow0");
        v1.insertIntoGraph(graph, parent);
        const edgeValue = { type: "user_message", value: "EDGE VALUE" };
      } finally {
        graph.getModel().endUpdate();
      }
      this.json = this.getJson(graph);

      // Configures automatic expand on mouseover
      graph.popupMenuHandler.autoExpand = true;

      // Installs context menu
      let self_ = this;
      graph.popupMenuHandler.factoryMethod = function(menu, cell, evt) {
        if (cell && cell.value && mxUtils.isNode(cell.value)) {
          const type = cell.getAttribute("type", "");
          switch (type) {
            case "BotResponse":
              menu.addItem("Add bot response", null, function() {
                graph.getModel().beginUpdate();
                const response = window.prompt("response class?");
                const botResponse = new BotResponse(response);
                botResponse.insertIntoGraph(graph, parent);
                botResponse.addReplyButton("ok");
                botResponse.addInlineButton("nop", "damn_action");
                const message = window.prompt("Quick reply?");
                const edgeValue = { type: "user_button", value: message };
                edgeValue.toString = () => edgeValue.value;
                graph.insertEdge(
                  parent,
                  null,
                  edgeValue,
                  cell,
                  botResponse.vertex,
                  "edgeStyle=orthogonalEdgeStyle"
                );
                graph.getModel().endUpdate();
              });
              break;
            case "ReplyButton":
              menu.addItem("Add bot response", null, function() {
                graph.getModel().beginUpdate();
                const response = window.prompt("response class?");
                const botResponse = new BotResponse(response);
                botResponse.insertIntoGraph(graph, parent);
                const edgeValue = {
                  type: "user_button",
                  value: cell.getAttribute("value")
                };
                graph.insertEdge(
                  parent,
                  null,
                  edgeValue,
                  cell,
                  botResponse.vertex,
                  "edgeStyle=orthogonalEdgeStyle"
                );
                graph.getModel().endUpdate();
              });
              break;
              break;
            default:
            break;
          }
        }
        menu.addItem("Show conversation", null, function() {
                const model = graph.getModel();
                generateRecipe(model)
                console.log(model.cells)
        });
      };
      graph.getModel().addListener(mxEvent.CHANGE, function(sender, evt) {
        console.log(graph.getModel());
        graph.getModel().beginUpdate();
        evt.consume();
        console.log("update");
        graph.getModel().endUpdate();
        self_.flow = Object.assign({}, graph.getModel());
      });
    }
  }
};
</script>

    <style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
