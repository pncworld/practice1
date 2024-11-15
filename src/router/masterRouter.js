
import MST01_002INS from "@/views/MIMASTER/MST01_002INS.vue";
import MST01_032INS from "@/views/MIMASTER/MST01_032INS.vue";
import MST05_004INS from "@/views/MIMASTER/MST05_004INS.vue";
import MST05_011INS from "@/views/MIMASTER/MST05_011INS.vue";
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
    ];
  }
  