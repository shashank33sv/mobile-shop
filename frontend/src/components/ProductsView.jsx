import React, { useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api/api';
import { Edit, Trash2, Plus, X, Package } from 'lucide-react';

export default function ProductView() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    price: '',
    cost: '',
    quantity: '',
    image: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await fetchProducts();
      setProducts(res.data);
    } catch {
      alert('Failed to fetch products');
    }
  }

  function openModalForAdd() {
    setCurrentProduct({ name: '', price: '', cost: '', quantity: '', image: '' });
    setIsEditing(false);
    setShowModal(true);
  }

  function openModalForEdit(product) {
    setCurrentProduct({
      name: product.name,
      price: product.price,
      cost: product.cost || '',
      quantity: product.quantity,
      image: product.image || '',
      _id: product._id,
    });
    setIsEditing(true);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setCurrentProduct({ name: '', price: '', cost: '', quantity: '', image: '' });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    const { name, price, cost, quantity } = currentProduct;
    if (!name.trim() || !price || !quantity) {
      alert('Please enter name, price and quantity!');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name,
        price: Number(price),
        cost: Number(cost) || 0,
        quantity: Number(quantity),
        image: currentProduct.image,
      };
      if (isEditing) {
        await updateProduct(currentProduct._id, payload);
      } else {
        await createProduct(payload);
      }
      await loadProducts();
      closeModal();
    } catch {
      alert('Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert('Failed to delete product');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold select-none text-gray-900 dark:text-white">Products Management</h2>
        <button
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          onClick={openModalForAdd}
        >
          <Plus className="mr-2" /> Add Product
        </button>
      </div>

      <div className="overflow-auto rounded bg-white dark:bg-gray-800 p-4 shadow">
        <table className="min-w-full table-auto text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-700 uppercase font-semibold text-xs text-gray-700 dark:text-gray-400 select-none">
            <tr>
              <th className="p-2 w-10"></th>
              <th className="p-2 w-28">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2 w-24">Price</th>
              <th className="p-2 w-24">Cost</th>
              <th className="p-2 w-24">Quantity</th>
              <th className="p-2 max-w-xs">Image URL</th>
              <th className="p-2 w-24 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-400 select-none">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 select-text"
                >
                  <td className="p-2 text-center">
                    <Package className="inline-block text-blue-600" />
                  </td>
                  <td className="p-2 font-mono truncate" title={product._id}>{product._id}</td>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">{product.price.toLocaleString()}</td>
                  <td className="p-2">{(product.cost || 0).toLocaleString()}</td>
                  <td className="p-2">{product.quantity}</td>
                  <td className="p-2 truncate max-w-xs" title={product.image || ''}>{product.image || '-'}</td>
                  <td className="p-2 text-center flex justify-center gap-2">
                    <button onClick={() => openModalForEdit(product)} aria-label="Edit" className="text-blue-600 hover:text-blue-800 rounded p-1">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(product._id)} aria-label="Delete" className="text-red-600 hover:text-red-800 rounded p-1">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
        >
          <div className="max-w-lg w-full max-h-[80vh] overflow-auto rounded bg-white dark:bg-gray-800 p-6 shadow-lg">
            <div className="mb-4 flex justify-between items-center">
              <h3 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditing ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={closeModal} aria-label="Close" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input id="name" name="name" type="text" value={currentProduct.name} onChange={handleChange} required className="w-full rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                <input id="price" name="price" type="number" min="0" value={currentProduct.price} onChange={handleChange} required className="w-full rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label htmlFor="cost" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cost</label>
                <input id="cost" name="cost" type="number" min="0" value={currentProduct.cost} onChange={handleChange} className="w-full rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</label>
                <input id="quantity" name="quantity" type="number" min="0" value={currentProduct.quantity} onChange={handleChange} required className="w-full rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                <input id="image" name="image" type="text" value={currentProduct.image} onChange={handleChange} placeholder="https://example.com/image.jpg" className="w-full rounded border border-gray-300 dark:border-gray-600 px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} disabled={saving} className="bg-gray-100 dark:bg-gray-700 rounded px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100">Cancel</button>
                <button type="submit" disabled={saving} className="bg-blue-600 rounded px-5 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition">{saving ? (isEditing ? "Saving..." : "Adding...") : (isEditing ? "Save Changes" : "Add Product")}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
