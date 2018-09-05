<template>
  <div :class="{
  bot_message: message.type === 'bot_message',
  user_message: message.type === 'user_message',
  user_button: message.type === 'user_button',
}">
    {{message.message}}
  </div>
</template>

<style lang="less" type="text/less" scoped>
  .bot_message {
    background: grey;
    margin-bottom: 10px;
  }

  .user_message {
    background: green;
    margin-bottom: 10px;
  }

  .user_button {
    background: blue;
    margin-bottom: 10px;
  }
</style>

<script>
  export default {
    props: {
      message: ''
    },
    name: 'message',
  };
</script>
