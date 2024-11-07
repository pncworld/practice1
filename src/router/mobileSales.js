import CancelSales from '@/views/CancelSales.vue';
import DailySales2 from '@/views/DailySales2.vue';
import DailySales from '@/views/mobile/sales/DailySales.vue';


export default function mobileSales() {
    return [
        {
            path: 'SLS06_004RPT.xml',
            component: DailySales,
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
    ];
  }
  