import SLS02_011RPT from "@/views/MISALE/SLS02_011RPT.vue";
import SLS06_002RPT from "@/views/MISALE/SLS06_002RPT.vue";
import SLS06_004RPT from "@/views/MISALE/SLS06_004RPT.vue";



export default function salesRouter() {
    return [
      {
        path : "SLS02_011RPT.xml",
        component : SLS02_011RPT
      } ,
      {
        path : "SLS06_004RPT.xml",
        component : SLS06_004RPT
      }
      ,
      {
        path : "SLS06_002RPT.xml",
        component : SLS06_002RPT
      }
    
    
    ];
  }
  