import STK05_018RPT from "@/views/MISTOCK/STK05_018RPT.vue";
import STKN07_012RPT from "@/views/MISTOCK/STKN07_012RPT.vue";
import STKN07_014RPT from "@/views/MISTOCK/STKN07_014RPT.vue";

export default function mistockRouter() {
  return [
    {
      path: "STKN07_012RPT.xml",
      component: STKN07_012RPT,
    },
    {
      path: "STKN07_014RPT.xml",
      component: STKN07_014RPT,
    },
    {
      path: "STK05_018RPT.xml",
      component: STK05_018RPT,
    },
  ];
}
