import React from 'react';
import {
  X,
  Server,
  Database,
  Cloud,
  Shield,
  Activity,
  ArrowRight,
  Layers,
  Lock,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';

interface AwsCloudArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AwsCloudArchitectureModal: React.FC<AwsCloudArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 text-slate-100 rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-700/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Cloud className="w-3.5 h-3.5" /> AWS Well-Architected Healthcare Framework
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              AWS Cloud Architecture & Implementation
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Technical breakdown of cloud infrastructure, data isolation, and HIPAA-ready encryption models.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-8 text-xs sm:text-sm">
          {/* Architecture Flow Diagram */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-2">
              <Layers className="w-4 h-4" /> System Data Flow & Cloud Topology
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-blue-500/30 space-y-1">
                <span className="text-[10px] font-bold uppercase text-blue-400">Client Tier</span>
                <div className="font-bold text-white text-xs sm:text-sm">React SPA Client</div>
                <p className="text-[11px] text-slate-400">Vite + Tailwind Frontend (Cross-device)</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-teal-500/30 space-y-1">
                <span className="text-[10px] font-bold uppercase text-teal-400">Compute Tier</span>
                <div className="font-bold text-white text-xs sm:text-sm">AWS EC2 / App Runner</div>
                <p className="text-[11px] text-slate-400">Node.js Express REST API Controller</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-purple-500/30 space-y-1">
                <span className="text-[10px] font-bold uppercase text-purple-400">Database Tier</span>
                <div className="font-bold text-white text-xs sm:text-sm">AWS RDS (MySQL)</div>
                <p className="text-[11px] text-slate-400">Multi-AZ Relational Locking & ACID Transactions</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-400">Storage Tier</span>
                <div className="font-bold text-white text-xs sm:text-sm">AWS S3 Object Store</div>
                <p className="text-[11px] text-slate-400">AES-256 Vault + Pre-signed URL Authorization</p>
              </div>
            </div>
          </div>

          {/* AWS Services Detailed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* EC2 */}
            <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2.5 text-blue-400">
                <Server className="w-5 h-5" />
                <h4 className="font-bold text-white text-sm">AWS EC2 (Elastic Compute Cloud)</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Hosts the web application backend and RESTful API router inside private VPC subnets. Auto-scaling groups
                dynamically handle outpatient booking traffic surges during peak morning hours.
              </p>
              <div className="text-[11px] text-blue-300/80 font-mono">
                Security Group: Port 443 HTTPS only • Reverse proxy via Nginx
              </div>
            </div>

            {/* RDS */}
            <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2.5 text-teal-400">
                <Database className="w-5 h-5" />
                <h4 className="font-bold text-white text-sm">AWS RDS MySQL (Multi-AZ)</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Manages relational clinical entities: users, patients, doctor rosters, departments, and booking records.
                Enforces strict row-level transaction locks during slot allocation to guarantee 0% double-booking.
              </p>
              <div className="text-[11px] text-teal-300/80 font-mono">
                Automated daily snapshots • Point-in-time recovery (PITR) enabled
              </div>
            </div>

            {/* S3 */}
            <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2.5 text-amber-400">
                <Cloud className="w-5 h-5" />
                <h4 className="font-bold text-white text-sm">AWS S3 (Simple Storage Service)</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Medical record vault for patient laboratory reports, radiological scans, and doctor prescriptions. Bucket
                policies deny public read access; all downloads are authenticated via 15-minute expiring Pre-Signed URLs.
              </p>
              <div className="text-[11px] text-amber-300/80 font-mono">
                Server-Side Encryption: SSE-KMS / AES-256 • S3 Glacier lifecycle rules
              </div>
            </div>

            {/* IAM */}
            <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2.5 text-purple-400">
                <Shield className="w-5 h-5" />
                <h4 className="font-bold text-white text-sm">AWS IAM (Identity & Access)</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Strict Role-Based Access Control (RBAC) principle of least privilege. Doctors only access assigned
                patient appointments; patients can only query their personal EHR records and upload tokens.
              </p>
              <div className="text-[11px] text-purple-300/80 font-mono">
                Granular IAM policies: PutObject, GetObject with scoped prefixes
              </div>
            </div>
          </div>

          {/* CloudWatch & Observability */}
          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 flex items-start gap-3">
            <Activity className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm">AWS CloudWatch Observability & Audit Trail</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Logs all appointment booking attempts, doctor status changes, prescription uploads, and authentication
                events. CloudWatch Alarms trigger automated SNS notifications if API error thresholds or CPU surges occur.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Standardized College Viva Architecture Ready</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
};
