import SLS02_011RPT from "@/views/MISALE/SLS02_011RPT.vue";
import SLS02_021RPT from "@/views/MISALE/SLS02_021RPT.vue";
import SLS02_030RPT from "@/views/MISALE/SLS02_030RPT.vue";
import SLS04_002RPT from "@/views/MISALE/SLS04_002RPT.vue";
import SLS04_003RPT from "@/views/MISALE/SLS04_003RPT.vue";
import SLS06_002RPT from "@/views/MISALE/SLS06_002RPT.vue";
import SLS06_004RPT from "@/views/MISALE/SLS06_004RPT.vue";
import SLS02_014RPT from "@/views/MISALE/SLS02_014RPT.vue";
import SLS05_002RPT from "@/views/MISALE/SLS05_002RPT.vue";

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
    
      ,
      {
        path : "SLS02_021RPT.xml",
        component : SLS02_021RPT
      }
      ,
      {
        path : "SLS02_030RPT.xml",
        component : SLS02_030RPT
      }
      ,
      {
        path : "SLS02_014RPT.xml",
        component : SLS02_014RPT
      }
      ,
      {
        path : "SLS04_002RPT.xml",
        component : SLS04_002RPT
      }
      ,
      {
        path : "SLS04_003RPT.xml",
        component : SLS04_003RPT
      }
      ,
      {
        path : "SLS05_002RPT.xml",
        component : SLS05_002RPT
      }
    
    ];
  }
  