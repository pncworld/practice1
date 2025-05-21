import ACT04_002RPT from "@/views/MIACCOUNT/ACT04_002RPT.vue";
import ACT04_003RPT from "@/views/MIACCOUNT/ACT04_003RPT.vue";
import ACT09_001RPT from "@/views/MIACCOUNT/ACT09_001RPT.vue";
import ACT09_002RPT from "@/views/MIACCOUNT/ACT09_002RPT.vue";

export default function accountRouter() {
  return [
    {
      path: "ACT09_001RPT.xml",
      component: ACT09_001RPT,
    },
    {
      path: "ACT09_002RPT.xml",
      component: ACT09_002RPT,
    },
    {
      path: "ACT04_002RPT.xml",
      component: ACT04_002RPT,
    },
    {
      path: "ACT04_003RPT.xml",
      component: ACT04_003RPT,
    },
  ];
}
