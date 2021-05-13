import { QueryClient } from "react-query";

export const queries = {
  projects: "projects",
  project: "project",
};

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: 0,
    },
    queries: {
      retry: 0,
    },
  },
});

export const clearQueryCache = (queryClient) => {
  if (queryClient) {
    /**
     * Clearing all queries
     */
    queryClient.cancelMutations();
    queryClient.cancelQueries();
    queryClient.clear();
  }
};

export default queryClient;
