<template>
  <div class="load-mask">
    <div class="load-card">
      <div class="load-spin"></div>
      <p>불러오는 중</p>
    </div>
  </div>
</template>

<style scoped>
.load-mask {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.28);
}

.load-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  min-width: 8.5rem;
  padding: 1.15rem 1.3rem 1rem;
  border-radius: 1rem;
  background: #fff;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.16);
}

.load-card p {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  color: #64748b;
}

.load-spin {
  width: 1.7rem;
  height: 1.7rem;
  border: 3px solid #e2e8f0;
  border-top-color: #5782ff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
