import mobileSales from "./mobileSales";

export default function mobileMaster() {
    return [
        {
            // 모바일 메뉴 관리 (메뉴 목록·상세·초간단 메뉴등록·AI 메뉴관리) — /m/MIMASTER/menuManage
            path: "menuManage",
            component: () => import("@/views/MOBILE/master/menuManage.vue"),
        },
        {
            // 모바일 PnC# AI 도우미 (통합 AI: 매출 질문 + 메뉴 관리, 2026-11-27) — /m/MIMASTER/aiAssistant
            path: "aiAssistant",
            component: () => import("@/views/MOBILE/master/MobileAiAssistant.vue"),
        },
    ];
  }
  