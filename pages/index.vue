<template>
  <section class="container">
    <div ref="graphContainer"
         style="position:relative;overflow:hidden;width:100%;height:100vh;background:#EEE;cursor:default;">
    </div>
    <chat :flow="json"/>
  </section>
</template>
<script>

  import Chat from "../components/Chat";

  export default {
    components: {Chat},
    data() {
      return {
        json: {}
      }
    },
    methods: {
      getJson(graph) {
        const encoder = new mxCodec();
        const node = encoder.encode(graph.getModel());
        const testString = mxUtils.getXml(node);   // fetch xml (string or document/node)
        var result = xmlToJSON.parseString(testString);   // parses to JSON object
        return result;
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

        // Adds cells to the model in a single step
        graph.getModel().beginUpdate();
        try {
          const v1 = graph.insertVertex(parent, null, 'Flow 1', 20, 20, 80, 30);
          const v2 = graph.insertVertex(parent, null, 'Flow 2', 200, 150, 80,
            30);
          const e1 = graph.insertEdge(parent, null, '', v1, v2);
          console.log(parent);
        }
        finally {
          // Updates the display
          graph.getModel().endUpdate();
        }
        this.json = this.getJson(graph);

        // Configures automatic expand on mouseover
        graph.popupMenuHandler.autoExpand = true;

        // Installs context menu
        let self_ = this;
        graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
          menu.addItem('Add bot response', null, function () {
            graph.getModel().beginUpdate();
            console.log(cell);
            const vertex = graph.insertVertex(parent, null, 'New Flow', 50, 50,
              50, 50);
            graph.insertEdge(parent, null, '', cell, vertex);
            graph.getModel().endUpdate();
            self_.json = self_.getJson(graph);
          });

          menu.addItem('Dump json', null, function () {
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
          graph.getModel().beginUpdate();
          evt.consume();
          self_.json = self_.getJson(graph)
          graph.getModel().endUpdate();
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
