import { Profile as GoogleProfile } from "passport-google-oauth20";
import { Profile as GitHubProfile } from "passport-github2";
import { ALLOW_USER_FIELDS } from "../libs";

export type SignMap = {
  google: GoogleProfile;
  github: GitHubProfile;
};

export type SignOptions = keyof SignMap;
export type SignProfile = SignMap[SignOptions];

export type SignUser = {
  id: SignProfile["id"];
  displayName: SignProfile["displayName"];
  emails?: SignProfile["emails"];
  photos?: SignProfile["photos"];
};

export type SupabaseUser = {
  id: number; // primary key
  created_at: string;
  name?: string;
  email?: string;
  avatar?: string;
  provider_id?: `${SignOptions}-${SignProfile["id"]}`;
};

export type SupabaseAllowFieldsUser = Pick<
  SupabaseUser,
  (typeof ALLOW_USER_FIELDS)[number]
>;
