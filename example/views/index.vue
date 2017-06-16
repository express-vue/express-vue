<template lang="html">
    <div>
        <h1>{{title}}</h1>
        <p>Welcome to the {{title}} demo. Click a link:</p>
        <button type="button" name="button" v-on:click="hello">Say FOO</button>
        <input v-model="message" placeholder="edit me">
        <message-comp :message="message"></message-comp>
        <users :users="users"></users>

    </div>
</template>

<script>
export default {
    data: function() {
        return {
        }
    }
}
</script>

<style lang="css">
</style>
