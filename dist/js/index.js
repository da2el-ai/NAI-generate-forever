var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const DEFAULT_WAIT_SEC = 3;
const DEFAULT_WAIT_RANDOM = 2;
const CLASS_CONTAINER = "d2-container";
const CLASS_INPUT_CONTAINER = "d2-input-container";
const CLASS_INPUT_COMPO = "d2-input-compo";
const CLASS_INPUT = "d2-input";
const CLASS_LABEL = "d2-label";
const CLASS_BUTTON_CONTAINER = "d2-btn-container";
const CLASS_BUTTON = "d2-btn";
const CLASS_BUTTON_ACTIVE = "d2-btn--active";
const CLASS_COUNT_AREA = "d2-count-area";
class ElementControl {
  /**
   * コンストラクタ
   * @param opt
   */
  constructor(opt) {
    __publicField(this, "elementContainer");
    __publicField(this, "foreverButton", null);
    __publicField(this, "cancelButton", null);
    __publicField(this, "waitSecInput", null);
    __publicField(this, "waitRandomInput", null);
    __publicField(this, "batchCountInput", null);
    __publicField(this, "counter", null);
    __publicField(this, "foreverFunc");
    __publicField(this, "cancelFunc");
    this.foreverFunc = opt.foreverFunc;
    this.cancelFunc = opt.cancelFunc;
    this.elementContainer = document.createElement("div");
    this.elementContainer.classList.add(CLASS_CONTAINER);
    this.$_createButtons();
    this.$_createInputs();
  }
  get waitSec() {
    var _a;
    const waitSec = parseInt(((_a = this.waitSecInput) == null ? void 0 : _a.value) || "0");
    return waitSec >= 1 ? waitSec : DEFAULT_WAIT_SEC;
  }
  get waitRandom() {
    var _a;
    const waitRandom = parseInt(((_a = this.waitRandomInput) == null ? void 0 : _a.value) || "0");
    return waitRandom >= 1 ? waitRandom : DEFAULT_WAIT_RANDOM;
  }
  get batchCount() {
    var _a;
    return parseInt(((_a = this.batchCountInput) == null ? void 0 : _a.value) || "0");
  }
  /**
   * カウンターに数値を入れる
   * @param num
   */
  setCounter(num) {
    if (!this.counter)
      return;
    this.counter.textContent = String(num);
  }
  /**
   * 通常状態にする
   */
  setStateNormal() {
    if (!this.foreverButton || !this.cancelButton)
      return;
    this.foreverButton.classList.remove(CLASS_BUTTON_ACTIVE);
    this.cancelButton.classList.remove(CLASS_BUTTON_ACTIVE);
  }
  /**
   * 無限生成状態にする
   */
  setStateActive() {
    if (!this.foreverButton || !this.cancelButton)
      return;
    this.foreverButton.classList.add(CLASS_BUTTON_ACTIVE);
    this.cancelButton.classList.add(CLASS_BUTTON_ACTIVE);
  }
  /**
   * 指定エレメントにUIエレメントを挿入
   * @param parent
   */
  attachElements(parent) {
    parent.appendChild(this.elementContainer);
  }
  /**
   * 個別ボタン作成
   * @param text
   * @returns
   */
  $_createButtonElement(text) {
    const button = document.createElement("button");
    button.classList.add(CLASS_BUTTON);
    button.innerHTML = text;
    return button;
  }
  /**
   * 生成・キャンセルボタン作成
   */
  $_createButtons() {
    this.foreverButton = this.$_createButtonElement("Forever");
    this.foreverButton.addEventListener("click", () => {
      this.foreverFunc();
    });
    this.cancelButton = this.$_createButtonElement("Cancel");
    this.cancelButton.addEventListener("click", () => {
      this.cancelFunc();
    });
    this.counter = document.createElement("span");
    this.counter.classList.add(CLASS_COUNT_AREA);
    this.counter.textContent = "0";
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add(CLASS_BUTTON_CONTAINER);
    buttonsContainer.appendChild(this.foreverButton);
    buttonsContainer.appendChild(this.cancelButton);
    buttonsContainer.appendChild(this.counter);
    this.elementContainer.appendChild(buttonsContainer);
  }
  /**
   * 入力エリアとラベルのセットを作成
   * @returns
   */
  $_createInputElement(text, value) {
    const component = document.createElement("div");
    component.classList.add(CLASS_INPUT_COMPO);
    const label = document.createElement("span");
    label.classList.add(CLASS_LABEL);
    label.textContent = text;
    const input = document.createElement("input");
    input.setAttribute("type", "number");
    input.classList.add(CLASS_INPUT);
    input.value = value;
    component.appendChild(label);
    component.appendChild(input);
    return {
      component,
      input
    };
  }
  /**
   * 入力エリアを作成
   */
  $_createInputs() {
    const batchCountComponent = this.$_createInputElement("Batch count (0 = ∞)", "0");
    this.batchCountInput = batchCountComponent.input;
    const waitSecComponent = this.$_createInputElement("Wait sec", String(DEFAULT_WAIT_SEC));
    this.waitSecInput = waitSecComponent.input;
    const waitRandomComponent = this.$_createInputElement("Wait random", String(DEFAULT_WAIT_RANDOM));
    this.waitRandomInput = waitRandomComponent.input;
    const inputContainer = document.createElement("div");
    inputContainer.classList.add(CLASS_INPUT_CONTAINER);
    inputContainer.appendChild(batchCountComponent.component);
    inputContainer.appendChild(waitSecComponent.component);
    inputContainer.appendChild(waitRandomComponent.component);
    this.elementContainer.appendChild(inputContainer);
  }
}
const BUTTON_TEXT_GENERATE_EN = "Generate";
const BUTTON_TEXT_GENERATE_JA = "生成";
class NaiGenerateForever {
  constructor() {
    // 標準の生成ボタン
    __publicField(this, "generateButton", null);
    // 生成回数カウンタ
    __publicField(this, "generateCount", 0);
    // 追加で作成するエレメントのコントローラー
    __publicField(this, "elmCtrl");
    // プロンプト変換コントローラー
    // promptCtrl: PromptControl;
    // ステータス
    __publicField(this, "state", "stop");
    this.elmCtrl = new ElementControl({
      foreverFunc: () => {
        this.generateForever();
      },
      cancelFunc: () => {
        this.cancelForever();
      }
    });
    this.resetElements();
    setInterval(() => {
      this.resetElements();
    }, 3e3);
  }
  /**
   * 生成ボタンを取得
   */
  getGenerateButton() {
    const buttons = [...document.querySelectorAll("button")];
    for (const button of buttons) {
      const buttonText = button.textContent;
      if ((buttonText == null ? void 0 : buttonText.includes(BUTTON_TEXT_GENERATE_EN)) || (buttonText == null ? void 0 : buttonText.includes(BUTTON_TEXT_GENERATE_JA))) {
        return button;
      }
    }
    return void 0;
  }
  /**
   * 生成ボタンを変数に格納する
   * ボタンが画面から消えていたら配置もする
   */
  resetElements() {
    this.generateButton = this.getGenerateButton();
    if (!this.generateButton)
      return;
    const parent = this.generateButton.parentNode;
    if (!parent.contains(this.elmCtrl.foreverButton)) {
      this.elmCtrl.attachElements(parent);
    }
  }
  /**
   * 無限生成を停止
   */
  cancelForever() {
    this.state = "stop";
    this.elmCtrl.setStateNormal();
  }
  /**
   * 無限生成を開始
   */
  generateForever() {
    this.generateCount = 0;
    this.elmCtrl.setCounter(0);
    this.elmCtrl.setStateActive();
    this.state = "forever";
    this.generateImage();
  }
  async generateImage() {
    if (this.state === "forever" && this.generateButton && !this.generateButton.disabled) {
      this.generateCount += 1;
      this.elmCtrl.setCounter(this.generateCount);
      await this.naildCard();
      this.generateButton.click();
    }
    if (this.elmCtrl.batchCount > 0 && this.generateCount >= this.elmCtrl.batchCount) {
      this.cancelForever();
    } else if (this.state === "forever") {
      const timing = (Math.random() * this.elmCtrl.waitRandom + this.elmCtrl.waitSec) * 1e3;
      setTimeout(() => {
        this.generateImage();
      }, timing);
    }
  }
  /**
   * Naildcardがインストールされていたら実行する
   */
  naildCard() {
    const diceBtn = document.getElementById("dice-button");
    if (!diceBtn)
      return;
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
// // 標準の生成ボタンのセレクタ
// static BTN_SELECTOR =
//     '#__next > div:nth-child(2) > div:nth-child(4) > div > div:nth-child(5) > button[data-confirm-added="true"]';
// 標準のプロンプトエリアのセレクタ
__publicField(NaiGenerateForever, "PROMPT_SELECTOR", "textarea[placeholder='プロンプトを入力し、理想の画像を生成しましょう']");
(function() {
  setTimeout(() => {
    new NaiGenerateForever();
  }, 3e3);
})();
//# sourceMappingURL=index.js.map
