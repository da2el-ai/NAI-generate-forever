///////////////////////////////////////////
///////////////////////////////////////////
// ボタンのコントロール
///////////////////////////////////////////
///////////////////////////////////////////

// import { setStylesheet } from './css';

type TElementControlOption = {
  foreverFunc: () => void;
  cancelFunc: () => void;
};

type TInputComponent = {
  component: HTMLElement;
  input: HTMLInputElement;
};

////////////////////////
// 定数
const DEFAULT_WAIT_SEC = 3;
const DEFAULT_WAIT_RANDOM = 2;
const CLASS_CONTAINER = 'd2-container';
const CLASS_INPUT_CONTAINER = 'd2-input-container';
const CLASS_INPUT_COMPO = 'd2-input-compo';
const CLASS_INPUT = 'd2-input';
const CLASS_LABEL = 'd2-label';
const CLASS_BUTTON_CONTAINER = 'd2-btn-container';
const CLASS_BUTTON = 'd2-btn';
const CLASS_BUTTON_ACTIVE = 'd2-btn--active';
const CLASS_COUNT_AREA = 'd2-count-area';

////////////////////////
////////////////////////
class ElementControl {
  elementContainer: HTMLElement;
  foreverButton: HTMLElement | null = null;
  cancelButton: HTMLElement | null = null;
  waitSecInput: HTMLInputElement | null = null;
  waitRandomInput: HTMLInputElement | null = null;
  batchCountInput: HTMLInputElement | null = null;
  counter: HTMLElement | null = null;
  foreverFunc: () => void;
  cancelFunc: () => void;

  /**
   * コンストラクタ
   * @param opt
   */
  constructor(opt: TElementControlOption) {
    this.foreverFunc = opt.foreverFunc;
    this.cancelFunc = opt.cancelFunc;

    // setStylesheet();

    // 操作エレメントを格納するコンテナ
    this.elementContainer = document.createElement('div');
    this.elementContainer.classList.add(CLASS_CONTAINER);

    // ボタンを作成
    this.$_createButtons();
    this.$_createInputs();
  }

  get waitSec(): number {
    const waitSec = parseInt(this.waitSecInput?.value || '0');
    return waitSec >= 1 ? waitSec : DEFAULT_WAIT_SEC;
  }
  get waitRandom(): number {
    const waitRandom = parseInt(this.waitRandomInput?.value || '0');
    return waitRandom >= 1 ? waitRandom : DEFAULT_WAIT_RANDOM;
  }
  get batchCount(): number {
    return parseInt(this.batchCountInput?.value || '0');
  }

  /**
   * カウンターに数値を入れる
   * @param num
   */
  setCounter(num: number) {
    if (!this.counter) return;
    this.counter.textContent = String(num);
  }

  /**
   * 通常状態にする
   */
  setStateNormal() {
    if (!this.foreverButton || !this.cancelButton) return;

    this.foreverButton.classList.remove(CLASS_BUTTON_ACTIVE);
    this.cancelButton.classList.remove(CLASS_BUTTON_ACTIVE);
  }

  /**
   * 無限生成状態にする
   */
  setStateActive() {
    if (!this.foreverButton || !this.cancelButton) return;

    this.foreverButton.classList.add(CLASS_BUTTON_ACTIVE);
    this.cancelButton.classList.add(CLASS_BUTTON_ACTIVE);
  }

  /**
   * 指定エレメントにUIエレメントを挿入
   * @param parent
   */
  attachElements(parent: HTMLElement) {
    parent.appendChild(this.elementContainer);
  }

  /**
   * 個別ボタン作成
   * @param text
   * @returns
   */
  private $_createButtonElement(text: string) {
    const button = document.createElement('button');
    button.classList.add(CLASS_BUTTON);
    button.innerHTML = text;
    return button;
  }

  /**
   * 生成・キャンセルボタン作成
   */
  private $_createButtons() {
    this.foreverButton = this.$_createButtonElement('Forever');
    this.foreverButton.addEventListener('click', () => {
      this.foreverFunc();
    });

    this.cancelButton = this.$_createButtonElement('Cancel');
    this.cancelButton.addEventListener('click', () => {
      this.cancelFunc();
    });

    // 生成枚数カウンタ
    this.counter = document.createElement('span');
    this.counter.classList.add(CLASS_COUNT_AREA);
    this.counter.textContent = '0';

    const buttonsContainer = document.createElement('div');
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
  private $_createInputElement(text: string, value: string): TInputComponent {
    const component = document.createElement('div');
    component.classList.add(CLASS_INPUT_COMPO);

    const label = document.createElement('span');
    label.classList.add(CLASS_LABEL);
    label.textContent = text;

    // const inputContainer = document.createElement('div');

    const input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.classList.add(CLASS_INPUT);
    input.value = value;

    // inputContainer.appendChild(input);
    component.appendChild(label);
    // component.appendChild(inputContainer);
    component.appendChild(input);

    return {
      component,
      input,
    };
  }

  /**
   * 入力エリアを作成
   */
  private $_createInputs() {
    // 生成枚数
    const batchCountComponent = this.$_createInputElement('Batch count (0 = ∞)', '0');
    this.batchCountInput = batchCountComponent.input;

    // 待機時間の最小値
    const waitSecComponent = this.$_createInputElement('Wait sec', String(DEFAULT_WAIT_SEC));
    this.waitSecInput = waitSecComponent.input;

    // 待機時間の最大値
    const waitRandomComponent = this.$_createInputElement('Wait random', String(DEFAULT_WAIT_RANDOM));
    this.waitRandomInput = waitRandomComponent.input;

    // 入力エリアコンテナ
    const inputContainer = document.createElement('div');
    inputContainer.classList.add(CLASS_INPUT_CONTAINER);
    inputContainer.appendChild(batchCountComponent.component);
    inputContainer.appendChild(waitSecComponent.component);
    inputContainer.appendChild(waitRandomComponent.component);
    this.elementContainer.appendChild(inputContainer);
  }
}

export { ElementControl };
