<template>
  <div class="container py-4">
    <div class="d-flex align-items-center gap-3">
      <div
        class="filter-bar d-flex justify-content-end flex-grow-1 p-3 border rounded-pill gap-3"
      >
        <select
          class="filter-item form-select border-0 bg-transparent shadow-none text-center fw-bold"
        >
          <option value="7">1주일</option>
          <option value="30">1개월</option>
          <option value="90">3개월</option>
        </select>
        <select
          class="filter-item form-select border-0 bg-transparent shadow-none text-center fw-bold"
        >
          <option value="all">전체</option>
          <option value="income">수입</option>
          <option value="expense">지출</option>
        </select>
        <select
          class="filter-item form-select border-0 bg-transparent shadow-none text-center fw-bold"
        >
          <option value="">최신순</option>
          <option value="">과거순</option>
        </select>
        <div class="vr mx-2"></div>
        <button
          class="reset-btn d-flex align-items-center gap-1 border-0 bg-transparent me-3"
        >
          reset
        </button>
      </div>
      <div
        class="apply-btn d-flex align-items-center justify-content-center rounded-pill"
      >
        적용
      </div>
    </div>
  </div>
  <div>거래내용출력</div>
</template>

<style scoped>
.filter-bar {
  background-color: #f9f9fb;
  border-color: #d5d5d5 !important;
  min-height: 60px;
}
.apply-btn {
  background-color: #f5cac3;
  color: white;
  width: 100px;
  min-height: 60px;
}
.filter-item {
  width: 150px;
}
.reset-btn {
  color: #ea0234;
}
</style>
