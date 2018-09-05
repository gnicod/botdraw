<template>
  <section class="container">
    <div ref="graphContainer"
         style="position:relative;overflow:hidden;width:100%;height:100vh;background:#EEE;cursor:default;">
    </div>
    <chat :flow="flow"/>
  </section>
</template>
<script>

  import Chat from "../components/Chat";

  export default {
    components: {Chat},
    data() {
      return {
        flow: {}
      }
    },
    methods: {
      getJson(graph) {
        const encoder = new mxCodec();
        const node = encoder.encode(graph.getModel());
        const testString = mxUtils.getXml(node);   // fetch xml (string or document/node)
        return xmlToJSON.parseString(testString);
      }
    },
    mounted() {
      let container = this.$refs.graphContainer;
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error('Browser is not supported!', 200, false);
      }
      else {
        // Disables the built-in context menu
        mxEvent.disableContextMenu(container);

        // Creates the graph inside the given container
        const graph = new mxGraph(container);

        // Enables rubberband selection
        new mxRubberband(graph);

        // Gets the default parent for inserting new cells. This
        // is normally the first child of the root (ie. layer 0).
        const parent = graph.getDefaultParent();

        graph.getLabel = function (state) {
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
          const v1 = graph.insertVertex(parent, null, 'Flow 1', 20, 20, 80, 30);
          const v2 = graph.insertVertex(parent, null, 'Flow 2', 200, 150, 80,
            30);
          const edgeValue = {type: "user_message", value: "EDGE VALUE"}
          graph.insertEdge(parent, null, edgeValue, v1, v2);
        }
        finally {
          graph.getModel().endUpdate();
        }
        this.json = this.getJson(graph);

        // Configures automatic expand on mouseover
        graph.popupMenuHandler.autoExpand = true;

        // Installs context menu
        let self_ = this;
        graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
          /**
           * Add message from bot triggered by a NLU
           **/
          menu.addItem('Add bot response (NLU)', null, function () {
            graph.getModel().beginUpdate();
            const message = window.prompt('Message from user?');
            const vertex = graph.insertVertex(parent, null,
              'New message', 50, 50, 50, 50);
            const edgeValue = {type: "user_message", value: message};
            graph.insertEdge(parent, null, edgeValue, cell, vertex);
            graph.getModel().endUpdate();
          });
          /**
           * Add message from bot triggered by a quick reply
           **/
          menu.addItem('Add bot response (Bot response)', null, function () {
            graph.getModel().beginUpdate();
            const message = window.prompt('Message from user?');
            const vertex = graph.insertVertex(parent, null,
              'New message', 50, 50, 50, 50);
            const edgeValue = {type: "user_button", value: message};
            edgeValue.toString = () => edgeValue.value;
            graph.insertEdge(parent, null, edgeValue, cell, vertex);
            graph.getModel().endUpdate();
          });

          menu.addItem('Show conversation', null, function () {
            console.log(JSON.stringify(self_.getJson(graph), null, 4));

          });

          /**
           menu.addSeparator();
           const submenu1 = menu.addItem('Submenu 1', null, null);
           menu.addItem('Subitem 1', null, function () {
            alert('Subitem 1');
          }, submenu1);
           menu.addItem('Subitem 1', null, function () {
            alert('Subitem 2');
          }, submenu1);
           **/
        };
        graph.getModel().addListener(mxEvent.CHANGE, function (sender, evt) {
          console.log(graph.getModel());
          graph.getModel().beginUpdate();
          evt.consume();
          console.log('update');
          graph.getModel().endUpdate();
          self_.flow = Object.assign({}, graph.getModel());
        });
      }
    }
  }
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
