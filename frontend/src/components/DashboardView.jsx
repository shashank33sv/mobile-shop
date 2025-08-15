import React, { useState, useMemo } from 'react';
import { DollarSign, Building, Wrench, Sparkles, Loader2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, BarChart, Bar } from 'recharts';

export default function DashboardView({ bills, investments, setActivePage }) {
  const [insights, setInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Summary calculations
  const { monthlyProfit, dailyProfit, totalInvestment } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const today = now.toISOString().split('T')[0];
    const monthlySales = bills
      .filter(
        (bill) =>
          new Date(bill.date).getMonth() === currentMonth &&
          new Date(bill.date).getFullYear() === currentYear
      )
      .reduce((sum, bill) => sum + bill.amount, 0);
    const monthlyExpenses = investments
      .filter(
        (inv) =>
          new Date(inv.date).getMonth() === currentMonth &&
          new Date(inv.date).getFullYear() === currentYear
      )
      .reduce((sum, inv) => sum + inv.amount, 0);
    const dailySales = bills
      .filter((b) => b.date === today)
      .reduce((sum, b) => sum + b.amount, 0);
    const dailyExpenses = investments
      .filter((i) => i.date === today)
      .reduce((sum, i) => sum + i.amount, 0);
    return {
      monthlyProfit: monthlySales - monthlyExpenses,
      dailyProfit: dailySales - dailyExpenses,
      totalInvestment: investments.reduce((sum, inv) => sum + inv.amount, 0)
    };
  }, [bills, investments]);

  // Dummy data for charts
  const profitData = [
    { name: 'Jan', profit: 32000 },
    { name: 'Feb', profit: 41000 },
    { name: 'Mar', profit: 38000 },
    { name: 'Apr', profit: 52000 },
    { name: 'May', profit: 48000 },
    { name: 'Jun', profit: 55000 },
    { name: 'Jul', profit: monthlyProfit },
  ];

  const salesData = [
    { name: 'Mobiles', value: 70 },
    { name: 'Accessories', value: 20 },
    { name: 'Services', value: 10 }
  ];

  // AI insight (use backend/AI integration as needed)
  const getBusinessInsights = async () => {
    setIsLoading(true);
    setInsights('');
    setTimeout(() => {
      setInsights(
        `This month profit is ₹${monthlyProfit.toLocaleString()}. Today's profit is ₹${dailyProfit.toLocaleString()}. Monthly profit trend shows steady business. Return on investment is healthy. Keep optimizing inventory and focusing on services for growth!`
      );
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<DollarSign className="text-green-500" />} title="Today's Profit" value={`₹${dailyProfit.toLocaleString()}`} onClick={() => setActivePage('Billing')} />
        <StatCard icon={<DollarSign className="text-blue-500" />} title="This Month's Profit" value={`₹${monthlyProfit.toLocaleString()}`} onClick={() => setActivePage('Billing')} />
        <StatCard icon={<Building className="text-purple-500" />} title="Total Investment" value={`₹${totalInvestment.toLocaleString()}`} onClick={() => setActivePage('Investments')} />
        <StatCard icon={<Wrench className="text-red-500" />} title="Pending Services" value={bills.filter(b => b.type === 'Service').length} onClick={() => setActivePage('Services')} />
      </div>
      {/* AI insights card */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white">✨ AI Business Insights</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Click for an AI-powered summary.</p>
          </div>
          <button
            onClick={getBusinessInsights}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition flex items-center disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Sparkles className="mr-2" size={20} />}
            {isLoading ? 'Generating...' : 'Get AI Insights'}
          </button>
        </div>
        {insights && (
          <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-200">
            <p style={{whiteSpace: 'pre-wrap'}}>{insights}</p>
          </div>
        )}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">Monthly Profit Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none' }} />
              <Legend />
              <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" stroke="#9CA3AF" width={80} />
              <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} contentStyle={{ backgroundColor: '#374151', border: 'none' }}/>
              <Bar dataKey="value" fill="#3B82F6" barSize={20} radius={[0, 10, 10, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow flex items-center justify-between text-left w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none"
    >
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
      </div>
      <div className="bg-blue-100 dark:bg-gray-700 p-3 rounded-full">{icon}</div>
    </button>
  );
}
