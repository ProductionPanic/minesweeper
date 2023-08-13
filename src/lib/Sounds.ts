import { Vibrate } from "./Vibrate";
import { SettingsHandler } from "./data/settings";

export class Sounds {
    private static pop_sounds = ["pop1","pop2","pop3"];

    private static async shouldPlay() {
        return (await SettingsHandler.get()).useSound
    }

    public static async pop() {
        Vibrate.small();
        if(!await this.shouldPlay()) return;
        const randomPop = this.pop_sounds[Math.floor(Math.random() * this.pop_sounds.length)]
        let audio = new Audio("/sounds/"+randomPop+".mp3")
        audio.volume = 0.05;
        audio.play();
    }
}