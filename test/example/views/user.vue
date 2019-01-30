<template>
    <div>
        <h1>{{ $root.title }}</h1>
        <p class="test2">{{$root.user.name}}</p>
        <p>I am {{$root.user.age}} years old</p>
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
