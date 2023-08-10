import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { settings } from "./settings";

export class Vibrate {
    private static async shouldVibrate() {
        return new Promise<boolean>((resolve, reject) => {
            let unsub = settings.subscribe((value) => {
                resolve(value.vibration)
            })

            setTimeout(() => {
                unsub()
                resolve(false)
            }, 1000)
        })
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