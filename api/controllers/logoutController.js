import * as fsPromises from "fs/promises";
import path from "path";

const usersFile = path.join(process.cwd(), "model", "users.json");

export const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); //No content:
  const refreshToken = cookies.jwt;

  const users = JSON.parse(await fsPromises.readFile(usersFile, "utf8"));

  const foundUser = users.find((u) => u.refreshToken === refreshToken);

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }

  const otherUsers = users.filter(
    (u) => u.refreshToken !== foundUser.refreshToken
  );

  const currentUser = { ...foundUser, refreshToken: "" };
  const updatedUsers = [...otherUsers, currentUser];

  await fsPromises.writeFile(usersFile, JSON.stringify(updatedUsers, null, 2));

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //secure:true for production
  res.sendStatus(204);
};
