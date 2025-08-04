import ATT01_002INS from "@/views/MIATTEND/ATT01_002INS.vue";
import MST01_002INS from "@/views/MIMASTER/MST01_002INS.vue";
import MST01_005INS from "@/views/MIMASTER/MST01_005INS.vue";
import MST01_008INS from "@/views/MIMASTER/MST01_008INS.vue";
import MST01_010INS from "@/views/MIMASTER/MST01_010INS.vue";
import MST01_011INS_01 from "@/views/MIMASTER/MST01_011INS_01.vue";
import MST01_014INS from "@/views/MIMASTER/MST01_014INS.vue";
import MST01_032INS from "@/views/MIMASTER/MST01_032INS.vue";
import MST01_032RPT from "@/views/MIMASTER/MST01_032RPT.vue";
import MST01_033INS from "@/views/MIMASTER/MST01_033INS.vue";
import MST05_004INS from "@/views/MIMASTER/MST05_004INS.vue";
import MST05_011INS from "@/views/MIMASTER/MST05_011INS.vue";
import MST36_001INS from "@/views/MIMASTER/MST36_001INS.vue";
import MST36_003INS from "@/views/MIMASTER/MST36_003INS.vue";
import MST36_006INS from "@/views/MIMASTER/MST36_006INS.vue";
import MST36_055INS from "@/views/MIMASTER/MST36_055INS.vue";
import MST37_001INS from "@/views/MIMASTER/MST37_001INS.vue";
import MST37_068INS from "@/views/MIMASTER/MST37_068INS.vue";
import MST37_069INS from "@/views/MIMASTER/MST37_069INS.vue";
import MST37_071INS from "@/views/MIMASTER/MST37_071INS.vue";
import MST40_001INS from "@/views/MIMASTER/MST40_001INS.vue";
import MST42_001INS from "@/views/MIMASTER/MST42_001INS.vue";
import MST43_001INS from "@/views/MIMASTER/MST43_001INS.vue";
import MST44_002INS from "@/views/MIMASTER/MST44_002INS.vue";
import MST44_043INS from "@/views/MIMASTER/MST44_043INS.vue";
import MST44_052INS from "@/views/MIMASTER/MST44_052INS.vue";
import MST44_054INS from "@/views/MIMASTER/MST44_054INS.vue";
import MST44_055INS from "@/views/MIMASTER/MST44_055INS.vue";
import MST44_057INS from "@/views/MIMASTER/MST44_057INS.vue";
import MST44_058INS from "@/views/MIMASTER/MST44_058INS.vue";
import MST44_059INS from "@/views/MIMASTER/MST44_059INS.vue";
import MST44_060INS from "@/views/MIMASTER/MST44_060INS.vue";
import MST44_061INS from "@/views/MIMASTER/MST44_061INS.vue";
import MST44_062INS from "@/views/MIMASTER/MST44_062INS.vue";
import MST44_063INS from "@/views/MIMASTER/MST44_063INS.vue";
import MST44_064INS from "@/views/MIMASTER/MST44_064INS.vue";
import MST49_008INS from "@/views/MIMASTER/MST49_008INS.vue";
import MST56_001INS from "@/views/MIMASTER/MST56_001INS.vue";
import MST57_001INS from "@/views/MIMASTER/MST57_001INS.vue";
import MST57_002INS from "@/views/MIMASTER/MST57_002INS.vue";
import MST_001INS from "@/views/MIMASTER/MST_001INS.vue";
import MST_002INS from "@/views/MIMASTER/MST_002INS.vue";
import NotFound from "@/views/NotFound.vue";

export default function masterRouter() {
  return [
    {
      path: "MST01_002INS.xml",
      name: "storeEnroll",
      component: MST01_002INS,
    },
    {
      path: "MST57_001INS.xml",
      component: MST57_001INS,
    },
    {
      path: "MST57_002INS.xml",
      component: MST57_002INS,
    },
    {
      path: "MST05_004INS.xml",
      component: MST05_004INS,
    },
    {
      path: "MST05_011INS.xml",
      component: MST05_011INS,
    },
    {
      path: "MST44_052INS.xml",
      component: MST44_052INS,
    },
    {
      path: "MST44_054INS.xml",
      component: MST44_054INS,
    },
    {
      path: "MST44_058INS.xml",
      component: MST44_058INS,
    },
    {
      path: "MST44_055INS.xml",
      component: MST44_055INS,
    },
    {
      path: "MST44_043INS.xml",
      component: MST44_043INS,
    },
    {
      path: "MST44_059INS.xml",
      component: MST44_059INS,
    },
    {
      path: "MST44_002INS.xml",
      component: MST44_002INS,
    },
    {
      path: "MST44_060INS.xml",
      component: MST44_060INS,
    },
    {
      path: "MST44_061INS.xml",
      component: MST44_061INS,
    },
    {
      path: "MST44_062INS.xml",
      component: MST44_062INS,
    },
    {
      path: "MST_002INS.xml",
      component: MST_002INS,
    },
    {
      path: "/:pathMatch(.*)*", // 잘못된 경로를 처리
      name: "NotFound",
      component: NotFound, // 404 페이지 컴포넌트
    },
    {
      path: "MST_001INS.xml",
      component: MST_001INS,
    },
    {
      path: "MST36_001INS.xml",
      component: MST36_001INS,
    },
    {
      path: "MST01_008INS.xml",
      component: MST01_008INS,
    },
    {
      path: "MST01_011INS_01.xml",
      component: MST01_011INS_01,
    },
    {
      path: "MST01_010INS.xml",
      component: MST01_010INS,
    },
    {
      path: "MST43_001INS.xml",
      component: MST43_001INS,
    },
    {
      path: "MST01_032INS.xml",
      component: MST01_032INS,
    },
    {
      path: "MST40_001INS.xml",
      component: MST40_001INS,
    },
    {
      path: "MST36_003INS.xml",
      component: MST36_003INS,
    },
    {
      path: "MST36_055INS.xml",
      component: MST36_055INS,
    },
    {
      path: "MST01_033INS.xml",
      component: MST01_033INS,
    },
    {
      path: "MST44_063INS.xml",
      component: MST44_063INS,
    },
    {
      path: "MST44_064INS.xml",
      component: MST44_064INS,
    },
    {
      path: "MST01_014INS.xml",
      component: MST01_014INS,
    },
    {
      path: "MST37_068INS.xml",
      component: MST37_068INS,
    },
    {
      path: "MST37_069INS.xml",
      component: MST37_069INS,
    },
    {
      path: "MST37_071INS.xml",
      component: MST37_071INS,
    },
    {
      path: "MST42_001INS.xml",
      component: MST42_001INS,
    },
    {
      path: "MST49_008INS.xml",
      component: MST49_008INS,
    },
    {
      path: "MST01_032RPT.xml",
      component: MST01_032RPT,
    },
    {
      path: "MST37_001INS.xml",
      component: MST37_001INS,
    },
    {
      path: "MST36_006INS.xml",
      component: MST36_006INS,
    },
    {
      path: "MST56_001INS.xml",
      component: MST56_001INS,
    },
    {
      path: "MST01_005INS.xml",
      component: MST01_005INS,
    },
    {
      path: "MST44_057INS.xml",
      component: MST44_057INS,
    },
  ];
}
