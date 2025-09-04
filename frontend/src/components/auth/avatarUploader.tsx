import Cropper from "react-easy-crop";
import { useState } from "react";

interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

function getCroppedImg(imageSrc: string, pixelCrop: PixelCrop): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], "cropped-image.jpg", { type: blob.type });
        resolve(file);
      }, "image/jpeg");
    };
    image.onerror = (error) => reject(error);
  });
}

export default function AvatarUploader({
  onFileSelect,
  onError,
  onCroppingStateChange,
}: {
  userId: string;
  onFileSelect: (file: File) => void;
  onError?: (msg: string) => void;
  onCroppingStateChange?: (isCropping: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropComplete = (_: { x: number; y: number }, croppedPixels: PixelCrop) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      console.warn("⚠️ No file selected");
      return;
    }
    console.log("📂 File selected:", selectedFile.name, selectedFile.type, selectedFile.size, "bytes");

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setIsCropping(true);
    onCroppingStateChange?.(true);
  };

  const handleFileSelect = () => {
    document.getElementById('avatar-file-input')?.click();
  };

  const handleDoneCropping = async () => {
    if (!preview || !croppedAreaPixels) return;
    try {
      const croppedFile = await getCroppedImg(preview, croppedAreaPixels);
      console.log("✅ Cropped file ready:", croppedFile.name, croppedFile.size, "bytes");
      onFileSelect(croppedFile);
      setIsCropping(false);
      onCroppingStateChange?.(false);
    } catch (error) {
      console.error("❌ Cropping failed", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to crop image";
      onError?.(errorMessage);
      setIsCropping(false);
      onCroppingStateChange?.(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {!file && (
        <>
          <input 
            id="avatar-file-input"
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div
            onClick={handleFileSelect}
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              border: '2px dashed var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: 'var(--color-surface)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-surface)';
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-muted-text)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v12" />
              <path d="M6 12h12" />
            </svg>
          </div>
          <p className="body" style={{ color: 'var(--color-muted-text)', marginTop: 8, fontSize: 14 }}>
            Tap to add profile picture
          </p>
        </>
      )}

      {file && isCropping && (
        <>
          <div style={{ position: "relative", width: 300, height: 300, marginBottom: 16 }}>
            <Cropper
              image={preview!}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <button
            onClick={handleDoneCropping}
            className="btn btn-primary"
            style={{ minWidth: 120 }}
          >
            Done
          </button>
        </>
      )}
    </div>
  );
}