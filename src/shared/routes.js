const routes = Object.freeze({
  root: "/",
  signIn: "/signin",
  projects: "/projects",
  project: "/projects/:id",
});

export const generateRoute = (route, data) => {
  if (route === routes.projects) {
    return `${routes.projects}/${data}`;
  }
  return "/";
};

export default routes;
