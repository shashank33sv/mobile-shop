import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import DashboardView from './DashboardView';
import BillingView from './BillingView';
import ServicesView from './ServicesView';
import InvestmentsView from './InvestmentsView';
import ProductsView from './ProductsView';
import { fetchBills, fetchInvestments, fetchServices } from '../api/api'; // <-- make sure this import is correct

export default function AdminDashboard({ onLogout, }) {
  const [activePage, setActivePage] = useState('Dashboard');

  // Always store and fetch from backend!
  const [bills, setBills] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [services, setServices] = useState([]);

  // Fetch data on mount or when page is changed
  useEffect(() => {
    fetchBills().then(res => setBills(res.data ?? []));
    fetchInvestments().then(res => setInvestments(res.data ?? []));
    fetchServices().then(res => setServices(res.data ?? []));
  }, []);

  // Optionally, provide a reloadInvestments() function and pass it down to refresh investments
  const reloadInvestments = () =>
    fetchInvestments().then(res => setInvestments(res.data ?? []));

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans`}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100  p-4 sm:p-6">
          {activePage === 'Dashboard' && (
            <DashboardView
              bills={bills}
              investments={investments}
              setActivePage={setActivePage}
            />
          )}
          {activePage === 'Billing' && (
            <BillingView bills={bills} setBills={setBills} />
          )}
          {activePage === 'Services' && (
            <ServicesView services={services} setServices={setServices} />
          )}
          {activePage === 'Investments' && (
            <InvestmentsView
              investments={investments}
              setInvestments={setInvestments}
              reloadInvestments={reloadInvestments} // Pass this to update investments on add/edit
            />
          )}
          {activePage === 'Products' && <ProductsView reloadInvestments={reloadInvestments} />}
        </main>
      </div>
    </div>
  );
}
