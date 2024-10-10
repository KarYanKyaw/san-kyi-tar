// import { useAppSelector } from "@/store/hooks";
import {
  BadgeCheck,
  FlipHorizontal2,
  LayoutGrid,
  PackageCheck,
  Ruler,
  Shirt,
  Store,
  ShoppingCart,
  Users2,
  Coins,
  UserPlus,
  Crown,
  FolderOpen,
  SlidersIcon,
  Hash,
  Newspaper,
} from "lucide-react";
import { RulerSquareIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

export interface menu {
  id: number;
  group: string;
  pageName: String;
  path: string;
  icon: ReactNode;
  order?: any;
}

interface menuItems extends Array<menu> {}

export const sidebarMenuItems: menuItems = [
  {
    id: 2,
    group: "control",
    pageName: "Sale",
    path: "/pos/app/sale",
    icon: <ShoppingCart size={20} strokeWidth={1.5} />,
  },

  {
    id: 4,
    group: "report",
    pageName: "Today",
    path: "/pos/app/today-report",
    icon: <Coins size={20} strokeWidth={1.5} />,
  },
  {
    id: 5,
    group: "report",
    pageName: "Time Filter",
    path: "/pos/app/time-filter",
    icon: <Coins size={20} strokeWidth={1.5} />,
  },
  {
    id: 6,
    group: "report",
    pageName: "Brand",
    path: "/pos/app/brand-report",
    icon: <BadgeCheck size={20} strokeWidth={1.5} />,
  },
  {
    id: 7,
    group: "report",
    pageName: "Product Type",
    path: "/pos/app/type-report",
    icon: <Shirt size={20} strokeWidth={1.5} />,
  },
  {
    id: 8,
    group: "report",
    pageName: "Product Categories",
    path: "/pos/app/category-report",
    icon: <FlipHorizontal2 size={20} strokeWidth={1.5} />,
  },
  {
    id: 9,
    group: "report",
    pageName: "Fitting",
    path: "/pos/app/fitting-report",
    icon: <Ruler size={20} strokeWidth={1.5} />,
  },
  {
    id: 10,
    group: "report",
    pageName: "Size",
    path: "/pos/app/sizing-report",
    icon: <RulerSquareIcon className=" me-1" strokeWidth={1.5} />,
  },

  {
    id: 12,
    group: "CRM",
    pageName: "Customer List",
    path: "/pos/app/crm",
    icon: <Users2 size={20} strokeWidth={1.5} />,
  },

  {
    id: 13,
    group: "CRM",
    pageName: "Add Customer",
    path: "/pos/app/add-customer",
    icon: <UserPlus size={20} strokeWidth={1.5} />,
  },

  {
    id: 14,
    group: "CRM",
    pageName: "Level List",
    path: "/pos/app/level-list",
    icon: <Crown size={20} strokeWidth={1.5} />,
  },

  {
    id: 16,
    group: "inventory",
    pageName: "Product List",
    path: "/pos/app/products",
    icon: <PackageCheck size={20} strokeWidth={1.5} />,
  },

  {
    id: 17,
    pageName: "Brand",
    group: "inventory",
    path: "/pos/app/product-brands",
    icon: <BadgeCheck size={20} strokeWidth={1.5} />,
  },

  {
    id: 18,
    pageName: "Type",
    group: "inventory",
    path: "/pos/app/product-types",
    icon: <Shirt size={20} strokeWidth={1.5} />,
  },

  {
    id: 19,
    group: "inventory",
    pageName: "Category",
    path: "/pos/app/product-categories",
    icon: <FlipHorizontal2 size={20} strokeWidth={1.5} />,
  },

  {
    id: 20,
    group: "inventory",
    pageName: "Fitting",
    path: "/pos/app/product-fittings",
    icon: <Ruler size={20} strokeWidth={1.5} />,
  },

  {
    id: 21,
    group: "inventory",
    pageName: "Sizing",
    path: "/pos/app/product-sizings",
    icon: <RulerSquareIcon strokeWidth={1.5} className=" ms-1" />,
  },

  // {
  //   id: 23,
  //   group: "profile",
  //   pageName: "profile",
  //   path: "/pos/app/profile",
  //   icon: <Users2 size={20} strokeWidth={1.5} />,
  // },

  {
    id: 24,
    group: "stock",
    pageName: "Stock",
    path: "/pos/app/stock",
    icon: <Users2 size={20} strokeWidth={1.5} />,
  },
  {
    id: 25,
    group: "stock",
    pageName: "Stock Control",
    path: "/pos/app/control-stock",
    icon: <Users2 size={20} strokeWidth={1.5} />,
  },

  {
    id: 26,
    group: "Ecommerce",
    pageName: "Order",
    path: "/pos/app/order",
    icon: <FolderOpen size={20} strokeWidth={1.5} />,
  },

  {
    id: 27,
    group: "Ecommerce",
    pageName: "Slider",
    path: "/pos/app/slider",
    icon: <SlidersIcon size={20} strokeWidth={1.5} />,
  },

  {
    id: 28,
    group: "Ecommerce",
    pageName: "Category Name",
    path: "/pos/app/category-name",
    icon: <Hash size={20} strokeWidth={1.5} />,
  },

  {
    id: 29,
    group: "Ecommerce",
    pageName: "Coupon",
    path: "/pos/app/coupon",
    icon: <Newspaper size={20} strokeWidth={1.5} />,
  },
];
