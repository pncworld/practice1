import STK05_018RPT from "@/views/MISTOCK/STK05_018RPT.vue";
import STK07_025RPT from "@/views/MISTOCK/STK07_025RPT.vue";
import STK08_008RPT from "@/views/MISTOCK/STK08_008RPT.vue";
import STK08_021MAN from "@/views/MISTOCK/STK08_021MAN.vue";
import STKN06_012INS from "@/views/MISTOCK/STKN06_012INS.vue";
import STKN06_016RPT from "@/views/MISTOCK/STKN06_016RPT.vue";
import STKN07_012RPT from "@/views/MISTOCK/STKN07_012RPT.vue";
import STKN07_014RPT from "@/views/MISTOCK/STKN07_014RPT.vue";
import STKN07_018RPT from "@/views/MISTOCK/STKN07_018RPT.vue";

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
    {
      path: "STKN06_012INS.xml",
      component: STKN06_012INS,
    },
    {
      path: "STKN06_016RPT.xml",
      component: STKN06_016RPT,
    },
    {
      path: "STKN07_018RPT.xml",
      component: STKN07_018RPT,
    },
    {
      path: "STK07_025RPT.xml",
      component: STK07_025RPT,
    },
    {
      path: "STK08_008RPT.xml",
      component: STK08_008RPT,
    },
    {
      path: "STK08_021MAN.xml",
      component: STK08_021MAN,
    },
  ];
}
