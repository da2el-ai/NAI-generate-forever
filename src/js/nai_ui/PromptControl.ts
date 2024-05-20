type TPromptPart = {
  type: 'plain' | 'wildcard' | '';
  prompt: string;
  wildcard: string[];
};

class PromptControl {
  private $_originalPrompt: string = '';
  private $_promptList: TPromptPart[] = [];

  constructor() {}

  // オリジナルプロンプトの取り出し
  get originalPrompt(): string {
    return this.$_originalPrompt;
  }

  /**
   * オリジナルプロンプトの保存と、配列に変換
   */
  setOriginalPrompt(prompt: string) {
    this.$_originalPrompt = prompt;
    // console.log('setOriginal', prompt);
    this.$_convertPrompt(prompt);
  }

  /**
   * 生成用プロンプトを取得
   */
  getRandomPrompt(): string {
    let output: string = '';

    this.$_promptList.forEach((part: TPromptPart) => {
      if (part.type === 'plain') {
        output += part.prompt;
      } else {
        const rand = Math.floor(Math.random() * part.wildcard?.length);
        output += part.wildcard[rand];
      }
    });

    return output;
  }

  /**
   * プロンプトを配列に変換
   */
  $_convertPrompt(prompt: string) {
    const regex = /<([^>]+)>|([^<]+)/g;
    let match: RegExpExecArray | null;
    this.$_promptList = [];

    while ((match = regex.exec(prompt)) !== null) {
      const part: TPromptPart = {
        type: '',
        prompt: '',
        wildcard: [],
      };
      const prompt: string = match[0].replace(/[<>]/g, '');

      if (prompt.includes('|')) {
        part.type = 'wildcard';
        part.wildcard = prompt.split('|');
      } else {
        part.type = 'plain';
        part.prompt = prompt;
      }
      this.$_promptList.push(part);
    }

    // console.log('promptList', this.$_promptList);
  }
}

export { PromptControl };
