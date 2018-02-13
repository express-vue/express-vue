<template>
    <div>
        <h1>{{ title }}</h1>
        <p class="test2">{{user.name}}</p>
        <p>I am {{user.age}} years old</p>
    </div>
</template>

<script>
export default {
    data: function() {
        return {}
    }
}
</script>

<style>
.test2 {
    color: blue;
}
</style>
