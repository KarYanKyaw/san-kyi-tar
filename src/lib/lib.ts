// lib/auth.ts

import axios from "axios";
import Cookies from "js-cookie";
import jwt, { JwtPayload } from "jsonwebtoken";

const Backend_URL = process.env.NEXT_PUBLIC_BACKEND_URL; // Replace with your API URL

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export function setTokens({ accessToken, refreshToken }: Tokens): void {
  Cookies.set("accessToken", accessToken);
  Cookies.set("refreshToken", refreshToken);
}

export function getAccessToken(): string | undefined {
  return Cookies.get("accessToken");
}

export function getRefreshToken(): string | undefined {
  return Cookies.get("refreshToken");
}

export function clearTokens(): void {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
}

function isJwtPayload(token: any): token is JwtPayload {
  return typeof token === "object" && token !== null && "exp" in token;
}

export function isAccessTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);

  if (!decoded || !isJwtPayload(decoded) || !decoded.exp) return true;

  return decoded.exp * 1000 < Date.now();
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await axios.post<{ accessToken: string }>(
      `${Backend_URL}/auth/refreshToken`,
      { refreshToken }
    );
    const { accessToken } = res.data;
    setTokens({ accessToken, refreshToken });
    return accessToken;
  } catch (error) {
    clearTokens();
    return null;
  }
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse | null> {
  try {
    const res = await axios.post<LoginResponse>(`${Backend_URL}/auth/login`, {
      email,
      password,
    });
    const { accessToken, refreshToken } = res.data;
    setTokens({ accessToken, refreshToken });
    return res.data;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function getSession() {
  let accessToken = getAccessToken();

  if (!accessToken || isAccessTokenExpired(accessToken)) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      accessToken = newAccessToken;
    }
  }
  if (accessToken) {
    return { accessToken };
  }

  return null;
}
