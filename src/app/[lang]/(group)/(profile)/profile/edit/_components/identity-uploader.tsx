"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";

type IdentityUploaderProps = {
  userId: string;
  label: string;
  currentUrl?: string | null;
  onUploadComplete: (url: string) => void;
};

export function IdentityUploader({
  userId,
  label,
  currentUrl,
  onUploadComplete,
}: IdentityUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const supabase = createClient();

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to 'avatar' or your identity docs bucket
      const { error: uploadError } = await supabase.storage
        .from("avatar")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("avatar").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      setPreviewUrl(publicUrl);
      onUploadComplete(publicUrl);
      toast.success(`${label} uploaded successfully!`);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload ${label}. Please ensure the 'avatar' storage bucket exists in Supabase.`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="border border-border/60 rounded-xl p-4 bg-card/50 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-card-foreground">{label}</span>
        {previewUrl && (
          <span className="flex items-center text-xs text-green-500 gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {previewUrl ? (
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
            <img src={previewUrl} alt={label} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-muted-foreground border border-dashed border-border">
            <Upload className="w-5 h-5 opacity-60" />
          </div>
        )}

        <div className="flex-1">
          <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/95 transition">
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> Uploading...
              </>
            ) : (
              "Upload Image"
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
          <p className="text-[11px] text-muted-foreground mt-1">
            PNG, JPG or WEBP (Max 5MB)
          </p>
        </div>
      </div>
    </div>
  );
}
