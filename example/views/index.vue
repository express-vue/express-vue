<template>
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
import messageComp from '../example/views/components/message-comp.vue';
import users from '../example/views/components/users.vue';
import exampleMixin from '../example/mixins/exampleMixin';
export default {
    mixins: [exampleMixin],
    data: function () {
        return {
        }
    },
    components: {
        messageComp: messageComp,
        users: users
    }
}
</script>

<style lang="css">

</style>
