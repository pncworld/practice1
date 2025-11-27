import ATT01_002INS from "@/views/MIATTEND/ATT01_002INS.vue";
import ATT07_001INS from "@/views/MIATTEND/ATT07_001INS.vue";
import ATT07_002INS from "@/views/MIATTEND/ATT07_002INS.vue";
import ATT07_003INS from "@/views/MIATTEND/ATT07_003INS.vue";
import ATT04_004RPT from "../views/MIATTEND/ATT04_004RPT.vue";
import ATT02_003INS from "@/views/MIATTEND/ATT02_003INS.vue";

export default function miattendRouter() {
  return [
    {
      path: "ATT01_002INS.xml",
      component: ATT01_002INS,
    },
    {
      path: "ATT07_001INS.xml",
      component: ATT07_001INS,
    },
    {
      path: "ATT07_002INS.xml",
      component: ATT07_002INS,
    },
    {
      path: "ATT07_003INS.xml",
      component: ATT07_003INS,
    },
    {
      path: "ATT04_004RPT.xml",
      component: ATT04_004RPT,
    },
    {
      path: "ATT02_003INS.xml",
      component: ATT02_003INS,
    },
  ];
}
