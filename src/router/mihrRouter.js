import HR01_002INS from "@/views/MIHR/HR01_002INS.vue";
import HR01_003INS from "@/views/MIHR/HR01_003INS.vue";
import HR01_004INS from "@/views/MIHR/HR01_004INS.vue";
import HR01_005INS from "@/views/MIHR/HR01_005INS.vue";
import HR01_006INS from "@/views/MIHR/HR01_006INS.vue";
import HR04_002RPT from "@/views/MIHR/HR04_002RPT.vue";
import HR02_001INS from "@/views/MIHR/HR02_001INS.vue";
import HR04_009RPT from "@/views/MIHR/HR04_009RPT.vue";
import HR02_003INS from "@/views/MIHR/HR02_003INS.vue";
import HR02_002INS from "@/views/MIHR/HR02_002INS.vue";

export default function mihrRouter() {
  return [
    {
      path: "HR01_002INS.xml",
      component: HR01_002INS,
    },
    {
      path: "HR01_003INS.xml",
      component: HR01_003INS,
    },
    {
      path: "HR01_006INS.xml",
      component: HR01_006INS,
    },
    {
      path: "HR01_004INS.xml",
      component: HR01_004INS,
    },
    {
      path: "HR01_005INS.xml",
      component: HR01_005INS,
    },
    {
      path: "HR04_002RPT.xml",
      component: HR04_002RPT,
    },
    {
      path: "HR02_001INS.xml",
      component: HR02_001INS,
    },
    {
      path: "HR04_009RPT.xml",
      component: HR04_009RPT,
    },
    {
      path: "HR02_003INS.xml",
      component: HR02_003INS,
    },
    {
      path: "HR02_002INS.xml",
      component: HR02_002INS,
    },
  ];
}
