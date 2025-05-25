import axios from "axios";
import { logoutUser } from "../features/slices/userSlice";
import { store } from "../features/store";
import axiosInstance from "../config/interceptor";
import { LOCAL_USER } from "../config/constants";

// Define the API response structure
interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

// Define the cashier data structure
interface CashierResponse {
  id: string;
  shopId: string;
  active: boolean;
  userId: string;
  limitUpdated: string | null;
  limitMet: boolean;
  isSuperCashier: boolean;
  createdAt: string;
  updatedAt: string;
  User?: {
    id: string;
    username: string;
    phone: string | null;
  };
  Shop?: {
    id: string;
    name: string;
    address: string;
    phone: string;
    rtp: string;
    maxWin: number;
    agentId: string;
    oddId: string;
    gameStartNumber: string;
    depositBalance: string;
    shopLimit: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface User {
  id: string;
  username: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  Agent: null | any;
  Cashier: {
    id: string;
    shopId: string;
    active: boolean;
    userId: string;
    createdAt: string;
    updatedAt: string;
    isSuperCashier: boolean;
  };
  token: string;
}

/**
 * Gets the current user's shop ID from localStorage
 */
const getCurrentShopId = (): string | null => {
  try {
    const userData = localStorage.getItem(LOCAL_USER);
    if (userData) {
      const user: User = JSON.parse(userData);
      if (user && user.Cashier && user.Cashier.shopId) {
        return user.Cashier.shopId;
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting shop ID:", error);
    return null;
  }
};

/**
 * Checks if all cashiers for a specific shop are active
 * If any cashier is inactive, triggers a logout
 */
export const checkCashierStatus = async () => {
  try {
    // Get the shop ID dynamically from the current user
    const shopId = getCurrentShopId();

    if (!shopId) {
      console.error(
        "Could not determine shop ID. Skipping cashier status check."
      );
      return;
    }

    const response = await axiosInstance.get<ApiResponse<CashierResponse[]> | CashierResponse[]>(
      `/cashier/${shopId}`
    );

    // Handle different API response formats
    // Some APIs return { data: [...] } while others return the array directly
    const cashiers = 'data' in response.data && Array.isArray(response.data.data)
      ? response.data.data
      : response.data;

    // Ensure cashiers is an array before using array methods
    if (!Array.isArray(cashiers)) {
      console.error("Expected cashiers to be an array, but got:", typeof cashiers, cashiers);
      return;
    }

    // Log the cashiers data for debugging (remove in production)
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Found ${cashiers.length} cashiers for shop ${shopId}`);
    }

    // Check if all cashiers are active
    const allActive = cashiers.length > 0 && cashiers.every((cashier) => cashier.active === true);

    if (!allActive) {
      // Log which cashiers are inactive
      const inactiveCashiers = cashiers.filter(cashier => !cashier.active);
      console.warn(`Found ${inactiveCashiers.length} inactive cashiers. Logging out.`);

      // Dispatch logout action
      store.dispatch(logoutUser());
    } else if (process.env.NODE_ENV !== 'production') {
      console.log('All cashiers are active. Continuing session.');
    }
  } catch (error) {
    // Provide more detailed error information
    if (axios.isAxiosError(error)) {
      console.error("API Error checking cashier status:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
    } else {
      console.error("Error checking cashier status:", error);
    }

    // On API error, we could also choose to logout for safety
    // Uncomment the following line if you want to logout on API errors
    // store.dispatch(logoutUser());
  }
};

/**
 * Sets up periodic checking of cashier status every 10 minutes
 */
export const setupCashierStatusCheck = () => {
  // Check immediately on setup
  checkCashierStatus();

  // Then check every 10 minutes (600000 ms)
  const intervalId = setInterval(() => {
    checkCashierStatus();
  }, 600000);

  // Return the interval ID so it can be cleared if needed
  return intervalId;
};

export default setupCashierStatusCheck;
