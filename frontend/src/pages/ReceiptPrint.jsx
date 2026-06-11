import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

import logo from '@/assets/bg-logo.jpg';

export default function ReceiptPrint() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: receipt, isLoading, error } = useQuery({
    queryKey: ['receipt', id],
    queryFn: async () => {
      const res = await api.get(`/receipts/${id}`);
      return res.data.data;
    }
  });

  useEffect(() => {
    if (receipt) {
      setTimeout(() => {
        window.print();
      }, 500); // Give it a moment to render images
    }
  }, [receipt]);

  if (isLoading) return <div className="p-10 text-center">Loading Receipt...</div>;
  if (error || !receipt) return <div className="p-10 text-center text-red-500">Failed to load receipt or receipt not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white text-black min-h-screen font-sans print:p-0">
      {/* Print Controls (hidden when printing) */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <button onClick={() => window.close()} className="px-4 py-2 bg-slate-200 rounded text-slate-800 font-medium">Close</button>
        <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 rounded text-white font-medium">Print PDF</button>
      </div>

      {/* Receipt Paper */}
      <div className="border-2 border-slate-800 p-8 rounded-lg relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <img src={logo} alt="Watermark" className="w-96 h-96 object-contain" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-6 mb-6">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-wide text-blue-900">M.K.D. Group of Education</h1>
              <p className="text-sm font-semibold text-slate-700">Maa Kamla Devi Shri Pitambara Vidyapeeth</p>
              <p className="text-xs text-slate-500">Academic Session 2024-25</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase tracking-widest text-slate-800 mb-1">Fee Receipt</h2>
            <p className="text-sm font-bold text-red-600">{receipt.receiptNumber}</p>
            <p className="text-xs text-slate-500 mt-1">Date: {new Date(receipt.paymentDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Student Details Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
          <div>
            <span className="text-sm text-slate-500 block">Student Name</span>
            <span className="font-bold text-lg uppercase">{receipt.student?.personalDetails?.studentName || 'Unknown'}</span>
          </div>
          <div>
            <span className="text-sm text-slate-500 block">Admission Number</span>
            <span className="font-bold text-lg">{receipt.admissionNumber}</span>
          </div>
          <div>
            <span className="text-sm text-slate-500 block">Course</span>
            <span className="font-bold text-lg">{receipt.course}</span>
          </div>
          <div>
            <span className="text-sm text-slate-500 block">Payment Mode</span>
            <span className="font-bold text-lg">{receipt.paymentMode} {receipt.transactionId ? `(${receipt.transactionId})` : ''}</span>
          </div>
        </div>

        {/* Payment Amount Box */}
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg flex items-center justify-between mb-12">
          <div>
            <p className="text-sm text-slate-500 font-medium">Amount Received</p>
            <p className="text-4xl font-bold text-emerald-600 mt-1">₹{receipt.amountPaid?.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 font-medium">Remarks</p>
            <p className="font-medium text-slate-800 mt-1">{receipt.remarks || 'Fee Payment'}</p>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end pt-12 border-t border-slate-200">
          <div className="text-center w-40">
            <p className="text-sm font-medium text-slate-500">Collected By</p>
            <p className="text-xs font-bold uppercase mt-1">{receipt.collectedBy?.name || 'System Admin'}</p>
          </div>
          
          <div className="text-center w-40">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 mx-auto flex items-center justify-center opacity-30 mb-2">
              <span className="text-xs font-bold text-slate-400 rotate-[-15deg]">SEAL</span>
            </div>
            <p className="text-sm font-medium text-slate-500 border-t border-slate-400 pt-2">Institution Seal</p>
          </div>

          <div className="text-center w-40">
            <p className="text-sm font-medium text-slate-500 border-t border-slate-400 pt-2">Authorized Signature</p>
          </div>
        </div>

      </div>
    </div>
  );
}
