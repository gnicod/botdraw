<template>
  <div :class="{
  bot_message: message.type === 'bot_message',
  user_message: message.type === 'user_message',
  user_button: message.type === 'user_button',
}">
    <span v-html="content"></span>
  </div>
</template>

<style lang="less" type="text/less" scoped>
.bot_message {
  width: 50%;
  background: grey;
  margin-bottom: 10px;
  align-self: flex-start;
}

.user_message {
  width: 50%;
  background: green;
  margin-bottom: 10px;
  align-self: flex-end;
}

.user_button {
  background: blue;
  align-self: center;
  margin-bottom: 10px;
}
</style>

<script>
export default {
  props: {
    message: ""
  },
  computed: {
    content() {
      if (Array.isArray(this.message)) {
        return this.message.map(msg => `<div class='qreply'>${msg.message}</div>`).join('')
      }
      return this.message.message;
    }
  },
  mounted() {},
  name: "message"
};
</script>
