import ATT01_002INS from "@/views/MIATTEND/ATT01_002INS.vue";
import ATT07_001INS from "@/views/MIATTEND/ATT07_001INS.vue";

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
  ];
}
