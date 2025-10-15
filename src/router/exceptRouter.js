import CRM20_003INS from "@/views/VUEPOS/CRM20_003INS.vue";
import CRM20_007RPT from "@/views/VUEPOS/CRM20_007RPT.vue";
import CRM20_011INS from "@/views/VUEPOS/CRM20_011INS.vue";
import MST37_071INS from "@/views/VUEPOS/MST37_071INS.vue";
import MST56_001INS from "@/views/VUEPOS/MST56_001INS.vue";
import STK01_011INS from "@/views/VUEPOS/STK01_011INS.vue";

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
    {
      path: "CRM20_011INS.xml",
      component: CRM20_011INS,
    },
    {
      path: "STK01_011INS.xml",
      component: STK01_011INS,
    },
  ];
}
