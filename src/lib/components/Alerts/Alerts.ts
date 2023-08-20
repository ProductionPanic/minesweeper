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

export function addAlert(alert: Alert, removeAfterInMs: number = 3000, onNextLoad: boolean = false) {
    if (onNextLoad) {
        localStorage.setItem("alert", JSON.stringify(alert));
        localStorage.setItem("alertRemoveAfterInMs", removeAfterInMs.toString());
        return;
    }
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

export function check() {
    // Check if there is an alert in local storage
    const alert = localStorage.getItem("alert");
    if (alert) {
        const alertRemoveAfterInMs = localStorage.getItem("alertRemoveAfterInMs")!;
        addAlert(JSON.parse(alert), parseInt(alertRemoveAfterInMs));
        localStorage.removeItem("alert");
        localStorage.removeItem("alertRemoveAfterInMs");
    }
}