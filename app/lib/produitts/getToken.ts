'use client';

export const setToken = (token: string) => {
  document.cookie = `token=${token}; path=/;`;
};

export const getTokenFromLocalStorage = (): string | null => {
  return localStorage.getItem('token');
};
