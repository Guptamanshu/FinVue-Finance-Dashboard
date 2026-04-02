/*
  TransactionTable
  The main data table — handles search, filtering, and sorting.
  Anything above $1k gets a subtle amber highlight so big
  transactions don't get lost in the list.

  On mobile (< 640px) it switches to a card-based layout for
  better readability and touch targets.

  The modal for add/edit is rendered here too since it's tightly
  coupled to the table's edit/add actions.
*/

import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import TransactionModal from './TransactionModal';
import {
  Search, ArrowUpDown, Plus, Pencil, Trash2,
  ArrowUp, ArrowDown, Receipt,
} from 'lucide-react';

// Transactions at or above this amount get visually highlighted
const LARGE_AMOUNT_THRESHOLD = 1000;

export default function TransactionTable() {
  const {
    filteredTransactions,
    search, setSearch,
    filterType, setFilterType,
    sortField, sortDir, setSort,
    isAdmin,
    deleteTransaction,
  } = useAppContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTxn, setEditingTxn] = useState(null);

  function handleEdit(txn) {
    setEditingTxn(txn);
    setModalOpen(true);
  }

  function handleAdd() {
    setEditingTxn(null);
    setModalOpen(true);
  }

  function renderSortIcon(field) {
    if (sortField !== field) return <ArrowUpDown size={14} className="text-slate-400" />;
    return sortDir === 'asc'
      ? <ArrowUp size={14} className="text-brand-500" />
      : <ArrowDown size={14} className="text-brand-500" />;
  }

  return (
    <div className="animate-fade-in-up bg-white dark:bg-slate-800/80 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/50">
      {/* Header */}
      <div className="p-4 sm:p-5 md:p-6 border-b border-slate-100 dark:border-slate-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">Transactions</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            </p>
          </div>
          {isAdmin && (
            <button
              id="add-transaction-btn"
              onClick={handleAdd}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700
                text-white text-sm font-medium shadow-md shadow-brand-500/20
                transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/30 active:scale-[0.97]"
            >
              <Plus size={16} />
              Add Transaction
            </button>
          )}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col gap-3 mt-3 sm:mt-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="transaction-search"
              type="text"
              placeholder="Search by title or category…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600
                bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-700 dark:text-slate-200
                placeholder-slate-400 dark:placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400
                transition-all duration-200"
            />
          </div>

          {/* Filter + Sort row */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl flex-1 sm:flex-none">
              {['all', 'income', 'expense'].map(f => (
                <button
                  key={f}
                  id={`filter-${f}`}
                  onClick={() => setFilterType(f)}
                  className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium capitalize transition-all duration-200
                    ${filterType === f
                      ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* mobile sort buttons */}
            <div className="flex sm:hidden items-center gap-1 ml-auto">
              <button
                id="sort-date-mobile"
                onClick={() => setSort('date')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${sortField === 'date'
                    ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400'
                    : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50'}`}
              >
                Date {renderSortIcon('date')}
              </button>
              <button
                id="sort-amount-mobile"
                onClick={() => setSort('amount')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors
                  ${sortField === 'amount'
                    ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400'
                    : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50'}`}
              >
                Amt {renderSortIcon('amount')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-6 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
            <Receipt size={24} className="text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base">No transactions found</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs sm:text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          {/* ── Mobile card layout (< 640px) ── */}
          <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-700/30">
            {filteredTransactions.map(txn => {
              const isLarge = txn.amount >= LARGE_AMOUNT_THRESHOLD;
              return (
                <div
                  key={txn.id}
                  className={`px-4 py-3.5 flex items-start gap-3 transition-colors
                    ${isLarge ? 'bg-amber-50/40 dark:bg-amber-500/5' : ''}`}
                >
                  {/* Type indicator dot */}
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0
                    ${txn.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                          {txn.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-400 dark:text-slate-500">
                            {formatDate(txn.date)}
                          </span>
                          <span className="inline-flex px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            {txn.category}
                          </span>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold shrink-0
                        ${txn.type === 'income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                        }`}>
                        {txn.type === 'income' ? '+' : '−'}{formatCurrency(txn.amount)}
                      </span>
                    </div>

                    {/* Admin actions */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 mt-2">
                        <button
                          id={`edit-txn-${txn.id}`}
                          onClick={() => handleEdit(txn)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
                            text-slate-400 hover:text-brand-600 hover:bg-brand-50
                            dark:hover:text-brand-400 dark:hover:bg-brand-500/10 transition-colors"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          id={`delete-txn-${txn.id}`}
                          onClick={() => deleteTransaction(txn.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium
                            text-slate-400 hover:text-rose-600 hover:bg-rose-50
                            dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Desktop/tablet table layout (>= 640px) ── */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/50">
                  <th className="text-left py-3 px-4 md:px-6 font-medium text-slate-500 dark:text-slate-400">
                    <button id="sort-date" onClick={() => setSort('date')} className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                      Date {renderSortIcon('date')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-3 font-medium text-slate-500 dark:text-slate-400">Title</th>
                  <th className="text-left py-3 px-3 font-medium text-slate-500 dark:text-slate-400 hidden md:table-cell">Category</th>
                  <th className="text-left py-3 px-3 font-medium text-slate-500 dark:text-slate-400 hidden lg:table-cell">Type</th>
                  <th className="text-right py-3 px-3 font-medium text-slate-500 dark:text-slate-400">
                    <button id="sort-amount" onClick={() => setSort('amount')} className="flex items-center gap-1.5 ml-auto hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                      Amount {renderSortIcon('amount')}
                    </button>
                  </th>
                  {isAdmin && (
                    <th className="text-right py-3 px-4 md:px-6 font-medium text-slate-500 dark:text-slate-400">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map(txn => {
                  const isLarge = txn.amount >= LARGE_AMOUNT_THRESHOLD;
                  return (
                    <tr
                      key={txn.id}
                      className={`border-b border-slate-50 dark:border-slate-700/30 
                        hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors duration-150
                        ${isLarge ? 'bg-amber-50/40 dark:bg-amber-500/5' : ''}`}
                    >
                      <td className="py-3.5 px-4 md:px-6 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(txn.date)}
                      </td>
                      <td className="py-3.5 px-3">
                        <div>
                          <span className="font-medium text-slate-700 dark:text-slate-200">{txn.title}</span>
                          <span className="md:hidden block text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            {txn.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 hidden md:table-cell">
                        <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300">
                          {txn.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 hidden lg:table-cell">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold
                          ${txn.type === 'income'
                            ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                            : 'bg-rose-100 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400'
                          }`}>
                          {txn.type === 'income' ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <span className={`font-semibold
                          ${txn.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                          }`}>
                          {txn.type === 'income' ? '+' : '−'}{formatCurrency(txn.amount)}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="py-3.5 px-4 md:px-6 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              id={`edit-txn-${txn.id}`}
                              onClick={() => handleEdit(txn)}
                              className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50
                                dark:hover:text-brand-400 dark:hover:bg-brand-500/10 transition-colors"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              id={`delete-txn-${txn.id}`}
                              onClick={() => deleteTransaction(txn.id)}
                              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50
                                dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal */}
      {modalOpen && (
        <TransactionModal
          transaction={editingTxn}
          onClose={() => { setModalOpen(false); setEditingTxn(null); }}
        />
      )}
    </div>
  );
}
