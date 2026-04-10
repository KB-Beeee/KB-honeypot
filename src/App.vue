<template>
  <div class="app-container">
    <Bar />
    <main class="main-content">
      <router-view />
    </main>
    <footer
      class="footer"
      v-if="$route.path !== '/mypage' && $route.path !== '/'"
    >
      <div class="footer-content">
        <p>
          제작 : 임민지 이은수 정유민 전소현 © 2026 Beeee Company. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Bar from './components/Bar.vue';
</script>

<style>
.swal2-container {
  z-index: 10001 !important;
}
</style>
