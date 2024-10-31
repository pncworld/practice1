import CancelSales from '@/views/CancelSales.vue';
import DailySales2 from '@/views/DailySales2.vue';
import MasterEnroll from '@/views/masterEnroll.vue';
import StoreEnroll from '@/views/StoreEnroll.vue';

export default function salesRouter() {
    return [
      {
        path: 'SLS06_004RPT.xml',
        component: () => import('@/views/DailySales.vue'),
      },
      {
        path: 'SLS06_003RPT.xml',
        name: 'dailysales2',
        component: DailySales2
      }
      ,
      {
        path: 'cancelsales',
        name: 'cancelsales', 
        component: CancelSales
      }
      ,
    
    ];
  }
  