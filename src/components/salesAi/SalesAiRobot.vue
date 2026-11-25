<template>
  <!-- AI 매출 도우미 아이콘: 화면 얼굴 로봇 (2026-11-25 후보 B 선택)
       흰 둥근 머리에 검은 화면. 둥둥 떠다니며 고개를 살짝 기울이고, 표정이 바뀐다
       (평소 눈 → 깜박임 → 웃는 눈 ^^ + 미소 + 볼 → 윙크). 주황 안테나 불빛이 깜박인다.
       움직임 줄이기 설정이면 멈춘다 -->
  <span class="sar-bot" aria-hidden="true">
    <span class="sar-ant"></span>
    <span class="sar-head"></span>
    <span class="sar-screen">
      <span class="sar-eyes">
        <span class="sar-eye sar-eye--l"></span>
        <span class="sar-eye sar-eye--r"></span>
      </span>
      <span class="sar-mouth"></span>
      <span class="sar-cheek sar-cheek--l"></span>
      <span class="sar-cheek sar-cheek--r"></span>
    </span>
  </span>
</template>

<style scoped>
.sar-bot {
  position: relative;
  display: inline-block;
  width: 2.25rem;
  height: 2.25rem;
  flex-shrink: 0;
  animation: sar-float 3s ease-in-out infinite;
}

/* 머리 */
.sar-head {
  position: absolute;
  inset: 4px 2px 2px;
  border-radius: 14px;
  background: linear-gradient(160deg, #ffffff, #e2e8f0);
  box-shadow:
    0 2px 6px rgb(15 23 42 / 0.25),
    inset 0 -2px 3px rgb(148 163 184 / 0.4);
}

/* 얼굴 화면 */
.sar-screen {
  position: absolute;
  left: 6px;
  right: 6px;
  top: 10px;
  height: 17px;
  border-radius: 8px;
  background: linear-gradient(180deg, #0f172a, #1e293b);
  overflow: hidden;
}

.sar-eyes {
  position: absolute;
  left: 0;
  right: 0;
  top: 4px;
  display: flex;
  justify-content: center;
  gap: 6px;
}

/* 눈: 평소 = 세로 막대, 웃을 때 = ^ 모양(윗테두리만) */
.sar-eye {
  width: 5px;
  height: 7px;
  border-radius: 3px;
  background: #22d3ee;
  box-shadow: 0 0 6px #22d3ee;
  border-top: 0 solid #22d3ee;
}

.sar-eye--l {
  animation: sar-eye-l 9s ease-in-out infinite;
}

.sar-eye--r {
  animation: sar-eye-r 9s ease-in-out infinite;
}

/* 미소 */
.sar-mouth {
  position: absolute;
  left: 50%;
  bottom: 2px;
  width: 7px;
  height: 3.5px;
  margin-left: -3.5px;
  border: 1.5px solid #22d3ee;
  border-top: 0;
  border-radius: 0 0 6px 6px;
  opacity: 0;
  animation: sar-mouth 9s ease-in-out infinite;
}

/* 볼 */
.sar-cheek {
  position: absolute;
  bottom: 3px;
  width: 3px;
  height: 2px;
  border-radius: 50%;
  background: #f9a8d4;
  opacity: 0;
  animation: sar-mouth 9s ease-in-out infinite;
}

.sar-cheek--l {
  left: 3px;
}

.sar-cheek--r {
  right: 3px;
}

/* 안테나 불빛 */
.sar-ant {
  position: absolute;
  left: 50%;
  top: 0;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  border-radius: 50%;
  background: #f97316;
  box-shadow: 0 0 5px #f97316;
  z-index: 1;
  animation: sar-pulse 1.4s ease-in-out infinite;
}

/* 둥둥: 위아래로 떠다니며 고개를 살짝 기울인다 */
@keyframes sar-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-3px) rotate(-4deg);
  }
  50% {
    transform: translateY(-1px) rotate(0deg);
  }
  75% {
    transform: translateY(-3px) rotate(4deg);
  }
}

/* 표정 9초 주기: 0~30% 평소, 32% 깜박임, 40~62% 웃는 눈, 70~80% 윙크(오른눈) */
@keyframes sar-eye-l {
  0%,
  30%,
  34%,
  38%,
  64%,
  100% {
    height: 7px;
    margin-top: 0;
    background: #22d3ee;
    border-top-width: 0;
    border-radius: 3px;
  }
  32% {
    height: 1px;
    margin-top: 3px;
  }
  40%,
  62% {
    height: 3px;
    margin-top: 2px;
    background: transparent;
    border-top-width: 2px;
    border-radius: 6px 6px 0 0;
  }
}

@keyframes sar-eye-r {
  0%,
  30%,
  34%,
  38%,
  64%,
  68%,
  82%,
  100% {
    height: 7px;
    margin-top: 0;
    background: #22d3ee;
    border-top-width: 0;
    border-radius: 3px;
  }
  32% {
    height: 1px;
    margin-top: 3px;
  }
  40%,
  62% {
    height: 3px;
    margin-top: 2px;
    background: transparent;
    border-top-width: 2px;
    border-radius: 6px 6px 0 0;
  }
  70%,
  80% {
    height: 1.5px;
    margin-top: 3px;
    border-radius: 2px;
  }
}

@keyframes sar-mouth {
  0%,
  38%,
  64%,
  100% {
    opacity: 0;
  }
  42%,
  60% {
    opacity: 1;
  }
}

@keyframes sar-pulse {
  50% {
    opacity: 0.3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sar-bot,
  .sar-eye--l,
  .sar-eye--r,
  .sar-mouth,
  .sar-cheek,
  .sar-ant {
    animation: none;
  }
}
</style>
