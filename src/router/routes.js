const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }]
  },
  {
    path: "/Dashboard",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("layouts/DashboardLayout.vue"),
        children: [
          {
            path: "",
            component: () => import("pages/Dashboard.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/Dashboard2",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("layouts/DashboardLayout.vue"),
        children: [
          {
            path: "",
            component: () => import("pages/Dashboard2.vue")
          }
        ]
      }
    ]
  },
  {
    path: "/Dashboard2",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Dashboard.vue")
      }
    ]
  },
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
