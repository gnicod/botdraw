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
        messages: ['lol', 'lol2']
      }
    },
    props: {
      flow: {}
    },
    watch: {
      flow: function (newVal, oldVal) { // watch it
        if (newVal.mxGraphModel) {
          this.messages = newVal.mxGraphModel[0].root[0].mxCell.filter(el => {
            return typeof el._attr.vertex !== 'undefined'
          }).map(el => {
            return el._attr.value._value
          })
          console.log(this.messages)

        }
      }
    },
    mounted() {
    }
  };
</script>
