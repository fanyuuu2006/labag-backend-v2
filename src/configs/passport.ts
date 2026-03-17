import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";

import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";

import { VerifyCallback } from "passport-oauth2";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  BACKEND_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} from "../libs/env";
import { scopes } from "../libs/passport";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID ?? "",
      clientSecret: GOOGLE_CLIENT_SECRET ?? "",
      callbackURL: `${BACKEND_URL}/v1/auth/google/callback`,
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: VerifyCallback,
    ) => {
      return done(null, profile);
    },
  ),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID ?? "",
      clientSecret: GITHUB_CLIENT_SECRET ?? "",
      callbackURL: `${BACKEND_URL}/v1/auth/github/callback`,
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: VerifyCallback,
    ) => {
      return done(null, profile);
    },
  ),
);

// 由於改用 JWT，不再需要序列化與反序列化
// passport.serializeUser((user, done) => { ... });
// passport.deserializeUser((user, done) => { ... });

export default passport;
