import STK01_002INS from "@/views/MISTOCK/STK01_002INS.vue";
import STK01_011INS from "@/views/MISTOCK/STK01_011INS.vue";
import STK05_013RPT from "@/views/MISTOCK/STK05_013RPT.vue";
import STK05_018RPT from "@/views/MISTOCK/STK05_018RPT.vue";
import STK07_025RPT from "@/views/MISTOCK/STK07_025RPT.vue";
import STK08_008RPT from "@/views/MISTOCK/STK08_008RPT.vue";
import STK08_019RPT from "@/views/MISTOCK/STK08_019RPT.vue";
import STK08_021MAN from "@/views/MISTOCK/STK08_021MAN.vue";
import STK09_003BAT from "@/views/MISTOCK/STK09_003BAT.vue";
import STK32_001INS from "@/views/MISTOCK/STK32_001INS.vue";
import STKN06_012INS from "@/views/MISTOCK/STKN06_012INS.vue";
import STKN06_013INS from "@/views/MISTOCK/STKN06_013INS.vue";
import STKN06_016RPT from "@/views/MISTOCK/STKN06_016RPT.vue";
import STKN07_012RPT from "@/views/MISTOCK/STKN07_012RPT.vue";
import STKN07_014RPT from "@/views/MISTOCK/STKN07_014RPT.vue";
import STKN07_015RPT from "@/views/MISTOCK/STKN07_015RPT.vue";
import STKN07_016RPT from "@/views/MISTOCK/STKN07_016RPT.vue";
import STKN07_017RPT from "@/views/MISTOCK/STKN07_017RPT.vue";
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
    {
      path: "STK09_003BAT.xml",
      component: STK09_003BAT,
    },
    {
      path: "STKN06_013INS.xml",
      component: STKN06_013INS,
    },
    {
      path: "STKN07_015RPT.xml",
      component: STKN07_015RPT,
    },
    {
      path: "STKN07_016RPT.xml",
      component: STKN07_016RPT,
    },
    {
      path: "STKN07_017RPT.xml",
      component: STKN07_017RPT,
    },
    {
      path: "STK08_019RPT.xml",
      component: STK08_019RPT,
    },
    {
      path: "STK01_002INS.xml",
      component: STK01_002INS,
    },
    {
      path: "STK01_011INS.xml",
      component: STK01_011INS,
    },
    {
      path: "STK32_001INS.xml",
      component: STK32_001INS,
    },
    {
      path: "STK05_013RPT.xml",
      component: STK05_013RPT,
    },
  ];
}
