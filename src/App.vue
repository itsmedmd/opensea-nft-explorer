<template>
  <div class="app">
    <div class="aside">
      <div class="aside__nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </div>
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss" scoped src="@/assets/styles/components/app.scss"></style>
