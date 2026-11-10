import mobileSales from "./mobileSales";

export default function mobileMaster() {
    return [
        {
            // 모바일 메뉴 관리 (메뉴 목록·상세·초간단 메뉴등록·AI 메뉴관리) — /m/MIMASTER/menuManage
            path: "menuManage",
            component: () => import("@/views/MOBILE/master/menuManage.vue"),
        },
    ];
  }
  