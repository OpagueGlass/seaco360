import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  LayoutDashboard,
  LayoutDashboardIcon,
  Home,
  BarChart,
  PieChart,
  Activity,
} from "lucide-react";

import { useAuth } from "@/context/auth-context";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  const { session } = useAuth();

  const menuList = [
    {
      groupLabel: "Visualisations",
      menus: [
        {
          href: "/brief",
          label: "Community Briefs",
          icon: PieChart,
        },
        {
          href: "/round",
          label: "Health Rounds",
          icon: Activity,
          // submenus: [
          //   {
          //     href: "/round/2013",
          //     label: "2013",
          //   },
          //   {
          //     href: "/round/2018",
          //     label: "2018",
          //   },
          //   {
          //     href: "/round/2023",
          //     label: "2023",
          //   },
          // ],
        },
      ],
    },

    // {
    //   groupLabel: "Health Rounds",
    //   menus: [
    //     {
    //       href: "",
    //       label: "Posts",
    //       icon: SquarePen,
    //       submenus: [
    //         {
    //           href: "/posts",
    //           label: "All Posts",
    //         },
    //         {
    //           href: "/posts/new",
    //           label: "New Post",
    //         },
    //       ],
    //     },
    //     {
    //       href: "/categories",
    //       label: "Categories",
    //       icon: Bookmark,
    //     },
    //     {
    //       href: "/tags",
    //       label: "Tags",
    //       icon: Tag,
    //     },
    //   ],
    // },
    // {
    //   groupLabel: "Settings",
    //   menus: [
    //     {
    //       href: "/users",
    //       label: "Users",
    //       icon: Users,
    //     },
    //     {
    //       href: "/account",
    //       label: "Account",
    //       icon: Settings,
    //     },
    //   ],
    // },
  ];

  if (session) {
    menuList.push({
      groupLabel: "Administration",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutDashboardIcon,
        },
      ],
    });
  }

  return menuList;
}
