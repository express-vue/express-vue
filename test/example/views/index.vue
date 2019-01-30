<template>
    <div>
        <h1>{{$root.title}}</h1>
        <p>Welcome to the {{$root.title}} demo. Click a link:</p>
        <button type="button" name="button" v-on:click="hello">Say FOO</button>
        <input v-model="$root.message" placeholder="edit me">
        <message-comp :message="$root.message"></message-comp>
        <users :users="$root.users"></users>
    </div>
</template>

<script>
import messageComp from '../components/message-comp.vue';
import users from '../components/users.vue';
import exampleMixin from '../mixins/exampleMixin';
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
