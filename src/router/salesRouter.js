
import SLS06_003RPT from '@/views/MISALE/SLS06_003RPT.vue';
import SLS06_004RPT from '@/views/MISALE/SLS06_004RPT.vue';
import SLS08_001RPT from '@/views/MISALE/SLS08_001RPT.vue';

export default function salesRouter() {
    return [
      {
        path: 'SLS06_004RPT.xml',
        component: SLS06_004RPT
      },
      {
        path: 'SLS06_003RPT.xml',
        component: SLS06_003RPT
      }
      ,
      {
        path: 'SLS08_001RPT.xml',
        component: SLS08_001RPT
      }
      ,
    
    ];
  }
  