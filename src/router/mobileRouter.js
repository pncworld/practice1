import HomePage from "@/views/homePage.vue";
import MobileLogin from "@/views/MOBILE/common/mobileLogin.vue";
import mobileMaster from "./mobileMaster";
import mobileSales from "./mobileSales";
import DetailSales from "@/views/MOBILE/sales/detailSales.vue";


export default function mobileRouter() {
    return [
        {
            path: '',  // 기본 하위 경로 (빈 경로)
            component: MobileLogin // 기본 컴포넌트
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
            component: HomePage
        },
        {
            path: '20002',
            //component : BasicLayout ,
            component: DetailSales
        },
     
    ];
  }
  