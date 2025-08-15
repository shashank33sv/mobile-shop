export default function PrintableBill({ bill }) {
  // Calculate subtotal: sum of (qty * price) for all line items
  const subtotal = bill.items.reduce((sum, item) => sum + item.qty * item.price, 0);

  // Since GST/tax is removed, grandTotal equals subtotal
  const grandTotal = subtotal;

  return (
    <div className="p-4 text-black bg-white font-sans">
      <div className="border-b-2 border-black pb-4 mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sri Maruthi Cell Care & Services</h1>
          <p className="text-sm">shivani(577549) near Bus-stop, Cheeranahalli Rd</p>
          <p className="text-sm">contact@harishsa818@gmail.com</p>
          <p className="text-sm">9686771218</p>
        </div>
        <h2 className="text-2xl font-bold uppercase text-gray-600">Invoice</h2>
      </div>
      <div className="mb-6 flex justify-between">
        <div>
          <h3 className="font-bold mb-1">Bill To:</h3>
          <p>{bill.customerName}</p>
          {bill.customerPhone && <p>Phone: {bill.customerPhone}</p>}
          {bill.customerEmail && <p>Email: {bill.customerEmail}</p>}
        </div>
        <div>
          <p>
            <span className="font-semibold">Invoice #:</span> {bill._id || bill.id}
          </p>
          <p>
            <span className="font-semibold">Date:</span> {bill.date}
          </p>
        </div>
      </div>
      <table className="w-full mb-6 text-left border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border border-gray-300">Item/Service Description</th>
            <th className="p-2 text-right border border-gray-300">Qty</th>
            <th className="p-2 text-right border border-gray-300">Unit Price</th>
            <th className="p-2 text-right border border-gray-300">Total</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item, i) => (
            <tr key={i}>
              <td className="p-2 border border-gray-300">{item.name}</td>
              <td className="p-2 text-right border border-gray-300">{item.qty}</td>
              <td className="p-2 text-right border border-gray-300">₹{item.price.toFixed(2)}</td>
              <td className="p-2 text-right border border-gray-300">
                ₹{(item.qty * item.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end">
        <div className="w-1/2 space-y-1">
          <div className="flex justify-between">
            <span className="font-semibold">Subtotal:</span> <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t-2 border-black pt-1 mt-1">
            <span>Grand Total:</span> <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 text-sm text-gray-600">
        <p>Thank you & Revisit Again</p>
      </div>
    </div>
  );
}
