import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import {
  Strategy as GitHubStrategy,
  Profile as GithubProfile,
} from "passport-github2";
import { VerifyCallback } from "passport-oauth2";
import axios from "axios";
import { User } from "../model/User";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    async (
      _accessToken,
      _refreshToken,
      profile: GoogleProfile,
      done: VerifyCallback
    ) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Also check if user exists by email (e.g. signed up manually before)
          user = await User.findOne({ email: profile.emails?.[0].value });

          if (user) {
            user.googleId = profile.id;
            await user.save();
          } else {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0].value,
              profileImage: { url: profile.photos?.[0].value },
              roles: ["user"],
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "http://localhost:8000/auth/github/callback",
      scope: ["user:email"], // 👈 important to request access to emails
    },
    async (
      accessToken: string,
      _refreshToken: string,
      profile: GithubProfile,
      done: VerifyCallback
    ) => {
      try {
        const githubId = profile.id;
        const displayName =
          profile.displayName || profile.username || "No Name";
        let email = profile.emails?.[0]?.value || null;
        const photo = profile.photos?.[0]?.value || null;

        //  If email is not in profile, fetch it via GitHub API
        if (!email) {
          try {
            const emailRes = await axios.get(
              "https://api.github.com/user/emails",
              {
                headers: {
                  Authorization: `token ${accessToken}`,
                  "User-Agent": "Node.js",
                },
              }
            );

            if (Array.isArray(emailRes.data) && emailRes.data.length > 0) {
              const primaryEmailObj =
                emailRes.data.find((e: any) => e.primary) || emailRes.data[0];
              email = primaryEmailObj?.email || null;
            }
          } catch (err) {
            console.warn(" Failed to fetch GitHub email fallback:", err);
          }
        }

        if (!email) {
          return done(new Error("Unable to retrieve email from GitHub"), false);
        }

        //  Find user by GitHub ID or existing email
        let user = await User.findOne({ githubId });
        if (!user) {
          user = await User.findOne({ email });

          if (user) {
            // Link existing account with GitHub
            user.githubId = githubId;
            await user.save();
          } else {
            // Create new user from GitHub data
            user = await User.create({
              githubId,
              name: displayName,
              email,
              profileImage: photo ? { url: photo } : undefined,
              roles: ["user"],
            });
          }
        }

        return done(null, user);
      } catch (err) {
        console.error("❌ GitHub Strategy Error:", err);
        return done(err as Error, false);
      }
    }
  )
);

// ❌ Remove session serialize/deserialize if using JWT
// passport.serializeUser((user: any, done) => {
//   done(null, user.id); // store only user id in the session
// });

// passport.deserializeUser(async (id: string, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

export default passport;
