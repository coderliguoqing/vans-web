<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <div class="main">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.main{
  height: auto;
  margin-left: 15px;
  margin-right: 15px;
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
