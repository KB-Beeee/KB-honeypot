<template>
  <div class="container mt-3">
    <nav class="d-flex gap-3 mb-4">
      <router-link to="/" class="btn btn-outline-primary">홈</router-link>
      <router-link to="/login" class="btn btn-outline-primary">로그인</router-link>
      <router-link to="/list" class="btn btn-outline-primary">내역</router-link>
      <router-link to="/add" class="btn btn-outline-primary">등록</router-link>
      <router-link to="/profile" class="btn btn-outline-primary">마이페이지</router-link>
    </nav>

    <hr />

    <router-view></router-view>
  </div>
</template>

<style>
/* 간단한 스타일 추가 */
.router-link-active {
  background-color: #f6bd60 !important; /* 메인 컬러 적용 예시 */
  color: white !important;
}
</style>