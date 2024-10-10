// api.ts
import { getSession } from "./lib";

export const Backend_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const findToken = async () => {
  const session = await getSession();
  const token = session?.accessToken;
  return token;
};


export const getFetch = async (
  url: string,
  body: any = null,
  headers: Record<string, string> = {}
) => {
  try {
    const token = await findToken();
    if (!token) {
      throw new Error("No access token found");
    }

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error: any) {
    console.error("Fetch API Error:", error.message);
    throw new Error(error.message || "An error occurred");
  }
};

export const postFetch = async (
  url: string,
  body: any,
  headers: Record<string, string> = {}
) => {
  try {
    const token = await findToken();
    if (!token) {
      throw new Error("No access token found");
    }

    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error: any) {
    console.error("Fetch API Error:", error.message);
    throw new Error(error.message || "An error occurred");
  }
};

// this is somehow working, please don't touch this 🙏 🙏 🙏
export const postMediaFetch = async (
  url: string,
  body: FormData,
  headers: Record<string, string> = {}
) => {
  try {
    const token = await findToken();
    if (!token) {
      throw new Error("No access token found");
    }

    const options: RequestInit = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      body: body,
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error: any) {
    console.error("Fetch API Error:", error.message);
    throw new Error(error.message || "An error occurred");
  }
};

export const deleteFetch = async (
  url: string,
  body: any,
  headers: Record<string, string> = {}
) => {
  try {
    const token = await findToken();
    if (!token) {
      throw new Error("No access token found");
    }
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "multipart/form-data",
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      body: JSON.stringify(body), // Directly stringify the provided body
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error: any) {
    console.error("Fetch API Error:", error.message);
    throw new Error(error.message || "An error occurred");
  }
};

export const deleteSingleFetch = async (
  url: string,
  headers: Record<string, string> = {}
) => {
  try {
    const token = await findToken();
    if (!token) {
      throw new Error("No access token found");
    }
    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "multipart/form-data",
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error: any) {
    console.error("Fetch API Error:", error.message);
    throw new Error(error.message || "An error occurred");
  }
};

export const putFetch = async (
  url: string,
  body: any,
  headers: Record<string, string> = {}
) => {
  try {
    const token = await findToken();
    if (!token) {
      throw new Error("No access token found");
    }

    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "multipart/form-data",
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const patchFetch = async (
  url: string,
  body: any,
  headers: Record<string, string> = {}
) => {
  try {
    const token = await findToken();
    if (!token) {
      throw new Error("No access token found");
    }

    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "multipart/form-data",
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      body: JSON.stringify(body),
    };


    const response = await fetch(url, options);
    const data = await response.json();


    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error: any) {
    console.log(error);
    // throw new Error(error.message || "An error occurred");
  }
};

export const editProductFetch = async (
  url: string,
  body: FormData,
  headers: Record<string, string> = {}
) => {
  try {
    const token = await findToken();
    if (!token) {
      throw new Error("No access token found");
    }

    const options: RequestInit = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      body: body,
    };

    const response = await fetch(url, options);

    // Check if the response is in JSON format
    const contentType = response.headers.get("Content-Type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // Handle non-JSON response (e.g., text or HTML)
      data = await response.text();
    }


    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error: any) {
    console.error("Error during fetch:", error);
    throw error;
  }
};

export const editSliderFetch = async (
  url: string,
  body: FormData,
  headers: Record<string, string> = {}
) => {
  try {
    const token = await findToken();
    if (!token) {
      throw new Error("No access token found");
    }

    const options: RequestInit = {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      body: body,
    };

    const response = await fetch(url, options);

    // Check if the response is in JSON format
    const contentType = response.headers.get("Content-Type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // Handle non-JSON response (e.g., text or HTML)
      data = await response.text();
    }


    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error: any) {
    console.error("Error during fetch:", error);
    throw error;
  }
};

export const putMediaFetch = async (
  url: string,
  body: FormData,
  headers: Record<string, string> = {}
) => {
  try {
    const token = await findToken();
    if (!token) {
      throw new Error("No access token found");
    }

    const options: RequestInit = {
      method: "PUT",
      headers: {
        Accept: "application/json", // Expect JSON response from the server
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      body: body,
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error: any) {
    throw error;
  }
};

export const getFetchForEcom = async (
  url: string,
  body: any = null,
  headers: Record<string, string> = {}
) => {
  try {
    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  } catch (error: any) {
    console.error("Fetch API Error:", error.message);
    throw new Error(error.message || "An error occurred");
  }
};
