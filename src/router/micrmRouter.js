import CRM02_002RPT from "@/views/MICRM/CRM02_002RPT.vue";
import CRM03_002INS from "@/views/MICRM/CRM03_002INS.vue";
import CRM02_003RPT from "@/views/MICRM/CRM03_002INS.vue";
import CRM03_004INS from "@/views/MICRM/CRM03_004INS.vue";
import CRM03_011RPT from "@/views/MICRM/CRM03_011RPT.vue";
import CRM03_012RPT from "@/views/MICRM/CRM03_012RPT.vue";
import CRM10_007INS_shy from "@/views/MICRM/CRM10_007INS_shy.vue";
import CRM10_019INS from "@/views/MICRM/CRM10_019INS.vue";
import CRM10_020INS from "@/views/MICRM/CRM10_020INS.vue";
import CRM10_021RPT from "@/views/MICRM/CRM10_021RPT.vue";
import CRM10_022RPT from "@/views/MICRM/CRM10_022RPT.vue";
import CRM10_023RPT from "@/views/MICRM/CRM10_023RPT.vue";
import CRM10_024RPT from "@/views/MICRM/CRM10_024RPT.vue";
import CRM10_025RPT from "@/views/MICRM/CRM10_025RPT.vue";
import CRM20_005RPT from "@/views/MICRM/CRM20_005RPT.vue";
import CRM20_006RPT from "@/views/MICRM/CRM20_006RPT.vue";
import CRM20_007RPT from "@/views/MICRM/CRM20_007RPT.vue";
import CRM20_009RPT from "@/views/MICRM/CRM20_009RPT.vue";
import CRM20_010RPT from "@/views/MICRM/CRM20_010RPT.vue";
import CRM20_012INS from "@/views/MICRM/CRM20_012INS.vue";
import CRM20_013RPT from "@/views/MICRM/CRM20_013RPT.vue";

export default function micrmRouter() {
  return [
    {
      path: "CRM20_005RPT.xml",
      component: CRM20_005RPT,
    },
    {
      path: "CRM20_006RPT.xml",
      component: CRM20_006RPT,
    },
    {
      path: "CRM20_007RPT.xml",
      component: CRM20_007RPT,
    },
    {
      path: "CRM20_009RPT.xml",
      component: CRM20_009RPT,
    },
    {
      path: "CRM20_010RPT.xml",
      component: CRM20_010RPT,
    },
    {
      path: "CRM20_012INS.xml",
      component: CRM20_012INS,
    },
    {
      path: "CRM20_013RPT.xml",
      component: CRM20_013RPT,
    },
    {
      path: "CRM10_021RPT.xml",
      component: CRM10_021RPT,
    },
    {
      path: "CRM10_022RPT.xml",
      component: CRM10_022RPT,
    },
    {
      path: "CRM10_023RPT.xml",
      component: CRM10_023RPT,
    },
    {
      path: "CRM10_024RPT.xml",
      component: CRM10_024RPT,
    },
    {
      path: "CRM10_025RPT.xml",
      component: CRM10_025RPT,
    },
    {
      path: "CRM10_007INS_shy.xml",
      component: CRM10_007INS_shy,
    },
    {
      path: "CRM10_019INS.xml",
      component: CRM10_019INS,
    },
    {
      path: "CRM10_020INS.xml",
      component: CRM10_020INS,
    },
    {
      path: "CRM02_002RPT.xml",
      component: CRM02_002RPT,
    },
    {
      path: "CRM03_002INS.xml",
      component: CRM03_002INS,
    },
    {
      path: "CRM03_012RPT.xml",
      component: CRM03_012RPT,
    },
    {
      path: "CRM03_011RPT.xml",
      component: CRM03_011RPT,
    },
    {
      path: "CRM03_004INS.xml",
      component: CRM03_004INS,
    },
  ];
}
