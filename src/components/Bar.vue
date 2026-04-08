<template>
  <nav class="navbar shadow-sm">
    <div class="container-fluid d-flex align-items-center">
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <img
          src="@/assets/images/꿀벌/기본꿀벌.png"
          alt="Honeypot Logo"
          width="40"
          class="me-2"
        />
      </router-link>

      <div class="nav-links d-flex">
        <router-link to="/">홈</router-link>
        <router-link to="/list">거래내역</router-link>
        <router-link to="/mypage">마이페이지</router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
@import '../assets/css/bar.css';
</style>
