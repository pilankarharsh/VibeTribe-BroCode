import imageCompression from "browser-image-compression";
import { getSupabaseClient } from "./supabase";

export async function processAndUploadAvatar(
  file: File,
  userId: string
): Promise<string> {
  console.log("🖼 Starting processAndUploadAvatar for:", userId);

  try {
    // Get Supabase client (will throw error if not on client side)
    const supabase = getSupabaseClient();

    // Step 1: Compress & resize
    const preferredType = "image/avif";
    const fallbackType = "image/webp";

    console.log("⚙️ Compressing image...");
    let compressedFile: File;
    try {
      compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 200,
        fileType: preferredType,
        useWebWorker: true,
      });
      console.log("✅ Compressed to AVIF:", compressedFile.size, "bytes");
    } catch (err) {
      console.warn("⚠️ AVIF compression failed, falling back to WebP:", err);
      compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 200,
        fileType: fallbackType,
        useWebWorker: true,
      });
      console.log("✅ Compressed to WebP:", compressedFile.size, "bytes");
    }

    // Step 2: Upload to Supabase with folder structure avatars/userId/avatar.ext
    const ext = compressedFile.type.split("/")[1].toLowerCase();
    const fileName = `${userId}/avatar.${ext}`;
    console.log("📤 Uploading to Supabase bucket 'avatars' as:", fileName);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, compressedFile, {
        upsert: true,
        contentType: compressedFile.type,
      });

    if (uploadError) {
      console.error("❌ Upload error:", uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
    console.log("✅ Upload successful");

    // Step 3: Get public URL
    console.log("🌐 Retrieving public URL for:", fileName);
    const { data: publicUrlData } = supabase
      .storage
      .from("avatars")
      .getPublicUrl(fileName);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to retrieve public URL from Supabase");
    }

    console.log("🔗 Public URL:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;

  } catch (err) {
    console.error("❌ processAndUploadAvatar error:", err);
    throw err;
  }
}