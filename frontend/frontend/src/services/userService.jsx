import API from "./api";

export const loginUser = (data) =>
  API.post("/users/login", data);

export const registerUser = (data) =>
  API.post("/users/register", data);