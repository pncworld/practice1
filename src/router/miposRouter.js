import MST01_001POS from "@/views/MIPOS/MST01_001POS.vue";
import MST01_002POS from "@/views/MIPOS/MST01_002POS.vue";

export default function miposRouter() {
  return [
    {
      path: "MST01_001POS.xml",
      component: MST01_001POS,
    },
    {
      path: "MST01_002POS.xml",
      component: MST01_002POS,
    },
  ];
}
