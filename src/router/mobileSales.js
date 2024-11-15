import DailySales from "@/views/mobile/sales/DailySales.vue";
import DaySales from "@/views/mobile/sales/DaySales.vue";
import TimeSales from "@/views/mobile/sales/timeSales.vue";



export default function mobileSales() {
    return [
        {
            path: 'SLS06_004RPT.xml',
            component: DailySales,
          },
          {
            path: 'SLS06_003RPT.xml',
            name: 'dailysales2',
            component: TimeSales
          }
         
          ,
          {
            path: 'SLS06_005RPT.xml', 
            component: DaySales
          }
    ];
  }
  