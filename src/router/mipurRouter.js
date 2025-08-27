import PUR01_010RPT from "@/views/MIPUR/PUR01_010RPT.vue";
import PUR02_031INS from "@/views/MIPUR/PUR02_031INS.vue";
import PUR03_006INS from "@/views/MIPUR/PUR03_006INS.vue";
import PUR03_016RPT from "@/views/MIPUR/PUR03_016RPT.vue";

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
  ];
}
