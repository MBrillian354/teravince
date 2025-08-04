import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../utils/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    console.log('AuthContext: Initializing auth...');
    try {
      const token = authService.getToken();
      console.log('AuthContext: Token found:', !!token);
      
      if (token) {
        const storedUser = authService.getStoredUser();
        console.log('AuthContext: Stored user:', storedUser);
        
        if (storedUser) {
          console.log('AuthContext: Setting user from localStorage');
          setUser(storedUser);
          setIsAuthenticated(true);
        } else {
          console.log('AuthContext: Fetching user data from API');
          try {
            // Fetch user data if not in localStorage
            const userData = await authService.getUserData();
            console.log('AuthContext: User data from API:', userData);
            setUser(userData);
            setIsAuthenticated(true);
            authService.storeAuthData(token, userData);
          } catch (apiError) {
            console.error('AuthContext: Failed to fetch user data from API:', apiError);
            // If API call fails, token might be invalid, clear auth data
            logout();
          }
        }
      } else {
        console.log('AuthContext: No token found');
      }
    } catch (error) {
      console.error('AuthContext: Error during initialization:', error);
      // Token is invalid, clear auth data
      logout();
    } finally {
      console.log('AuthContext: Initialization complete');
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token, user: userData } = response;
      
      authService.storeAuthData(token, userData);
      setUser(userData);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    authService.storeAuthData(authService.getToken(), userData);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
