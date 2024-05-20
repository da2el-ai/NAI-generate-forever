///////////////////////////////////////////
///////////////////////////////////////////
// 無限生成管理
///////////////////////////////////////////
///////////////////////////////////////////

import { ElementControl } from './ElementControl';
// import { PromptControl } from './PromptControl';

type TNGFState = 'forever' | 'stop';

// type TPromptElement = HTMLInputElement & {
//     _valueTracker?: {
//         setValue: (param: string) => void;
//     };
// };

class NaiGenerateForever {
    // 標準の生成ボタンのセレクタ
    static BTN_SELECTOR = '#__next > div:nth-child(2) > div:nth-child(4) > div > div:nth-child(5) > button';
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
                this.generateForever();
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
     * 生成ボタンを変数に格納する
     * ボタンが画面から消えていたら配置もする
     */
    resetElements() {
        this.generateButton = document.querySelector(NaiGenerateForever.BTN_SELECTOR);

        // インペイント画面などで生成ボタンが無ければ抜ける
        if (!this.generateButton) return;

        const parent = this.generateButton.parentNode as HTMLElement;

        if (!parent.contains(this.elmCtrl.foreverButton)) {
            this.elmCtrl.attachElements(parent);
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
    generateForever() {
        // this.cancelForever();

        this.generateCount = 0;
        this.elmCtrl.setCounter(0);

        // ボタンを開始状態にする
        this.elmCtrl.setStateActive();
        this.state = 'forever';

        // // オリジナルプロンプトの保存
        // this.promptCtrl.setOriginalPrompt(this.getPrompt());

        this.generateImage();
    }

    generateImage() {
        if (this.state === 'forever' && this.generateButton && !this.generateButton.disabled) {
            this.generateCount += 1;
            this.elmCtrl.setCounter(this.generateCount);

            // this.setPrompt(this.promptCtrl.getRandomPrompt());
            this.generateButton.click();
        }

        if (this.elmCtrl.batchCount > 0 && this.generateCount >= this.elmCtrl.batchCount) {
            // 指定数達したら終了
            this.cancelForever();
            //
        } else if (this.state === 'forever') {
            // ランダム時間待機して再実行
            const timing = (Math.random() * this.elmCtrl.waitRandom + this.elmCtrl.waitSec) * 1000;
            // console.log(timing);

            setTimeout(() => {
                this.generateImage();
            }, timing);
        }
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