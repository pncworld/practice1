import MobileLogin from "@/views/MOBILE/common/mobileLogin.vue";
import mobileMaster from "./mobileMaster";
import mobileSales from "./mobileSales";

export default function mobileRouter() {
    return [
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
     
    ];
  }
  