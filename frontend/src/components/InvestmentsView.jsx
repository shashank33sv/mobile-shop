import React, { useEffect, useState } from 'react';
import { Edit } from 'lucide-react';
import { fetchInvestments, createInvestment, updateInvestment } from '../api/api';

export default function InvestmentsView() {
  const [investments, setInvestments] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [investmentToEdit, setInvestmentToEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch investments from backend
  useEffect(() => {
    async function loadInvestments() {
      setLoading(true);
      try {
        const res = await fetchInvestments();
        setInvestments(res.data || []);
      } catch {
        setInvestments([]);
      } finally {
        setLoading(false);
      }
    }
    loadInvestments();
  }, []);

  // Add new investment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    setSubmitting(true);
    try {
      const newInvestment = {
        description,
        amount: parseFloat(amount),
        date: new Date().toISOString().split('T')[0],
      };
      const res = await createInvestment(newInvestment);
      setInvestments((prev) => [res.data, ...prev]);
      setDescription('');
      setAmount('');
    } catch (err) {
      alert("Failed to add investment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit investment
  const handleEditClick = (investment) => {
    setInvestmentToEdit({ ...investment }); // make a copy for editing
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setInvestmentToEdit((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };

  const handleUpdateInvestment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await updateInvestment(investmentToEdit._id, investmentToEdit);
      setInvestments((prev) =>
        prev.map((inv) => (inv._id === investmentToEdit._id ? res.data : inv))
      );
      setShowEditModal(false);
      setInvestmentToEdit(null);
    } catch {
      alert("Failed to update investment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Investment & Expense Tracker
      </h2>
      {/* Add Investment Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description (e.g., Rent, Stock Purchase)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-800 dark:text-gray-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount (₹)
            </label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-800 dark:text-gray-200"
              required
            />
          </div>
          <div className="md:col-span-3 text-right">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition"
            >
              {submitting ? 'Adding...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>

      {/* Investments Table */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 px-2">
          Recent Investments & Expenses
        </h3>
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3 text-right">Amount</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : investments.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  No investments found.
                </td>
              </tr>
            ) : (
              investments.map((inv) => (
                <tr
                  key={inv._id}
                  className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4">{inv.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {inv.description}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">
                    ₹{Number(inv.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleEditClick(inv)}
                      className="text-gray-500 hover:text-blue-500 p-1"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {showEditModal && investmentToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Edit Investment Entry</h3>
            <form onSubmit={handleUpdateInvestment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <input
                  type="text"
                  name="description"
                  value={investmentToEdit.description}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  name="amount"
                  value={investmentToEdit.amount}
                  onChange={handleEditFormChange}
                  className="mt-1 block w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 text-gray-800 dark:text-gray-200"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}