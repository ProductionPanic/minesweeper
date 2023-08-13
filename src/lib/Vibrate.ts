import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { SettingsHandler, settings } from "./data/settings";

export class Vibrate {
    private static async shouldVibrate() {
        return (await SettingsHandler.get()).vibration;
    }

    private static async run_style(style: ImpactStyle) {
        if (!await this.shouldVibrate()) return
        await Haptics.impact({
            style
        })
    }
    public static async small() {
        await this.run_style(ImpactStyle.Light)
    }

    public static async medium() {
        await this.run_style(ImpactStyle.Medium)
    }

    public static async large() {
        await this.run_style(ImpactStyle.Heavy)
    }
}