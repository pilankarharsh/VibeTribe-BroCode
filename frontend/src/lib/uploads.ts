import imageCompression from "browser-image-compression";
import { supabase } from "./supabase"; 

export async function processAndUploadAvatar(
  file: File,
  userId: string
): Promise<string> {
  
  // Test Supabase configuration first
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  try {
    // Step 1: Compress & resize
    const preferredType = "image/avif";
    const fallbackType = "image/webp";

    let compressedFile: File;
    try {
      compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 200,
        fileType: preferredType,
        useWebWorker: true,
      });
    } catch (err) {
        compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 200,
        fileType: fallbackType,
        useWebWorker: true,
      });
    }

    // Step 2: Upload to Supabase with folder structure avatars/userId/avatar.ext
    const ext = compressedFile.type.split("/")[1].toLowerCase();
    const fileName = `${userId}/avatar.${ext}`;

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

    // Step 3: Get public URL
    const { data: publicUrlData } = supabase
      .storage
      .from("avatars")
      .getPublicUrl(fileName);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to retrieve public URL from Supabase");
    }

    return publicUrlData.publicUrl;

  } catch (err) {
    console.error("❌ processAndUploadAvatar error:", err);
    throw err;
  }
}
