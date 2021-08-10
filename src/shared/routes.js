const routes = Object.freeze({
  root: "/",
  signIn: "/signin",
  projects: "/projects",
  orders: "/orders",
  payment: "/projects/:projectId/payment",
  paymentForOrder: "/projects/:projectId/payment/:orderId?",
  project: "/projects/:projectId",
  privacy: "/privacy",
  contact: "/contact",
});

export const generateRoute = (route, data) => {
  if (route === routes.projects) {
    return `${routes.projects}/${data}`;
  } else if (route === routes.payment) {
    return `${routes.projects}/${data}/payment`;
  }
  return "/";
};

export default routes;
