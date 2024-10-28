import CancelSales from '@/views/CancelSales.vue';
import DailySales2 from '@/views/DailySales2.vue';
import MasterEnroll from '@/views/masterEnroll.vue';
import MST57_001INS from '@/views/MST57_001INS.vue';
import MST57_002INS from '@/views/MST57_002INS.vue';
import StoreEnroll from '@/views/StoreEnroll.vue';

export default function salesRouter() {
    return [
      {
        path: 'MST01_032INS.xml',
        name: 'masterEnroll',
        component: MasterEnroll
      }
      ,{
        path: 'MST01_002INS.xml',
        name: 'storeEnroll',
        component: StoreEnroll
      },
      {
        path : "MST57_001INS.xml",
        component : MST57_001INS
      },
      {
        path : "MST57_002INS.xml",
        component : MST57_002INS
      }
    ];
  }
  