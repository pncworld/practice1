import CRM10_021RPT from "@/views/MICRM/CRM10_021RPT.vue";
import CRM10_022RPT from "@/views/MICRM/CRM10_022RPT.vue";
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
  ];
}
