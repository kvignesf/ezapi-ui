const routes = Object.freeze({
  root: "/",
  signIn: "/signin",
  projects: "/projects",
  publish: "/projects/:id/publish",
  project: "/projects/:id",
  privacy: "/privacy",
});

export const generateRoute = (route, data) => {
  if (route === routes.projects) {
    return `${routes.projects}/${data}`;
  } else if (route === routes.publish) {
    return `${routes.projects}/${data}/publish`;
  }
  return "/";
};

export default routes;
