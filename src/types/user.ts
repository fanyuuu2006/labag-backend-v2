import { Profile as GoogleProfile } from "passport-google-oauth20";
import { ALLOW_USER_FIELDS } from "../libs";

export type SignOptions = "google";

export type _Profile = GoogleProfile;

export type SignUser = {
  id: _Profile["id"];
  displayName: _Profile["displayName"];
  emails?: _Profile["emails"];
  photos?: _Profile["photos"];
};

export type SupabaseUser = {
  id: number; // primary key
  created_at: string;
  name?: string;
  email?: string;
  avatar?: string;
  provider_id?: `${SignOptions}-${_Profile["id"]}`;
};

export type SupabaseAllowFieldsUser = Pick<
  SupabaseUser,
  (typeof ALLOW_USER_FIELDS)[number]
>;
