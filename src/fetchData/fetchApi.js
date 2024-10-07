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
