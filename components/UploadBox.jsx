"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Camera, RefreshCw, X, Search } from "lucide-react";

export default function UploadBox({
  preview,
  fileName,
  isLoading,
  onFileChange,
  onCameraCapture,
  onCameraError,
  onAnalyze,
  onReset
}) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  async function openCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      onCameraError("Browser belum mendukung akses kamera.");
      return;
    }

    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false
      });
      setStream(cameraStream);
      setIsCameraOpen(true);
    } catch {
      onCameraError("Kamera tidak bisa dibuka. Pastikan izin kamera sudah diberikan.");
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setIsCameraOpen(false);
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
      onCameraError("Kamera belum siap. Coba tunggu sebentar lalu ambil foto lagi.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    onCameraCapture(canvas.toDataURL("image/jpeg", 0.9));
    stopCamera();
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-4 shadow-soft sm:p-6"
    >
      <div 
        className={`relative flex min-h-72 flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-300 ${isDragging ? 'border-leaf-500 bg-leaf-100/50' : 'border-leaf-200 bg-leaf-50/40'} px-4 py-8 text-center overflow-hidden`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileChange({ target: { files: e.dataTransfer.files } });
          }
        }}
      >
        <AnimatePresence mode="wait">
          {isCameraOpen ? (
            <motion.div
              key="camera"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full relative flex flex-col items-center"
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="max-h-80 w-full rounded-lg bg-ink object-contain shadow-md"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={capturePhoto}
                className="absolute bottom-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-leaf-600 shadow-lg hover:bg-leaf-50"
              >
                <Camera size={24} />
              </motion.button>
            </motion.div>
          ) : preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full flex justify-center"
            >
              <img
                src={preview}
                alt="Preview barang"
                className="max-h-80 rounded-lg object-contain shadow-md"
              />
              {isLoading && (
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-leaf-500/10 backdrop-blur-[2px]" />
                  <motion.div 
                    initial={{ top: "-10%" }}
                    animate={{ top: "110%" }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute left-0 w-full h-1 bg-leaf-500 shadow-[0_0_15px_3px_rgba(47,155,85,0.7)] z-10"
                  />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                     <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-leaf-600 font-semibold text-sm">
                       <RefreshCw className="animate-spin" size={16} />
                       Menganalisis...
                     </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.label 
              key="upload"
              htmlFor="image-upload" 
              className="max-w-sm cursor-pointer flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-md border border-leaf-100 text-leaf-500"
              >
                <UploadCloud size={40} />
              </motion.div>
              <p className="mt-5 text-xl font-bold text-ink">Tarik & Lepas Foto</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Pilih file dari device atau gunakan kamera untuk mengambil foto barang.
              </p>
            </motion.label>
          )}
        </AnimatePresence>
      </div>

      <input
        id="image-upload"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={onFileChange}
        className="sr-only"
      />
      <canvas ref={canvasRef} className="hidden" />

      {fileName && !isCameraOpen && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
          <span className="truncate max-w-[200px] sm:max-w-xs">{fileName}</span>
        </motion.p>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label
          htmlFor="image-upload"
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 font-semibold text-slate-700 shadow-sm border border-slate-100 transition hover:bg-slate-50 hover:shadow-md ${
            isLoading || isCameraOpen ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <UploadCloud size={18} />
          <span>Upload File</span>
        </label>

        {isCameraOpen ? (
          <button
            type="button"
            onClick={stopCamera}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-3.5 font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
          >
            <X size={18} />
            Batal
          </button>
        ) : (
          <button
            type="button"
            onClick={openCamera}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl bg-leaf-50 border border-leaf-100 px-4 py-3.5 font-semibold text-leaf-700 transition hover:bg-leaf-100 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Camera size={18} />
            Buka Kamera
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <motion.button
          whileHover={{ scale: preview && !isLoading && !isCameraOpen ? 1.02 : 1 }}
          whileTap={{ scale: preview && !isLoading && !isCameraOpen ? 0.98 : 1 }}
          type="button"
          onClick={onAnalyze}
          disabled={!preview || isLoading || isCameraOpen}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-leaf-600 px-5 py-4 font-bold text-white shadow-md transition hover:bg-leaf-500 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <RefreshCw className="animate-spin" size={20} />
              Menganalisis...
            </>
          ) : (
            <>
              <Search size={20} />
              Analisis Barang
            </>
          )}
        </motion.button>

        {!isCameraOpen && preview && (
          <button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-4 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={18} />
            Ganti
          </button>
        )}
      </div>
    </motion.section>
  );
}
