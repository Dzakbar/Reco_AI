import { motion } from "framer-motion";
import { Tag, TrendingUp, Wrench, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";

const conditionStyles = {
  Bagus: { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle },
  Sedang: { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", icon: AlertCircle },
  Buruk: { color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200", icon: HelpCircle }
};

const containerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function ResultCard({ result }) {
  if (!result) {
    return null;
  }

  const conditionData = conditionStyles[result.condition] || { 
    color: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200", icon: HelpCircle 
  };
  const ConditionIcon = conditionData.icon;

  return (
    <motion.section 
      variants={containerVariant}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 md:grid-cols-2" 
      aria-label="Hasil analisis Reco"
    >
      <motion.article 
        variants={itemVariant}
        className="glass flex flex-col justify-between rounded-3xl p-6 shadow-soft md:col-span-2"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-leaf-600 mb-1">
              <Tag size={16} />
              <p className="text-sm font-semibold uppercase tracking-wider">Barang Terdeteksi</p>
            </div>
            <h2 className="text-3xl font-bold text-ink leading-tight">{result.name}</h2>
          </div>
          <div className={`flex items-center gap-2 rounded-full border px-4 py-2 font-bold shadow-sm ${conditionData.bg} ${conditionData.border} ${conditionData.color}`}>
            <ConditionIcon size={18} />
            <span>Kondisi {result.condition}</span>
          </div>
        </div>
      </motion.article>

      <motion.article 
        variants={itemVariant}
        className="glass rounded-3xl p-6 shadow-soft relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 text-leaf-600 group-hover:scale-110 transition-transform duration-500">
          <Tag size={64} />
        </div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Estimasi Harga Jual</p>
        <p className="text-3xl font-extrabold text-leaf-700 relative z-10">{result.price_estimate}</p>
      </motion.article>

      <motion.article 
        variants={itemVariant}
        className="glass rounded-3xl p-6 shadow-soft relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 text-leaf-600 group-hover:scale-110 transition-transform duration-500">
          <TrendingUp size={64} />
        </div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Potensi Resale</p>
        <p className="text-base font-medium leading-relaxed text-slate-700 relative z-10">{result.resale_potential}</p>
      </motion.article>

      <motion.article 
        variants={itemVariant}
        className="glass rounded-3xl p-6 shadow-soft md:col-span-2 relative overflow-hidden group"
      >
        <div className="flex items-start gap-4 relative z-10">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-600">
            <Wrench size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Saran Perbaikan</p>
            <p className="text-base leading-relaxed text-slate-700">{result.repair_suggestions}</p>
          </div>
        </div>
      </motion.article>
    </motion.section>
  );
}
