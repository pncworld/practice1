import DetailGroupSales from "@/views/MOBILE/sales/detailGroupSales.vue";
import DetailSales from "@/views/MOBILE/sales/detailSales.vue";
import SalesByCreditCard from "@/views/MOBILE/sales/salesByCreditCard.vue";
import SalesByMenu from "@/views/MOBILE/sales/SalesByMenu.vue";
import SalesByRealTime from "@/views/MOBILE/sales/salesByRealTime.vue";
import SalesByStore from "@/views/MOBILE/sales/salesByStore.vue";
import SalesByTime from "@/views/MOBILE/sales/salesByTime.vue";
import mobileMaster from "./mobileMaster";
import mobileSales from "./mobileSales";
import SalesByDays from "@/views/MOBILE/sales/salesByDays.vue";
import SalesVoidReport from "@/views/MOBILE/sales/salesVoidReport.vue";
import OpenAndClose from "@/views/MOBILE/sales/openAndClose.vue";
import TaxReport from "@/views/MOBILE/sales/taxReport.vue";
import TableReport from "@/views/MOBILE/sales/tableReport.vue";
import CategoryManage from "@/views/MOBILE/tablepos/categoryManage.vue";
import MenuSoldOut from "@/views/MOBILE/tablepos/menuSoldOut.vue";

export default function mobileRouter() {
  return [
    {
      path: "", // 기본 하위 경로 (빈 경로)
      component: () => import("../views/MOBILE/common/mobileLogin.vue"), // 기본 컴포넌트
    },
    {
      path: "MISALES",
      //component : BasicLayout ,
      children: mobileSales(),
    },
    {
      path: "MIMASTER",
      //component : BasicLayout ,
      children: mobileMaster(),
    },
    {
      path: "homepage",
      //component : BasicLayout ,
      component: () => import("../views/homePage.vue"),
    },
    {
      path: "20002",
      //component : BasicLayout ,
      component: DetailSales,
    },
    {
      path: "20003",
      //component : BasicLayout ,
      component: DetailGroupSales,
    },
    {
      path: "20004",
      //component : BasicLayout ,
      component: SalesByMenu,
    },
    {
      path: "20005",
      //component : BasicLayout ,
      component: SalesByCreditCard,
    },
    {
      path: "20006",
      //component : BasicLayout ,
      component: SalesByTime,
    },
    {
      path: "20007",
      //component : BasicLayout ,
      component: SalesByStore,
    },
    {
      path: "20008",
      //component : BasicLayout ,
      component: SalesByRealTime,
    },
    {
      path: "20009",
      //component : BasicLayout ,
      component: SalesByDays,
    },
    {
      path: "20010",
      //component : BasicLayout ,
      component: SalesVoidReport,
    },
    {
      path: "20011",
      //component : BasicLayout ,
      component: OpenAndClose,
    },
    {
      path: "20012",
      //component : BasicLayout ,
      component: TaxReport,
    },
    {
      path: "20013",
      //component : BasicLayout ,
      component: TableReport,
    },
    {
      path: "50001",
      //component : BasicLayout ,
      component: CategoryManage,
    },
    {
      path: "50002",
      //component : BasicLayout ,
      component: MenuSoldOut,
    },
  ];
}
