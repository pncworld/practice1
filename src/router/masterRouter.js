
import MST01_002INS from "@/views/MIMASTER/MST01_002INS.vue";
import MST01_032INS from "@/views/MIMASTER/MST01_032INS.vue";
import MST05_004INS from "@/views/MIMASTER/MST05_004INS.vue";
import MST05_011INS from "@/views/MIMASTER/MST05_011INS.vue";
import MST44_002INS from "@/views/MIMASTER/MST44_002INS.vue";
import MST44_043INS from "@/views/MIMASTER/MST44_043INS.vue";
import MST44_052INS from "@/views/MIMASTER/MST44_052INS.vue";
import MST44_054INS from "@/views/MIMASTER/MST44_054INS.vue";
import MST44_055INS from "@/views/MIMASTER/MST44_055INS.vue";
import MST44_058INS from "@/views/MIMASTER/MST44_058INS.vue";
import MST44_059INS from "@/views/MIMASTER/MST44_059INS.vue";
import MST44_060INS from "@/views/MIMASTER/MST44_060INS.vue";
import MST44_061INS from "@/views/MIMASTER/MST44_061INS.vue";
import MST57_001INS from "@/views/MIMASTER/MST57_001INS.vue";
import MST57_002INS from "@/views/MIMASTER/MST57_002INS.vue";



export default function salesRouter() {
    return [
      {
        path: 'MST01_032INS.xml',

        component: MST01_032INS
      }
      ,{
        path: 'MST01_002INS.xml',
        name: 'storeEnroll',
        component: MST01_002INS
      },
      {
        path : "MST57_001INS.xml",
        component : MST57_001INS
      },
      {
        path : "MST57_002INS.xml",
        component : MST57_002INS
      },
      {
        path : "MST05_004INS.xml",
        component : MST05_004INS
      }
      ,
      {
        path : "MST05_011INS.xml",
        component : MST05_011INS
      }
      ,
      {
        path : "MST44_052INS.xml",
        component : MST44_052INS
      }
      ,
      {
        path : "MST44_054INS.xml",
        component : MST44_054INS
      }
      ,
      {
        path : "MST44_058INS.xml",
        component : MST44_058INS
      }
      ,
      {
        path : "MST44_055INS.xml",
        component : MST44_055INS
      }
      ,
      {
        path : "MST44_043INS.xml",
        component : MST44_043INS
      }
      ,
      {
        path : "MST44_059INS.xml",
        component : MST44_059INS
      }
      ,
      {
        path : "MST44_002INS.xml",
        component : MST44_002INS
      }
      ,
      {
        path : "MST44_060INS.xml",
        component : MST44_060INS
      }
      ,
      {
        path : "MST44_061INS.xml",
        component : MST44_061INS
      }
    ];
  }
  