import CancelSales from '@/views/CancelSales.vue';
import DailySales2 from '@/views/DailySales2.vue';

export default function salesRouter() {
    return [
      {
        path: 'SLS06_004RPT.xml',
        component: () => import('@/views/DailySales.vue'),
      },
      {
        path: 'SLS06_003RPT.xml',
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
  