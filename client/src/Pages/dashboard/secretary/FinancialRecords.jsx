import { useState } from 'react';
import { transactions as initialTransactions, payrollRecords as initialPayroll } from '../../../data/mockData';

export default function FinancialRecords() {
  const [activeTab, setActiveTab] = useState('transactions'); // 'transactions' or 'payroll'
  const [transactions, setTransactions] = useState(initialTransactions);
  const [payroll, setPayroll] = useState(initialPayroll);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for new transaction
  const [formData, setFormData] = useState({
    type: 'Sale',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const newTxn = {
      id: `TXN-${String(transactions.length + 1).padStart(3, '0')}`,
      ...formData,
      amount: parseFloat(formData.amount),
      status: 'Approved'
    };
    setTransactions([newTxn, ...transactions]);
    setIsModalOpen(false);
    setFormData({ type: 'Sale', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
  };

  const handlePayPayroll = (id) => {
    setPayroll(payroll.map(p => p.id === id ? { ...p, status: 'Paid' } : p));
  };

  // Calculate Totals
  const totalSales = transactions.filter(t => t.type === 'Sale').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
  const netCashflow = totalSales - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Records</h1>
          <p className="text-gray-500 text-sm mt-1">Manage daily sales, expenses, and worker payroll.</p>
        </div>
        {activeTab === 'transactions' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-blue-600 transition flex items-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" /></svg>
            Add Record
          </button>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
          <p className="text-sm text-gray-500">Total Sales</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">₦{totalSales.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-red-500">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">₦{totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
          <p className="text-sm text-gray-500">Net Cashflow</p>
          <p className={`text-2xl font-bold mt-1 ${netCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₦{netCashflow.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'transactions' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Sales & Expenses
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            activeTab === 'payroll' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Worker Payroll
        </button>
      </div>

      {/* Transactions Table */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-600">{txn.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        txn.type === 'Sale' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{txn.description}</td>
                    <td className={`px-6 py-4 text-sm font-semibold text-right ${txn.type === 'Sale' ? 'text-green-600' : 'text-red-600'}`}>
                      {txn.type === 'Sale' ? '+' : '-'}₦{txn.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">{txn.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payroll Table */}
      {activeTab === 'payroll' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Worker</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Month</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Base Salary</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Net Pay</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payroll.map((pay) => (
                  <tr key={pay.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{pay.worker}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{pay.month}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-right">₦{pay.baseSalary.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 text-right">₦{pay.netPay.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        pay.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {pay.status === 'Pending' && (
                        <button 
                          onClick={() => handlePayPayroll(pay.id)}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Mark as Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Add New Record</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" /></svg>
              </button>
            </div>
            
            <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Sale">Sale</option>
                    <option value="Expense">Expense</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="e.g., Walk-in sale of 10 bags" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦)</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-blue-600">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}