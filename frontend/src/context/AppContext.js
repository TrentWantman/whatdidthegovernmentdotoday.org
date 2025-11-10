import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  user: {
    preferences: {
      itemsPerPage: 10,
      defaultSort: 'updateDate+desc',
      favoriteTopics: [],
      notifications: true
    }
  },
  cache: {
    searches: [],
    recentBills: [],
    favorites: []
  },
  ui: {
    theme: 'light',
    sidebarOpen: false,
    loading: false,
    notifications: []
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        ui: { ...state.ui, loading: action.payload }
      };

    case 'SET_USER_PREFERENCE':
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            [action.payload.key]: action.payload.value
          }
        }
      };

    case 'ADD_TO_FAVORITES':
      const isAlreadyFavorite = state.cache.favorites.some(
        fav => fav.slug === action.payload.slug
      );
      if (isAlreadyFavorite) return state;

      return {
        ...state,
        cache: {
          ...state.cache,
          favorites: [...state.cache.favorites, action.payload]
        }
      };

    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        cache: {
          ...state.cache,
          favorites: state.cache.favorites.filter(
            fav => fav.slug !== action.payload
          )
        }
      };

    case 'ADD_RECENT_SEARCH':
      const newSearches = [
        action.payload,
        ...state.cache.searches.filter(
          search => search.query !== action.payload.query
        )
      ].slice(0, 10);

      return {
        ...state,
        cache: {
          ...state.cache,
          searches: newSearches
        }
      };

    case 'ADD_RECENT_BILL':
      const newRecentBills = [
        action.payload,
        ...state.cache.recentBills.filter(
          bill => bill.slug !== action.payload.slug
        )
      ].slice(0, 20);

      return {
        ...state,
        cache: {
          ...state.cache,
          recentBills: newRecentBills
        }
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen }
      };

    case 'SET_THEME':
      return {
        ...state,
        ui: { ...state.ui, theme: action.payload }
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [
            ...state.ui.notifications,
            {
              id: Date.now(),
              ...action.payload,
              timestamp: new Date().toISOString()
            }
          ]
        }
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(
            notif => notif.id !== action.payload
          )
        }
      };

    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        ui: { ...state.ui, notifications: [] }
      };

    case 'HYDRATE_STATE':
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedState = localStorage.getItem('appState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'HYDRATE_STATE', payload: parsedState });
      } catch (error) {
        console.warn('Failed to parse saved state:', error);
      }
    }
  }, []);

  useEffect(() => {
    const stateToSave = {
      user: state.user,
      cache: {
        ...state.cache,
        searches: state.cache.searches.slice(0, 10),
        recentBills: state.cache.recentBills.slice(0, 20),
        favorites: state.cache.favorites
      }
    };

    localStorage.setItem('appState', JSON.stringify(stateToSave));
  }, [state.user, state.cache]);

  const actions = {
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),

    setUserPreference: (key, value) =>
      dispatch({ type: 'SET_USER_PREFERENCE', payload: { key, value } }),

    addToFavorites: (bill) =>
      dispatch({ type: 'ADD_TO_FAVORITES', payload: bill }),

    removeFromFavorites: (billSlug) =>
      dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: billSlug }),

    isFavorite: (billSlug) =>
      state.cache.favorites.some(fav => fav.slug === billSlug),

    addRecentSearch: (searchData) =>
      dispatch({ type: 'ADD_RECENT_SEARCH', payload: searchData }),

    addRecentBill: (bill) =>
      dispatch({ type: 'ADD_RECENT_BILL', payload: bill }),

    toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),

    setTheme: (theme) => dispatch({ type: 'SET_THEME', payload: theme }),

    addNotification: (notification) =>
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),

    removeNotification: (id) =>
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id }),

    clearAllNotifications: () =>
      dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' })
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export { AppContext };