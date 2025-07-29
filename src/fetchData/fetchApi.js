import { toast } from "react-toastify";
import { BASE_URL } from "../constant/constant";

export const getFormData = (object) => {
  const formData = new FormData();
  Object.keys(object).forEach((key) => formData.append(key, object[key]));
  return formData;
};

export const postData = async ({ data, endpoint }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/${endpoint}`, {
      method: "POST",
      body: getFormData(data),
    });
    const result = await response.json();

    if (result.success) {
      return result.data;
    }
    if (!result.success) {
      return result.message;
    }
    if (result.error) {
      throw result.error;
    }
  } catch (error) {
    return error;
  }
};
export const postDataWithoutAuth = async ({ data, endpoint }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/${endpoint}`, {
      method: "POST",
      body: getFormData(data),
    });
    const result = await response.json();
    if (result.success) {
      return result.data[0];
    }
    if (!result.success) {
      return result.message;
    }
    if (result.error) {
      throw result.error;
    }
  } catch (error) {
    return error;
  }
};

export const postDataWithAuth = async ({ data, endpoint, authToken }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: getFormData(data),
    });
    const result = await response.json();
    if (result.success) {
      return result.data[0];
    }
    if (!result.success) {
      throw result.message;
    }
    if (result.error) {
      throw result.error;
    }
  } catch (error) {
    return error;
  }
};

export const postFetchDataWithAuth = async ({ data, endpoint, authToken }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: getFormData(data),
    });
    const result = await response.json();
    if (result.success) {
      return result;
    }
    if (!result.success) {
      throw result.message;
    }
    if (result.error) {
      throw result.error;
    }
  } catch (error) {
    return error;
  }
};

export const postFetchWithAuth = async ({ data, endpoint, authToken }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.success) {
      return result;
    }
    if (!result.success) {
      throw result.message;
    }
    if (result.error) {
      throw result.error;
    }
  } catch (error) {
    return error;
  }
};


// new API call to show mssg to user if he tries to buy voopons more than their limit


// export const checkVooponPurchaseLimit = async ({ 
//   user_id, 
//   voopon_unique_number, 
//   authToken 
// }) => {
//   try {
//     const response = await fetch(`${BASE_URL}/api/auth/user_buy_now_voopon_quantity`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//       body: getFormData({ 
//         user_id,
//         voopon_unique_number 
//       }),
//     });
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     return { 
//       success: false, 
//       message: error.message || "Failed to check voopon purchase limit" 
//     };
//   }
// };


// export const checkVooponPurchaseLimit = async ({ 
//   user_id, 
//   voopon_unique_number, 
//   authToken 
// }) => {
//   try {
//     const formData = new FormData();
//     formData.append('user_id', user_id);
//     formData.append('unique_number', voopon_unique_number);  // Changed to match API expectation
    
//     const response = await fetch(`${BASE_URL}/api/auth/user_buy_now_voopon_quantity`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//       body: formData,
//     });
    
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     return { 
//       success: false, 
//       message: error.message || "Failed to check voopon purchase limit" 
//     };
//   }
// };



export const checkVooponPurchaseLimit = async ({ 
  user_id, 
  voopon_unique_number, 
  authToken 
}) => {
  try {
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('unique_number', voopon_unique_number);
    
    const response = await fetch(`${BASE_URL}/api/auth/user_buy_now_voopon_quantity`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });
    
    const result = await response.json();
    
    // Ensure the response has the expected structure
    if (result.success) {
      return {
        success: true,
        data: {
          max_limit: result.data?.max_allow_on_this_voopon || result.max_allow_on_this_voopon,
          current_usage: result.data?.total_voopon_buyed || result.total_voopon_buyed,
          message: result.data?.message || result.message || "Purchase limit reached"
        }
      };
    }
    return result;
  } catch (error) {
    return { 
      success: false, 
      message: error.message || "Failed to check voopon purchase limit" 
    };
  }
};