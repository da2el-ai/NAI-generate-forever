///////////////////////////////////////////
///////////////////////////////////////////
// 無限生成管理
///////////////////////////////////////////
///////////////////////////////////////////

import { ElementControl } from './ElementControl';
// import { PromptControl } from './PromptControl';

type TNGFState = 'forever' | 'foreverDice' | 'stop';

// type TPromptElement = HTMLInputElement & {
//     _valueTracker?: {
//         setValue: (param: string) => void;
//     };
// };

const BUTTON_TEXT_GENERATE_EN = 'Generate';
const BUTTON_TEXT_GENERATE_JA = '生成';

class NaiGenerateForever {
    // // 標準の生成ボタンのセレクタ
    // static BTN_SELECTOR =
    //     '#__next > div:nth-child(2) > div:nth-child(4) > div > div:nth-child(5) > button[data-confirm-added="true"]';
    // 標準のプロンプトエリアのセレクタ
    static PROMPT_SELECTOR = "textarea[placeholder='プロンプトを入力し、理想の画像を生成しましょう']";
    // 標準の生成ボタン
    generateButton: HTMLButtonElement | null = null;
    // 生成回数カウンタ
    generateCount: number = 0;
    // 追加で作成するエレメントのコントローラー
    elmCtrl: ElementControl;
    // プロンプト変換コントローラー
    // promptCtrl: PromptControl;
    // ステータス
    state: TNGFState = 'stop';

    constructor() {
        // this.promptCtrl = new PromptControl();

        // 操作エレメントコントローラー生成
        this.elmCtrl = new ElementControl({
            foreverFunc: () => {
                this.generateForever('forever');
            },
            foreverDiceFunc: () => {
                this.generateForever('foreverDice');
            },
            cancelFunc: () => {
                this.cancelForever();
            },
        });

        // 一定間隔で無限生成ボタンの存在確認と配置を行う
        this.resetElements();
        setInterval(() => {
            this.resetElements();
        }, 3000);
    }

    /**
     * Naildcard のダイスボタンを取得
     */
    get diceButton() {
        return document.getElementById('dice-button');
    }

    /**
     * 生成ボタンを取得
     */
    getGenerateButton(): HTMLButtonElement | undefined {
        const buttons = [...document.querySelectorAll<HTMLButtonElement>('button')];

        for (const button of buttons) {
            const buttonText = button.textContent;
            if (buttonText?.includes(BUTTON_TEXT_GENERATE_EN) || buttonText?.includes(BUTTON_TEXT_GENERATE_JA)) {
                return button;
            }
        }
        return undefined;
    }

    /**
     * 生成ボタンを変数に格納する
     * ボタンが画面から消えていたら配置もする
     * 一定間隔で setInterval により実行される
     */
    resetElements() {
        // this.generateButton = document.querySelector(NaiGenerateForever.BTN_SELECTOR);
        this.generateButton = this.getGenerateButton() as HTMLButtonElement;

        // インペイント画面などで生成ボタンが無ければ抜ける
        if (!this.generateButton) return;

        const parent = this.generateButton.parentNode as HTMLElement;

        if (!parent.contains(this.elmCtrl.foreverButton)) {
            this.elmCtrl.attachElements(parent);
        }

        // Naildcardの有効・無効で forever dice ボタンを切り替える
        if (this.elmCtrl.foreverDiceButton) {
            if (this.diceButton) {
                this.elmCtrl.foreverDiceButton.style.display = 'inline';
            } else {
                this.elmCtrl.foreverDiceButton.style.display = 'none';
            }
        }
    }

    /**
     * 無限生成を停止
     */
    cancelForever() {
        this.state = 'stop';
        // ボタンを通常状態に戻す
        this.elmCtrl.setStateNormal();
        // // プロンプトを元に戻す
        // this.setPrompt(this.promptCtrl.originalPrompt);
    }

    /**
     * 無限生成を開始
     */
    generateForever(state: TNGFState) {
        // this.cancelForever();

        this.generateCount = 0;
        this.elmCtrl.setCounter(0);

        // ボタンを開始状態にする
        this.elmCtrl.setStateActive();
        this.state = state;

        // // オリジナルプロンプトの保存
        // this.promptCtrl.setOriginalPrompt(this.getPrompt());

        this.generateImage();
    }

    async generateImage() {
        if (
            (this.state === 'forever' || this.state === 'foreverDice') &&
            this.generateButton &&
            !this.generateButton.disabled
        ) {
            this.generateCount += 1;
            this.elmCtrl.setCounter(this.generateCount);

            // this.setPrompt(this.promptCtrl.getRandomPrompt());
            if (this.state === 'foreverDice') {
                await this.naildCard();
            }

            this.generateButton.click();
        }

        if (this.elmCtrl.batchCount > 0 && this.generateCount >= this.elmCtrl.batchCount) {
            // 指定数達したら終了
            this.cancelForever();
            //
        } else if (this.state === 'forever' || this.state === 'foreverDice') {
            // ランダム時間待機して再実行
            const timing = (Math.random() * this.elmCtrl.waitRandom + this.elmCtrl.waitSec) * 1000;
            // console.log(timing);

            setTimeout(() => {
                this.generateImage();
            }, timing);
        }
    }

    /**
     * Naildcardがインストールされていたら実行する
     */
    naildCard() {
        const diceBtn = document.getElementById('dice-button');
        if (!diceBtn) return;

        diceBtn.click();
        return new Promise((resolve) => setTimeout(resolve, 500));
    }

    // get promptElement() {
    //     return document.querySelector(NaiGenerateForever.PROMPT_SELECTOR) as TPromptElement;
    // }

    // setPrompt(prompt: string) {
    //     const promptElement = this.promptElement;
    //     promptElement.value = prompt;
    //     promptElement._valueTracker?.setValue('');
    //     promptElement.dispatchEvent(new Event('input', { bubbles: true }));
    // }

    // getPrompt(): string {
    //     return this.promptElement.value;
    // }
}

export { NaiGenerateForever };
