import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";

import { VerifyCallback } from "passport-oauth2";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BACKEND_URL } from "../libs/env";
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
      done: VerifyCallback
    ) => {
      return done(null, profile);
    }
  )
);

// 序列化與反序列化
/**
 * 使用者登入 → Passport → serializeUser(user) → session 存 user.id
 * 使用者下一次請求 → session 拿 user.id → deserializeUser(id) → req.user = 完整 user
 */
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user as Express.User);
});
    
export default passport;
