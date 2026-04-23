import { rest } from "msw";

const baseURL = "/api/";

export const handlers = [

  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        pk: 1,
        username: "luke",
        email: "",
        first_name: "",
        last_name: "",
        profile_id: 1,
        profile_image:
          "http://res.cloudinary.com/diphfoons/image/upload/v1/default_profile_crbj0v.jpg",
      })
    );
  }),

  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(
      ctx.status(200)
    );
  }),

];