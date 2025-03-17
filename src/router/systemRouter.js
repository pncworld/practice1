import SYS01_003RPT from "@/views/MISYSTEM/SYS01_003RPT.vue";
import SYS49_002INS from "@/views/MISYSTEM/SYS49_002INS.vue";
import SYS49_003INS from "@/views/MISYSTEM/SYS49_003INS.vue";
import SYS49_016INS from "@/views/MISYSTEM/SYS49_016INS.vue";

export default function systemRouter() {
    return [
     {
        path: 'SYS01_003RPT.xml',
        component: SYS01_003RPT
      },
      {
        path: 'SYS49_002INS.xml',
        component: SYS49_002INS
      },
      {
        path: 'SYS49_003INS.xml',
        component: SYS49_003INS
      },
      {
        path: 'SYS49_016INS.xml',
        component: SYS49_016INS
      },
     
    ];
  }
  