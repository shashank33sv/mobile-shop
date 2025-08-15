import React from 'react';
import PrintableBill from './PrintableBill';
import { Printer } from 'lucide-react';

export default function PrintModal({ bill, onClose, onPrint }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6" id="printable-bill">
          <PrintableBill bill={bill} />
        </div>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 flex justify-end space-x-3 no-print">
          <button
            onClick={onClose}
            className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
          >
            Close
          </button>
          <button
            onClick={onPrint}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition flex items-center"
          >
            <Printer size={16} className="mr-2" />
            Print Bill
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-bill, #printable-bill * { visibility: visible; }
          #printable-bill { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
