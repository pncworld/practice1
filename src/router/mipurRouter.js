import PUR01_009RPT from "@/views/MIPUR/PUR01_009RPT.vue";
import PUR01_010RPT from "@/views/MIPUR/PUR01_010RPT.vue";
import PUR02_012RPT from "@/views/MIPUR/PUR02_012RPT.vue";
import PUR02_014RPT from "@/views/MIPUR/PUR02_014RPT.vue";
import PUR02_015INS from "@/views/MIPUR/PUR02_015INS.vue";
import PUR02_016RPT from "@/views/MIPUR/PUR02_016RPT.vue";
import PUR02_031INS from "@/views/MIPUR/PUR02_031INS.vue";
import PUR03_005INS from "@/views/MIPUR/PUR03_005INS.vue";
import PUR03_006INS from "@/views/MIPUR/PUR03_006INS.vue";
import PUR03_006RPT from "@/views/MIPUR/PUR03_006RPT.vue";
import PUR03_016RPT from "@/views/MIPUR/PUR03_016RPT.vue";
import PUR04_001INS from "@/views/MIPUR/PUR04_001INS.vue";

export default function mipurRouter() {
  return [
    {
      path: "PUR03_006INS.xml",
      component: PUR03_006INS,
    },
    {
      path: "PUR01_010RPT.xml",
      component: PUR01_010RPT,
    },
    {
      path: "PUR03_016RPT.xml",
      component: PUR03_016RPT,
    },
    {
      path: "PUR02_031INS.xml",
      component: PUR02_031INS,
    },
    {
      path: "PUR02_015INS.xml",
      component: PUR02_015INS,
    },
    {
      path: "PUR02_016RPT.xml",
      component: PUR02_016RPT,
    },
    {
      path: "PUR02_012RPT.xml",
      component: PUR02_012RPT,
    },
    {
      path: "PUR01_009RPT.xml",
      component: PUR01_009RPT,
    },
    {
      path: "PUR04_001INS.xml",
      component: PUR04_001INS,
    },
    {
      path: "PUR03_005INS.xml",
      component: PUR03_005INS,
    },
    {
      path: "PUR03_006RPT.xml",
      component: PUR03_006RPT,
    },
    {
      path: "PUR02_014RPT.xml",
      component: PUR02_014RPT,
    },
  ];
}
