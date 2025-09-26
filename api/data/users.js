import bcrypt from "bcrypt";

const hashedAdminPwd = await bcrypt.hash("password", 10);

export const users = [
  {
    id: 1,
    user: "admin",
    pwd: hashedAdminPwd,
    refreshToken: "",
    roles: ["Admin", "User", "Editor"],
  },
  {
    id: 2,
    user: "john",
    pwd: hashedAdminPwd,
    refreshToken: "",
    roles: ["Editor"],
  },
];
