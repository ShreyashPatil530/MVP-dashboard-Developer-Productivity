import React from 'react';
import { Lightbulb, CheckCircle2, AlertCircle, Info, ShieldCheck } from 'lucide-react';

const InsightCard = ({ insight }) => {
  if (!insight) return null;

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'warning': return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: AlertCircle, iconColor: 'text-amber-500' };
      case 'danger': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: AlertCircle, iconColor: 'text-red-500' };
      case 'success': return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: ShieldCheck, iconColor: 'text-emerald-500' };
      default: return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: Info, iconColor: 'text-blue-500' };
    }
  };

  const styles = getSeverityStyles(insight.severity);
  const Icon = styles.icon;

  return (
    <div className={`rounded-2xl border ${styles.bg} ${styles.border} p-6 h-full`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-xl bg-white shadow-sm`}>
          <Icon className={`w-6 h-6 ${styles.iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${styles.text} mb-2 flex items-center gap-2`}>
            {insight.title}
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-white border border-current opacity-80 uppercase tracking-wider">
              {insight.severity}
            </span>
          </h3>
          <p className={`text-sm ${styles.text} opacity-90 leading-relaxed mb-6`}>
            {insight.meaning}
          </p>

          <div className="space-y-3">
            <p className={`text-xs font-bold uppercase tracking-widest ${styles.text} opacity-60 mb-2`}>
              Recommended Actions
            </p>
            {insight.actions.map((action, idx) => (
              <div key={idx} className="flex items-center gap-3 group">
                <div className={`w-1.5 h-1.5 rounded-full ${styles.iconColor} group-hover:scale-125 transition-transform`} />
                <p className={`text-sm ${styles.text} font-medium`}>{action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
