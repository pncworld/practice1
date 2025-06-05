import HR01_002INS from "@/views/MIHR/HR01_002INS.vue";
import HR01_003INS from "@/views/MIHR/HR01_003INS.vue";

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
  ];
}
