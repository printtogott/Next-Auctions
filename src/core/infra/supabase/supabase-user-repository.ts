import type { CreateUserParams, LoginParams, User } from "@/core/domains/user";
import type {
  RepoUpdateUserParams,
  UserRepository,
} from "@/core/ports/user-repository";
import { sendAdminVerificationEmail } from "@/lib/email";
import { createClient } from "@/utils/supabase/server";
import { userMapper } from "./user-mapper";

export class SupabaseUserRepository implements UserRepository {
  async me(): Promise<User | null> {
    const client = await createClient();

    const { data: authData, error: authError } = await client.auth.getUser();
    if (authError || !authData.user?.id) return null;

    const { data, error } = await client
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (error) return null;

    return userMapper(data);
  }

  async create(params: CreateUserParams): Promise<User> {
    const client = await createClient();
    const { firstName, lastName, email, password } = params;

    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
    });

    if (authError || !authData.user?.id) {
      throw new Error(`Auth signup failed: ${authError?.message}`);
    }

    const { data: user, error } = await client
      .from("users")
      .insert({
        id: authData.user.id,
        first_name: firstName,
        last_name: lastName,
        email,
      })
      .select()
      .single();

    if (error || !user) {
      throw new Error(`DB insert failed: ${error?.message}`);
    }

    const mapped = userMapper(user);
    if (!mapped) throw new Error("Inserted user is invalid");

    return mapped;
  }

  async login(params: LoginParams): Promise<User> {
    const client = await createClient();

    const { data: authData, error: authError } =
      await client.auth.signInWithPassword(params);

    if (authError || !authData.user?.id) {
      throw new Error(`Login failed: ${authError?.message}`);
    }

    const { data, error } = await client
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (error || !data) {
      throw new Error(`DB fetch after login failed: ${error?.message}`);
    }

    const mapped = userMapper(data);
    if (!mapped) throw new Error("Fetched user is invalid");

    return mapped;
  }

  async logout(): Promise<void> {
    const client = await createClient();
    const { error } = await client.auth.signOut();

    if (error) throw new Error(`Logout failed: ${error.message}`);
  }

  async count(): Promise<number> {
    const client = await createClient();

    const { data, error } = await client
      .from("users_stats")
      .select("total_users")
      .single();

    if (error || !data) return 0;

    return data.total_users;
  }

  async update(params: RepoUpdateUserParams): Promise<User> {
    const client = await createClient();
    const {
      id,
      firstName,
      lastName,
      avatarUrl,
      idFrontUrl,
      idBackUrl,
      faceIdUrl,
    } = params;

    const hasVerificationDocs = Boolean(idFrontUrl || idBackUrl || faceIdUrl);
    const verificationStatus = hasVerificationDocs ? "PENDING" : undefined;

    const updatePayload: Record<string, any> = {
      first_name: firstName,
      last_name: lastName,
      avatar_url: avatarUrl,
    };

    if (hasVerificationDocs) {
      if (idFrontUrl) updatePayload.id_front_url = idFrontUrl;
      if (idBackUrl) updatePayload.id_back_url = idBackUrl;
      if (faceIdUrl) updatePayload.face_id_url = faceIdUrl;
      if (verificationStatus)
        updatePayload.verification_status = verificationStatus;
    }

    const { data: user, error } = await client
      .from("users")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error || !user) {
      throw new Error(`DB update failed: ${error?.message}`);
    }

    // Update Supabase Auth user metadata
    await client.auth.updateUser({
      data: {
        ...(verificationStatus && { verificationStatus }),
        ...(idFrontUrl && { idFrontUrl }),
        ...(idBackUrl && { idBackUrl }),
        ...(faceIdUrl && { faceIdUrl }),
      },
    });

    // Send admin notification email
    if (hasVerificationDocs) {
      try {
        await sendAdminVerificationEmail({
          userId: user.id,
          userEmail: user.email,
          userName:
            `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
            user.email,
          idFrontUrl,
          idBackUrl,
          faceIdUrl,
        });
      } catch (emailErr) {
        console.error("Failed to dispatch admin notification email:", emailErr);
      }
    }

    const mapped = userMapper(user);
    if (!mapped) throw new Error("Updated user is invalid");

    return mapped;
  }
}
