import DetailGroupSales from "@/views/MOBILE/sales/detailGroupSales.vue";
import DetailSales from "@/views/MOBILE/sales/detailSales.vue";
import SalesByMenu from "@/views/MOBILE/sales/SalesByMenu.vue";
import mobileMaster from "./mobileMaster";
import mobileSales from "./mobileSales";
import SalesByCreditCard from "@/views/MOBILE/sales/salesByCreditCard.vue";
import SalesByTime from "@/views/MOBILE/sales/salesByTime.vue";
import SalesByStore from "@/views/MOBILE/sales/salesByStore.vue";


export default function mobileRouter() {
    return [
        {
            path: '',  // 기본 하위 경로 (빈 경로)
            component: () => import('../views/MOBILE/common/mobileLogin.vue') // 기본 컴포넌트
        },
        {
            path: 'MISALES',
            //component : BasicLayout ,
            children: mobileSales()
       },
        {
            path: 'MIMASTER',
            //component : BasicLayout ,
            children: mobileMaster()
        },
        {
            path: 'homepage',
            //component : BasicLayout ,
            component: () => import('../views/homePage.vue')
        },
        {
            path: '20002',
            //component : BasicLayout ,
            component: DetailSales
        },
        {
            path: '20003',
            //component : BasicLayout ,
            component: DetailGroupSales
        },
        {
            path: '20004',
            //component : BasicLayout ,
            component: SalesByMenu
        },
        {
            path: '20005',
            //component : BasicLayout ,
            component: SalesByCreditCard
        },
        {
            path: '20006',
            //component : BasicLayout ,
            component: SalesByTime
        },
        {
            path: '20007',
            //component : BasicLayout ,
            component: SalesByStore
            
        },
     
    ];
  }
  