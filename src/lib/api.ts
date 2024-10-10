// api.ts
import { getSession } from "./lib";

export const Backend_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function fetchApi(
  url: string,
  method: string = "GET",
  body: any = null,
  headers: Record<string, string> = {}
) {
  try {
    const session = await getSession();
    const token = session?.accessToken;

    if (!token) {
      throw new Error("No access token found");
    }

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...headers,
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

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
}
