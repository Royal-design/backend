import bcrypt from "bcrypt";

const hashedAdminPwd = await bcrypt.hash("123456", 10);
const hashedJohnPwd = await bcrypt.hash("password", 10);

export const users = [
  {
    id: 1,
    user: "admin",
    pwd: hashedAdminPwd,
    refreshToken: "",
  },
  {
    id: 2,
    user: "john",
    pwd: hashedJohnPwd,
    refreshToken: "",
  },
];
