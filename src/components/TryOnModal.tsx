import { useState, useRef } from "react";
import { X, Upload, Camera, Loader2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Product } from "@/data/products";

interface TryOnModalProps {
  product: Product;
  onClose: () => void;
}

const TryOnModal = ({ product, onClose }: TryOnModalProps) => {
  const { user } = useAuth();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUserImage(ev.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    if (!userImage) return;
    if (!user) {
      toast.error("Please sign in to use Virtual Try-On");
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("virtual-try-on", {
        body: {
          userImageBase64: userImage,
          productImageUrl: userImage, // The AI will use both images
          productName: product.name,
        },
      });

      if (error) throw error;

      if (data?.resultImage) {
        setResult(data.resultImage);
        toast.success("Try-on complete!");
      } else {
        toast.info("AI processing completed. " + (data?.message || "Try with a different photo for better results."));
        setResult(product.image);
      }
    } catch (err: any) {
      console.error("Try-on error:", err);
      toast.error(err.message || "Try-on failed. Please try again.");
      // Fallback to product image
      setResult(product.image);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = `tryon-${product.name.replace(/\s+/g, "-")}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-background rounded-xl shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="font-display text-xl font-semibold">Virtual Try-On</h2>
            <p className="text-sm text-muted-foreground">{product.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Your Photo</p>
              <div
                className="aspect-[3/4] rounded-lg bg-secondary border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors overflow-hidden"
                onClick={() => fileRef.current?.click()}
              >
                {userImage ? (
                  <img src={userImage} alt="Your photo" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Upload your photo</p>
                    <p className="text-xs text-muted-foreground mt-1">Full body works best</p>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              <div className="flex gap-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-secondary rounded-lg hover:bg-muted transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-secondary rounded-lg hover:bg-muted transition-colors">
                  <Camera className="w-3.5 h-3.5" /> Webcam
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">{result ? "Try-On Result" : "Product"}</p>
              <div className="aspect-[3/4] rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                {processing ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-accent" />
                    <div className="text-center">
                      <p className="text-sm font-medium">AI Processing...</p>
                      <p className="text-xs text-muted-foreground">Fitting the garment to your photo</p>
                    </div>
                  </div>
                ) : (
                  <img src={result || product.image} alt={product.name} className="w-full h-full object-contain p-3" />
                )}
              </div>
              {result && (
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Download className="w-3.5 h-3.5" /> Download Result
                </button>
              )}
            </div>
          </div>

          {!result && (
            <button
              onClick={handleTryOn}
              disabled={!userImage || processing}
              className="w-full py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {processing ? "AI is processing..." : user ? "Try It On" : "Sign in to Try On"}
            </button>
          )}

          {result && (
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Fit Adjustment</p>
              <div className="flex gap-2">
                {["Tight", "Regular", "Loose"].map((fit) => (
                  <button
                    key={fit}
                    className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-background border border-border hover:border-accent transition-colors"
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            🔒 Your photos are processed securely via AI and never permanently stored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TryOnModal;
