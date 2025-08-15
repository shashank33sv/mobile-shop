import React, { useEffect, useState } from 'react';
import { Printer } from 'lucide-react';
import PrintModal from './PrintModal';
import { fetchBills, createBill, fetchProducts } from '../api/api';

export default function BillingView({ bills, setBills }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [billToPrint, setBillToPrint] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [products, setProducts] = useState([]);

  const [newBill, setNewBill] = useState({
    customerName: '',
    customerPhone: '',
    type: 'Sale',
    items: [
      {
        name: '',
        qty: 1,
        price: '',
        productId: '',
        description: '',
        mobileModel: '',
        problem: '',
      },
    ],
  });

  useEffect(() => {
    fetchBills()
      .then(res => setBills(res.data))
      .catch(() => setBills([]));

    fetchProducts()
      .then(res => {
        const available = res.data.filter(p => p.quantity > 0);
        setProducts(available);
      })
      .catch(() => setProducts([]));
  }, [setBills]);

  const handleAddItem = () => {
    setNewBill(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: '',
          qty: 1,
          price: '',
          productId: '',
          description: '',
          mobileModel: '',
          problem: '',
        },
      ],
    }));
  };

  const handleRemoveItem = index => {
    setNewBill(prev => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  // Handles change for all fields of item at given index
  const handleItemChange = (index, field, value) => {
    const updated = [...newBill.items];

    if (field === 'price') {
      // Allow blank price input as ''
      updated[index][field] = value === '' ? '' : value;
    } else if (field === 'qty') {
      updated[index][field] = value === '' ? '' : Math.max(1, parseInt(value, 10) || 1);
    } else {
      updated[index][field] = value;
    }

    // If user edits 'name' in Sale type, clear productId and price
    if (field === 'name' && newBill.type === 'Sale') {
      updated[index].productId = '';
      updated[index].price = '';
    }

    setNewBill(prev => ({ ...prev, items: updated }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!newBill.customerName.trim()) {
      alert('Please enter customer name.');
      return;
    }

    // Validate items: name non-empty, qty and price valid
    const validItems = newBill.items.filter(
      i =>
        i.name.trim() &&
        i.qty !== '' &&
        !isNaN(i.qty) &&
        i.price !== '' &&
        !isNaN(parseFloat(i.price)) &&
        i.qty > 0
    );

    if (validItems.length === 0) {
      alert('Please add at least one valid item with price and quantity.');
      return;
    }

    setIsSaving(true);

    const amount = validItems.reduce((sum, i) => sum + parseFloat(i.price) * i.qty, 0);

    const itemsToSend = validItems.map(item => ({
      name: item.name,
      qty: item.qty,
      price: parseFloat(item.price),
      ...(item.productId && { productId: item.productId }),
      ...(newBill.type === 'Service' && {
        description: item.description,
        mobileModel: item.mobileModel,
        problem: item.problem,
      }),
    }));

    const billToSave = {
      customerName: newBill.customerName,
      customerPhone: newBill.customerPhone,
      type: newBill.type,
      items: itemsToSend,
      amount,
      date: new Date().toISOString().slice(0, 10),
    };

    try {
      const response = await createBill(billToSave);
      setBills(prev => [response.data, ...prev]);

      if (newBill.type === 'Sale') {
        let updatedProducts = [...products];
        itemsToSend.forEach(item => {
          if (item.productId) {
            const idx = updatedProducts.findIndex(p => p._id === item.productId);
            if (idx !== -1) {
              updatedProducts[idx].quantity -= item.qty;
              if (updatedProducts[idx].quantity <= 0) {
                updatedProducts.splice(idx, 1);
              }
            }
          }
        });
        setProducts(updatedProducts);
      }

      setNewBill({
        customerName: '',
        customerPhone: '',
        type: 'Sale',
        items: [
          {
            name: '',
            qty: 1,
            price: '',
            productId: '',
            description: '',
            mobileModel: '',
            problem: '',
          },
        ],
      });
      setShowCreateModal(false);
    } catch (error) {
      console.error(error);
      alert('Error during saving bill.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Billing Management</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          onClick={() => setShowCreateModal(true)}
        >
          Create New
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow overflow-auto">
        <table className="min-w-full text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-400">
            <tr>
              <th className="p-3 text-left">Invoice ID</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(!bills || bills.length === 0) && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 select-none">
                  No bills to show.
                </td>
              </tr>
            )}
            {bills &&
              bills.map(bill => (
                <tr
                  key={bill._id}
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-3 font-mono">{bill._id}</td>
                  <td className="p-3">{bill.customerName}</td>
                  <td className="p-3">{bill.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        bill.type === 'Sale'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {bill.type}
                    </span>
                  </td>
                  <td className="p-3 font-semibold">₹{bill.amount.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setBillToPrint(bill)}
                      aria-label="Print Bill"
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <Printer size={20} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-5xl max-h-[80vh] overflow-auto p-6">
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl mb-4 font-semibold text-gray-800 dark:text-white">
                Create New Bill
              </h2>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Customer Name *</label>
                <input
                  type="text"
                  className="w-full p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
                  value={newBill.customerName}
                  onChange={e => setNewBill({ ...newBill, customerName: e.target.value })}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Customer Phone</label>
                <input
                  type="tel"
                  className="w-full p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
                  value={newBill.customerPhone}
                  onChange={e => setNewBill({ ...newBill, customerPhone: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Bill Type</label>
                <select
                  className="w-full p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
                  value={newBill.type}
                  onChange={e => setNewBill({ ...newBill, type: e.target.value })}
                >
                  <option value="Sale">Sale</option>
                  <option value="Service">Service</option>
                </select>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Items</h3>
                {newBill.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 relative border-b pb-3"
                  >
                    {/* Item Name */}
                    <input
                      type="text"
                      className="w-full p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
                      placeholder="Item Name"
                      value={item.name}
                      onChange={e => handleItemChange(idx, 'name', e.target.value)}
                      required
                      disabled={false} // allow typing item name in all types
                    />

                    {/* Description / Model / Problem for Service type */}
                    {newBill.type === 'Service' && (
                      <>
                        <input
                          type="text"
                          placeholder="Description"
                          className="p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
                          value={item.description}
                          onChange={e => handleItemChange(idx, 'description', e.target.value)}
                        />
                        <select
                          className="p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
                          value={item.mobileModel}
                          onChange={e => handleItemChange(idx, 'mobileModel', e.target.value)}
                        >
                          <option value="">Select Model</option>
                          <option value="iPhone">iPhone</option>
                          <option value="Samsung">Samsung</option>
                          <option value="Redmi">Redmi</option>
                          <option value="Realme">Realme</option>
                          <option value="OnePlus">OnePlus</option>
                          <option value="Other">Other</option>
                        </select>
                        <select
                          className="p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
                          value={item.problem}
                          onChange={e => handleItemChange(idx, 'problem', e.target.value)}
                        >
                          <option value="">Select Problem</option>
                          <option value="Display Issue">Display Issue</option>
                          <option value="Battery Problem">Battery Problem</option>
                          <option value="Speaker Problem">Speaker Problem</option>
                          <option value="Charging Issue">Charging Issue</option>
                          <option value="Software Issue">Software Issue</option>
                          <option value="Other">Other</option>
                        </select>
                      </>
                    )}

                    {/* Quantity */}
                    <input
                      type="number"
                      min={1}
                      className="p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
                      placeholder="Quantity"
                      value={item.qty}
                      onChange={e =>
                        handleItemChange(idx, 'qty', e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10) || 1))
                      }
                      required
                    />

                    {/* Price */}
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      className="p-2 rounded border bg-white dark:bg-gray-700 dark:text-white"
                      placeholder="Price"
                      value={item.price}
                      onChange={e => handleItemChange(idx, 'price', e.target.value)}
                      required
                    />

                    {newBill.items.length > 1 && (
                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => handleRemoveItem(idx)}
                        className="absolute top-0 right-0 text-red-600 hover:text-red-800 font-bold"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={handleAddItem} className="text-blue-600 hover:underline">
                  + Add another
                </button>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="p-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {billToPrint && (
        <PrintModal bill={billToPrint} onClose={() => setBillToPrint(null)} onPrint={() => window.print()} />
      )}
    </div>
  );
}