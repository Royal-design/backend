import jwt from "jsonwebtoken";
import * as fsPromises from "fs/promises";
import path from "path";

const usersFile = path.join(process.cwd(), "model", "users.json");

export const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  const users = JSON.parse(await fsPromises.readFile(usersFile, "utf8"));

  const foundUser = users.find((u) => u.refreshToken === refreshToken);
  if (!foundUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.user !== decoded.user) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { user: decoded.user },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1m" }
    );

    res.json({ accessToken });
  });
};
