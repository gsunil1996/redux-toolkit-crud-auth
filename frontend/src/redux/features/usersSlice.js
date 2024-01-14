import { usersApi } from "../api/usersApiSlice";

export const userSlice = usersApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsersList: builder.query({
      query: () => "/users?page=2",
    }),
  }),
});

export const { useGetUsersListQuery } = userSlice;
