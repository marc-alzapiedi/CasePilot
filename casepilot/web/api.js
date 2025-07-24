// Sets up the API client for interacting with your backend.
// For your API reference, visit: https://docs.gadget.dev/api/casepilot
import { Client } from "@gadget-client/casepilot";

let apiInstance = null;

export const getApi = (options = {}) => {
  if (!apiInstance) {
    let environment;
    
    // If standalone mode is enabled, use the provided environment or default
    if (options.standalone) {
      environment = options.environment || "development";
    } else {
      // Check if we're in a browser environment
      if (typeof window === "undefined") {
        throw new Error("getApi called in non-browser environment without standalone mode. Use getApi({ standalone: true, environment: 'your-environment' })");
      }
      
      // Check for Gadget config
      if (!window.gadgetConfig) {
        throw new Error("Gadget configuration not available on window.gadgetConfig. This may happen in standalone components. Use getApi({ standalone: true, environment: 'your-environment' }) for standalone usage.");
      }
      
      if (!window.gadgetConfig.environment) {
        throw new Error("Gadget environment not specified in window.gadgetConfig.environment");
      }
      
      environment = window.gadgetConfig.environment;
    }
    
    try {
      apiInstance = new Client({ environment });
    } catch (error) {
      throw new Error(`Failed to initialize Gadget API client: ${error.message}`);
    }
  }
  return apiInstance;
};

// Direct API instance for immediate use in React components
const createApiInstance = () => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    throw new Error("API client requires browser environment. Use getApi({ standalone: true, environment: 'your-environment' }) for server-side usage.");
  }
  
  // Check for Gadget config
  if (!window.gadgetConfig) {
    throw new Error("Gadget configuration not available on window.gadgetConfig.");
  }
  
  if (!window.gadgetConfig.environment) {
    throw new Error("Gadget environment not specified in window.gadgetConfig.environment");
  }
  
  try {
    return new Client({ environment: window.gadgetConfig.environment });
  } catch (error) {
    throw new Error(`Failed to initialize Gadget API client: ${error.message}`);
  }
};

export const api = createApiInstance();