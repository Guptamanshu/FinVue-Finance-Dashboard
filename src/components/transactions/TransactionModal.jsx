/*
  TransactionModal
  Handles both creating and editing transactions in one component.
*/

import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { X } from 'lucide-react';

const INITIAL_FORM = {
  date: new Date().toISOString().split('T')[0],
  title: '',
  amount: '',
  category: CATEGORIES?.[0] || '',
  type: 'expense',
};

export default function TransactionModal({ transaction, onClose }) {
  const { addTransaction, updateTransaction } = useAppContext();
  const isEditing = Boolean(transaction);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ Sync form when editing changes
  useEffect(() => {
    if (transaction) {
      setForm({
        ...transaction,
        amount: String(transaction.amount),
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [transaction]);

  // ✅ Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // ✅ Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  function validate() {
    const errs = {};

    if (!form.title.trim()) errs.title = 'Title is required';

    const amount = Number(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0) {
      errs.amount = 'Enter a valid amount';
    }

    if (!form.date) errs.date = 'Date is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) return;

    const amount = Number(form.amount);

    const txnData = {
      ...form,
      amount,
    };

    try {
      setLoading(true);

      if (isEditing) {
        await updateTransaction({ ...txnData, id: transaction.id });
      } else {
        await addTransaction(txnData);
      }

      onClose();
    } catch (err) {
      console.error('Transaction failed:', err);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center"
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()} // ✅ FIXED
        className="w-full max-w-md mx-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">
            {isEditing ? 'Edit Transaction' : 'New Transaction'}
          </h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={e => handleChange('title', e.target.value)}
            className="w-full p-2 border rounded"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

          {/* Amount */}
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={e => handleChange('amount', e.target.value)}
            className="w-full p-2 border rounded"
          />
          {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}

          {/* Date */}
          <input
            type="date"
            value={form.date}
            onChange={e => handleChange('date', e.target.value)}
            className="w-full p-2 border rounded"
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}

          {/* Category */}
          <select
            value={form.category}
            onChange={e => handleChange('category', e.target.value)}
            className="w-full p-2 border rounded"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Type */}
          <div className="flex gap-2">
            {['expense', 'income'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => handleChange('type', t)}
                className={`flex-1 p-2 rounded ${
                  form.type === t
                    ? t === 'income'
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            {loading
              ? 'Processing...'
              : isEditing
              ? 'Update Transaction'
              : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}