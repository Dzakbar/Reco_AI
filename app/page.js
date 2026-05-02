"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ScanLine, ArrowRight } from "lucide-react";
import ResultCard from "../components/ResultCard";
import UploadBox from "../components/UploadBox";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const [image, setImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    setError("");
    setResult(null);

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Ukuran gambar maksimal 5MB.");
      return;
    }

    try {
      const dataUrl = await readAsDataUrl(file);
      setImage(dataUrl);
      setFileName(file.name);
    } catch (readError) {
      setError(readError.message);
    }
  }

  async function handleAnalyze() {
    if (!image) {
      setError("Upload gambar terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Analisis gagal.");
      }

      setResult(payload);
    } catch (analyzeError) {
      setError(analyzeError.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCameraCapture(dataUrl) {
    setImage(dataUrl);
    setFileName("camera-capture.jpg");
    setResult(null);
    setError("");
  }

  function handleCameraError(message) {
    setError(message);
  }

  function handleReset() {
    setImage("");
    setFileName("");
    setResult(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#cceff4,_transparent_28rem),radial-gradient(circle_at_top_right,_#dff3e2,_transparent_26rem),linear-gradient(180deg,_#f8fcf8_0%,_#eef7ef_100%)] px-4 py-6 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-leaf-200/40 blur-[100px] -z-10 mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-[#cceff4]/50 blur-[100px] -z-10 mix-blend-multiply pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        <motion.nav 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between py-4"
        >
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              className="h-14 w-14 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-md relative"
            >
              <img
                src="/reco-mascot.png"
                alt="Reco AI logo"
                className="h-full w-full object-cover scale-125"
                style={{ objectPosition: "56% 52%" }}
              />
            </motion.div>
            <div>
              <p className="text-2xl font-black tracking-tight text-ink">Reco<span className="text-leaf-500">.ai</span></p>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf-600/80">
                Resale Agent
              </p>
            </div>
          </div>
          <span className="hidden items-center gap-2 rounded-full border border-leaf-100 bg-white/80 backdrop-blur-md px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm sm:inline-flex">
            <Sparkles size={16} className="text-leaf-500" />
            Vision-powered resale helper
          </span>
        </motion.nav>

        <header className="grid gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-leaf-100/50 px-3 py-1 mb-4 border border-leaf-200">
              <span className="flex h-2 w-2 rounded-full bg-leaf-500 animate-pulse"></span>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-700">
                Meet Reco — your intelligent resale companion
              </p>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-ink sm:text-6xl sm:leading-[1.1]">
              Foto barangmu, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf-600 to-emerald-400">Reco bantu taksir</span> nilai jualnya.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl font-medium">
              Reco membaca objek utama, menilai kondisi visual, memperkirakan harga resale,
              dan memberi saran spesifik agar barang bekas lebih siap dijual.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Upload atau kamera", "JSON AI output", "Saran resale praktis"].map((item, i) => (
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-leaf-100 bg-white/60 backdrop-blur-sm px-4 py-2 text-sm font-bold text-slate-700 shadow-sm"
                >
                  <ScanLine size={14} className="text-leaf-500" />
                  {item}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.aside 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative overflow-visible"
          >
            {/* Main Image Container */}
            <div className="glass rounded-3xl p-2 shadow-xl relative z-10">
              <div className="relative h-64 overflow-hidden rounded-2xl bg-[#cceff4] sm:h-80">
                <motion.img
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  src="/reco-logo.png"
                  alt="Reco, AI assistant untuk analisis barang bekas"
                  className="h-full w-full object-contain p-4 origin-bottom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#cceff4] via-transparent to-transparent opacity-60"></div>
              </div>
            </div>
            
            {/* Floating Chat Bubble */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="absolute -bottom-6 -left-6 z-20 w-[85%] rounded-2xl border border-leaf-100 bg-white p-5 shadow-xl sm:-left-10"
            >
              <p className="flex items-center gap-2 text-sm font-extrabold text-leaf-600 mb-2">
                <Sparkles size={16} /> Reco says
              </p>
              <p className="text-sm font-medium leading-relaxed text-slate-700">
                Aku fokus ke barang utama di foto, abaikan background, lalu ubah visual jadi
                keputusan resale yang mudah dibaca.
              </p>
            </motion.div>
          </motion.aside>
        </header>

        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start pb-20 mt-12">
          <UploadBox
            preview={image}
            fileName={fileName}
            isLoading={isLoading}
            onFileChange={handleFileChange}
            onCameraCapture={handleCameraCapture}
            onCameraError={handleCameraError}
            onAnalyze={handleAnalyze}
            onReset={handleReset}
          />

          <AnimatePresence mode="wait">
            <motion.div 
              key="content-area"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-800 shadow-sm"
                >
                  {error}
                </motion.div>
              )}

              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-3xl p-8 shadow-soft"
                >
                  <div className="h-3 overflow-hidden rounded-full bg-leaf-100">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-leaf-500 shadow-[0_0_10px_rgba(47,155,85,0.8)]" />
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full border-2 border-leaf-200 bg-leaf-50 flex items-center justify-center">
                      <Sparkles className="text-leaf-500 animate-pulse" />
                    </div>
                    <div>
                      <p className="font-bold text-ink text-lg">Reco sedang menilai barang...</p>
                      <p className="text-sm leading-6 text-slate-500 font-medium mt-1">
                        AI sedang membaca foto, mengira kondisi, dan menyusun estimasi harga.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : result ? (
                <ResultCard result={result} />
              ) : (
                <motion.section 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass rounded-3xl p-8 shadow-soft relative overflow-hidden"
                >
                  <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                    <img src="/reco-mascot.png" alt="" className="w-64 h-64 object-cover rounded-full" />
                  </div>
                  <div className="flex gap-5 relative z-10">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-leaf-200 bg-leaf-50 p-0 shadow-inner flex items-center justify-center">
                      <img
                        src="/reco-mascot.png"
                        alt="Reco AI"
                        className="h-full w-full object-cover scale-125"
                        style={{ objectPosition: "56% 52%" }}
                      />
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-bold uppercase tracking-[0.18em] text-leaf-600 flex items-center gap-2">
                        <Sparkles size={14} /> Output Reco
                      </p>
                      <h2 className="mt-2 text-2xl font-bold text-ink leading-tight">
                        Hasil analisis akan <br/>muncul di sini.
                      </h2>
                    </div>
                  </div>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2 relative z-10">
                    {[
                      "Nama barang",
                      "Kondisi visual",
                      "Estimasi harga jual",
                      "Saran perbaikan",
                      "Potensi resale"
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-white/60 px-4 py-3 text-sm font-bold text-slate-500"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-leaf-300"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
