<template>
  <div>
    <message v-for="m in messages" :message="m" :key="m.i"/>
  </div>
</template>

<style lang="less" type="text/less" scoped>
</style>

<script>
  import Message from "./Message";

  export default {
    components: {Message},
    name: 'chat',
    data() {
      return {
        messages: []
      }
    },
    props: {
      flow: {}
    },
    watch: {
      flow: function (newVal) {
        if (newVal.cells) {
          const edges = Object.values(newVal.cells).filter(cell =>
            cell.edge === true);
          const vertexes = Object.values(newVal.cells).filter(cell =>
            cell.vertex === true);
          const messages = vertexes.map((el, i) => {
            if (typeof el.vertex !== 'undefined') {
              return {
                message: el.value,
                id: el.id,
                type: 'bot_message'
              }
            }
          });
          this.messages = [];
          messages.forEach((el) => {
            const vertexWithEdge = edges.filter(e => e.source.id === el.id);
            this.messages.push(el);
            if (vertexWithEdge.length > 0) {
              const buttons = [];
              vertexWithEdge.forEach(edge => {
                if (edge.value.type === 'user_button') {
                  buttons.push({
                      type: edge.value.type,
                      message: edge.value.value,
                    }
                  )
                } else {
                  this.messages.push({
                      type: edge.value.type,
                      message: edge.value.value,
                    }
                  )
                }
              });
              if (buttons.length > 0) {
                this.messages.push(buttons)
              }
            }
          });
        }
      }
    },
    mounted() {
    }
  };
</script>
