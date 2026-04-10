<template>
  <nav class="navbar shadow-sm" v-if="$route.path !== '/'">
    <div class="container-fluid d-flex align-items-center">
      <router-link to="/home" class="navbar-brand d-flex align-items-center">
        <Bee customClass="nav-bee-logo" />
      </router-link>

      <div class="nav-links d-flex">
        <router-link to="/home">홈</router-link>
        <router-link to="/list">거래내역</router-link>
        <router-link to="/mypage">마이페이지</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import Bee from '../components/bee.vue';
</script>

<style scoped>
@import '../assets/css/bar.css';
</style>
