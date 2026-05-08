import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { getCorsHeaders } from "../_shared/cors.ts";

const BodySchema = z.object({
  projectId: z.string().uuid(),
  imagePath: z.string().min(1),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: getCorsHeaders(req) });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Supabase server credentials are not configured");
    }

    const authorization = req.headers.get("Authorization");
    if (!authorization) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authorization } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL");
    if (!ADMIN_EMAIL) {
      throw new Error("ADMIN_EMAIL is not configured");
    }

    if (user.email !== ADMIN_EMAIL) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { projectId, imagePath } = parsed.data;
    const { data: project, error: projectError } = await adminClient
      .from("projects")
      .select("id, gallery_images")
      .eq("id", projectId)
      .single();

    if (projectError) {
      throw projectError;
    }

    const galleryImages = Array.isArray(project.gallery_images) ? project.gallery_images : [];
    const imageExists = galleryImages.some((image) => {
      if (!image || typeof image !== "object" || Array.isArray(image)) return false;
      return (image as Record<string, unknown>).path === imagePath;
    });

    if (!imageExists) {
      return new Response(JSON.stringify({ error: "Gallery image not found" }), {
        status: 404,
        headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
      });
    }

    const { error: storageError } = await adminClient
      .storage
      .from("project-images")
      .remove([imagePath]);

    if (storageError) {
      throw storageError;
    }

    const nextGalleryImages = galleryImages.filter((image) => {
      if (!image || typeof image !== "object" || Array.isArray(image)) return true;
      return (image as Record<string, unknown>).path !== imagePath;
    });

    const { error: updateError } = await adminClient
      .from("projects")
      .update({
        gallery_images: nextGalleryImages,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (updateError) {
      throw updateError;
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("delete-project-gallery-image failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...getCorsHeaders(req), "Content-Type": "application/json" },
    });
  }
});
