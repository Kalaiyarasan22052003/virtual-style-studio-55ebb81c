import { useState, useRef } from "react";
import { Upload, Loader2, Download, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const TryOn = () => {
  const { user } = useAuth();
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [clothingName, setClothingName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const personRef = useRef<HTMLInputElement>(null);
  const clothingRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setter(ev.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleTryOn = async () => {
    if (!personImage || !clothingImage) {
      toast.error("Please upload both images");
      return;
    }
    if (!user) {
      toast.error("Please sign in to use Virtual Try-On");
      return;
    }

    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("virtual-try-on", {
        body: {
          userImageBase64: personImage,
          productImageUrl: clothingImage,
          productName: clothingName || "clothing item",
        },
      });

      if (error) throw error;

      if (data?.resultImage) {
        setResult(data.resultImage);
        toast.success("Try-on complete!");
      } else {
        toast.info(data?.message || "Try with different photos for better results.");
      }
    } catch (err: any) {
      console.error("Try-on error:", err);
      toast.error(err.message || "Try-on failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = `vdorbe-tryon-${Date.now()}.png`;
    link.click();
  };

  const handleReset = () => {
    setPersonImage(null);
    setClothingImage(null);
    setClothingName("");
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <div className="text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent via-accent/80 to-gold bg-[length:200%_auto] animate-text-shimmer bg-clip-text text-transparent mb-3">
            Virtual Try-On Studio
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Upload a photo of yourself and any clothing item to see how it looks on you — powered by AI.
          </p>
        </div>

        {result ? (
          <div className="max-w-lg mx-auto space-y-6 animate-fade-up">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary border border-border shadow-lg">
              <img src={result} alt="Try-on result" className="w-full h-full object-contain p-4" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity">
                <Download className="w-4 h-4" /> Download
              </button>
              <button onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary text-foreground font-semibold rounded-lg hover:bg-muted transition-colors">
                Try Another
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Person Image */}
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Step 1 — Your Photo</p>
                <div
                  className="aspect-[3/4] rounded-2xl bg-secondary border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-all duration-300 overflow-hidden group"
                  onClick={() => personRef.current?.click()}
                >
                  {personImage ? (
                    <img src={personImage} alt="Person" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-7 h-7 text-accent" />
                      </div>
                      <p className="font-medium text-foreground">Upload your photo</p>
                      <p className="text-xs text-muted-foreground mt-1">Full body works best • Max 5MB</p>
                    </div>
                  )}
                </div>
                <input ref={personRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setPersonImage)} />
                {personImage && (
                  <button onClick={() => { setPersonImage(null); setResult(null); }}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                    Remove photo
                  </button>
                )}
              </div>

              {/* Clothing Image */}
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Step 2 — Clothing Item</p>
                <div
                  className="aspect-[3/4] rounded-2xl bg-secondary border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-all duration-300 overflow-hidden group"
                  onClick={() => clothingRef.current?.click()}
                >
                  {clothingImage ? (
                    <img src={clothingImage} alt="Clothing" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-7 h-7 text-gold" />
                      </div>
                      <p className="font-medium text-foreground">Upload clothing image</p>
                      <p className="text-xs text-muted-foreground mt-1">Any garment photo • Max 5MB</p>
                    </div>
                  )}
                </div>
                <input ref={clothingRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setClothingImage)} />
                {clothingImage && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Clothing name (optional)"
                      value={clothingName}
                      onChange={(e) => setClothingName(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:border-accent focus:outline-none transition-colors"
                    />
                    <button onClick={() => { setClothingImage(null); setClothingName(""); setResult(null); }}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                      Remove clothing
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleTryOn}
              disabled={!personImage || !clothingImage || processing || !user}
              className="w-full py-4 bg-gradient-to-r from-accent to-gold text-accent-foreground font-bold text-lg rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> AI is processing...
                </>
              ) : !user ? (
                "Sign in to Try On"
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Generate Try-On
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              🔒 Your photos are processed securely via AI and never permanently stored.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TryOn;
