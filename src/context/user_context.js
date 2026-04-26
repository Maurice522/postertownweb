import { createContext, useContext, useReducer, useEffect } from "react";

const UserContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getUserFromStorage = () => {
    const userData = localStorage.getItem("postertownUser");
    if (userData) {
      const parsed = JSON.parse(userData);
      return { user: parsed, isAuthenticated: true };
    }
    return initialState;
  };

  const login = (email, password) => {
    dispatch({ type: "SET_LOADING" });
    // Simulated login - replace with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = { email, name: email.split("@")[0] };
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
        localStorage.setItem("postertownUser", JSON.stringify(user));
        resolve(user);
      }, 500);
    });
  };

  const register = (name, email, password) => {
    dispatch({ type: "SET_LOADING" });
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = { name, email };
        dispatch({ type: "REGISTER_SUCCESS", payload: user });
        localStorage.setItem("postertownUser", JSON.stringify(user));
        resolve(user);
      }, 500);
    });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("postertownUser");
  };

  const updateProfile = (updates) => {
    dispatch({ type: "UPDATE_PROFILE", payload: updates });
    const updatedUser = { ...state.user, ...updates };
    localStorage.setItem("postertownUser", JSON.stringify(updatedUser));
  };

  useEffect(() => {
    const stored = getUserFromStorage();
    if (stored.isAuthenticated) {
      dispatch({ type: "RESTORE_USER", payload: stored.user });
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
      }}>
      {children}
    </UserContext.Provider>
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
    case "RESTORE_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    case "UPDATE_PROFILE":
      return { ...state, user: { ...state.user, ...action.payload } };
    case "AUTH_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
};

const useUserContext = () => {
  return useContext(UserContext);
};

export { UserProvider, useUserContext };