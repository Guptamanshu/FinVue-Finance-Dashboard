/*
  AppContext.jsx
  --------------
  This is where all the app-wide state lives. I went with useReducer
  instead of a bunch of useState calls because things got tangled fast
  once I had transactions + filters + search + role + dark mode all
  needing to stay in sync.

  The reducer keeps each state change as a clear action, and the
  memoized selectors (aggregates, filteredTransactions, insights)
  make sure we're not recalculating on every render.
*/

import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { initialTransactions, balanceHistory } from '../data/mockData';
import {
  computeAggregates,
  computeInsights,
  filterTransactions,
  generateId,
  loadFromStorage,
  saveToStorage,
} from '../utils/helpers';

// Keys used for localStorage — prefixed to avoid collisions
const STORAGE_KEYS = {
  TRANSACTIONS: 'finvue_transactions',
  DARK_MODE: 'finvue_dark_mode',
  ROLE: 'finvue_role',
};

// Keeping these as constants prevents typo bugs in dispatch calls
const ActionTypes = {
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  SET_SEARCH: 'SET_SEARCH',
  SET_FILTER_TYPE: 'SET_FILTER_TYPE',
  SET_SORT: 'SET_SORT',
  SET_ROLE: 'SET_ROLE',
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  SET_DARK_MODE: 'SET_DARK_MODE',
};

// Initial state — checks localStorage first, falls back to defaults
function getInitialState() {
  const savedTxns = loadFromStorage(STORAGE_KEYS.TRANSACTIONS);
  const savedDark = loadFromStorage(STORAGE_KEYS.DARK_MODE);
  const savedRole = loadFromStorage(STORAGE_KEYS.ROLE);

  return {
    transactions: savedTxns || initialTransactions,
    search: '',
    filterType: 'all',           // 'all' | 'income' | 'expense'
    sortField: 'date',
    sortDir: 'desc',
    role: savedRole || 'admin',  // 'admin' | 'viewer'
    darkMode: savedDark ?? false,
  };
}

// The main reducer — each case handles one type of state change
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_TRANSACTIONS:
      return { ...state, transactions: action.payload };

    case ActionTypes.ADD_TRANSACTION: {
      const newEntry = { ...action.payload, id: generateId(state.transactions) };
      return { ...state, transactions: [...state.transactions, newEntry] };
    }

    case ActionTypes.UPDATE_TRANSACTION: {
      const updated = state.transactions.map(txn =>
        txn.id === action.payload.id ? { ...txn, ...action.payload } : txn
      );
      return { ...state, transactions: updated };
    }

    case ActionTypes.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter(txn => txn.id !== action.payload),
      };

    case ActionTypes.SET_SEARCH:
      return { ...state, search: action.payload };

    case ActionTypes.SET_FILTER_TYPE:
      return { ...state, filterType: action.payload };

    // Clicking the same column header flips the direction
    case ActionTypes.SET_SORT:
      return {
        ...state,
        sortField: action.payload.field,
        sortDir:
          state.sortField === action.payload.field
            ? state.sortDir === 'asc' ? 'desc' : 'asc'
            : 'desc',
      };

    case ActionTypes.SET_ROLE:
      return { ...state, role: action.payload };

    case ActionTypes.TOGGLE_DARK_MODE:
      return { ...state, darkMode: !state.darkMode };

    case ActionTypes.SET_DARK_MODE:
      return { ...state, darkMode: action.payload };

    default:
      return state;
  }
}

// ── Context setup ──

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, undefined, getInitialState);

  // Auto-save to localStorage whenever these values change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, state.transactions);
  }, [state.transactions]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DARK_MODE, state.darkMode);
  }, [state.darkMode]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ROLE, state.role);
  }, [state.role]);

  // Toggle the 'dark' class on <html> — this is what makes all
  // the dark: prefixed Tailwind classes kick in
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.darkMode);
  }, [state.darkMode]);

  // ── Derived data (memoized so we don't recalculate on every render) ──

  const aggregates = useMemo(
    () => computeAggregates(state.transactions),
    [state.transactions]
  );

  const filteredTransactions = useMemo(
    () =>
      filterTransactions(state.transactions, {
        search: state.search,
        filterType: state.filterType,
        sortField: state.sortField,
        sortDir: state.sortDir,
      }),
    [state.transactions, state.search, state.filterType, state.sortField, state.sortDir]
  );

  const insights = useMemo(
    () => computeInsights(state.transactions, balanceHistory),
    [state.transactions]
  );

  // Wrapping dispatch calls in stable functions so child components
  // don't re-render just because the parent did
  const actions = useMemo(() => ({
    addTransaction:    (txn)   => dispatch({ type: ActionTypes.ADD_TRANSACTION, payload: txn }),
    updateTransaction: (txn)   => dispatch({ type: ActionTypes.UPDATE_TRANSACTION, payload: txn }),
    deleteTransaction: (id)    => dispatch({ type: ActionTypes.DELETE_TRANSACTION, payload: id }),
    setSearch:         (query) => dispatch({ type: ActionTypes.SET_SEARCH, payload: query }),
    setFilterType:     (type)  => dispatch({ type: ActionTypes.SET_FILTER_TYPE, payload: type }),
    setSort:           (field) => dispatch({ type: ActionTypes.SET_SORT, payload: { field } }),
    setRole:           (role)  => dispatch({ type: ActionTypes.SET_ROLE, payload: role }),
    toggleDarkMode:    ()      => dispatch({ type: ActionTypes.TOGGLE_DARK_MODE }),
  }), []);

  // Bundle everything into a single context value
  const value = useMemo(() => ({
    ...state,
    aggregates,
    filteredTransactions,
    insights,
    balanceHistory,
    isAdmin: state.role === 'admin',
    ...actions,
  }), [state, aggregates, filteredTransactions, insights, actions]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook — gives a clear error if someone uses it outside the provider
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within <AppProvider>');
  return ctx;
}
