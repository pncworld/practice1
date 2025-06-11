import HR01_002INS from "@/views/MIHR/HR01_002INS.vue";
import HR01_003INS from "@/views/MIHR/HR01_003INS.vue";
import HR01_004INS from "@/views/MIHR/HR01_004INS.vue";
import HR01_005INS from "@/views/MIHR/HR01_005INS.vue";
import HR01_006INS from "@/views/MIHR/HR01_006INS.vue";

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
  ];
}
