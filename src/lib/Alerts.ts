import { writable } from "svelte/store";

export interface Alert {
    type: "error" | "success" | "info" | "warning";
    title: string;
    message?: string;
    buttons?: {
        text: string;
        className?: string;
        action: () => void;
    }[];
}


export const alerts = writable<Alert[]>([]);

export function addAlert(alert: Alert, removeAfterInMs: number = 3000) {
    alerts.update((a) => [...a, alert]);
    setTimeout(() => {
        removeAlert(alert);
    }, removeAfterInMs);
}

export function removeAlert(alert: Alert) {
    alerts.update((alerts) => {
        alerts.splice(alerts.indexOf(alert), 1);
        return alerts;
    });
}

export function clearAlerts() {
    alerts.set([]);
}