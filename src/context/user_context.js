import { createContext, useContext, useReducer, useEffect } from "react";

const UserContext = createContext();
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

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

  const requestAuth = async (path, payload) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.message || "Authentication request failed");
    }

    return data;
  };

  const saveAuthenticatedUser = (user, actionType = "LOGIN_SUCCESS") => {
    dispatch({ type: actionType, payload: user });
    localStorage.setItem("postertownUser", JSON.stringify(user));
    return user;
  };

  const login = async (email, password) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const data = await requestAuth("/api/auth/login", { email, password });
      return saveAuthenticatedUser(data.user, "LOGIN_SUCCESS");
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: error.message });
      throw error;
    }
  };

  // credential is the ID token from Google's sign-in button; the backend verifies it.
  const loginWithGoogle = async (credential) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const data = await requestAuth("/api/auth/google", { credential });
      return saveAuthenticatedUser(data.user, "LOGIN_SUCCESS");
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: error.message });
      throw error;
    }
  };

  const startRegistration = async (name, email, password) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const data = await requestAuth("/api/auth/signup/start", { name, email, password });
      dispatch({ type: "REQUEST_SUCCESS" });
      return data;
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: error.message });
      throw error;
    }
  };

  const verifyRegistration = async (email, otp) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const data = await requestAuth("/api/auth/signup/verify", { email, otp });
      return saveAuthenticatedUser(data.user, "REGISTER_SUCCESS");
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: error.message });
      throw error;
    }
  };

  const register = async (name, email, password) => {
    await startRegistration(name, email, password);
  };

  const requestPasswordReset = async (email) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const data = await requestAuth("/api/auth/password/forgot", { email });
      dispatch({ type: "REQUEST_SUCCESS" });
      return data;
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: error.message });
      throw error;
    }
  };

  const resetPassword = async (email, otp, password) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const data = await requestAuth("/api/auth/password/reset", { email, otp, password });
      return saveAuthenticatedUser(data.user, "LOGIN_SUCCESS");
    } catch (error) {
      dispatch({ type: "AUTH_ERROR", payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("postertownUser");
  };

  // Stores the delivery address on the account so it is there on every login.
  const saveAddress = async (address) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/address`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: state.user?.id, email: state.user?.email, address }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.message || "Could not save your address");
    }

    return saveAuthenticatedUser(data.user, "RESTORE_USER");
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
        loginWithGoogle,
        register,
        startRegistration,
        verifyRegistration,
        requestPasswordReset,
        resetPassword,
        logout,
        saveAddress,
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
    case "REQUEST_SUCCESS":
      return { ...state, isLoading: false, error: null };
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
