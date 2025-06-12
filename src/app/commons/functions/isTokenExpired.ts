import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export function isTokenExpired(token: string | null): boolean {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        return now >= payload.exp;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
}

export function getToken(platformId: Object): string | null {
    if (isPlatformBrowser(platformId)) {
        return localStorage.getItem('token');
    }
    return null;
}

export function removeToken(platformId: Object): void {
    if (isPlatformBrowser(platformId)) {
        localStorage.removeItem('token');
    }
}