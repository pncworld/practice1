import CRM20_003INS from "@/views/VUEPOS/CRM20_003INS.vue";
import CRM20_007RPT from "@/views/VUEPOS/CRM20_007RPT.vue";
import MST37_071INS from "@/views/VUEPOS/MST37_071INS.vue";
import MST56_001INS from "@/views/VUEPOS/MST56_001INS.vue";

export default function exceptRouter() {
  return [
    {
      path: "MST56_001INS.xml",
      component: MST56_001INS,
    },
    {
      path: "MST37_071INS.xml",
      component: MST37_071INS,
    },
    {
      path: "CRM20_003INS.xml",
      component: CRM20_003INS,
    },
    {
      path: "CRM20_007RPT.xml",
      component: CRM20_007RPT,
    },
  ];
}
