import { LaBaG, modeList, ModeName } from "labag";
import { FrontendRecord } from "../types/records";

export class RecordChecker {
  private game: LaBaG;

  constructor(times: number) {
    this.game = new LaBaG(times);
    modeList.forEach((mode) => this.game.addMode(mode));
  }

  /**
   * 還原紀錄並計算分數
   * @param rounds 遊戲紀錄的輪次資料
   * @returns 計算後的最終分數
   */
  public calculateScore(rounds: FrontendRecord["rounds"]): number {
    // 重置遊戲狀態
    this.game.init();

    let roundIndex = 0;

    // 覆寫 rollSlots 方法以注入紀錄中的隨機數
    (this.game as any).rollSlots = () => {
      // 防止索引越界
      if (roundIndex >= rounds.length) return;

      const roundData = rounds[roundIndex];
      this.injectRoundData(roundData);

      // 觸發 rollSlots 事件
      (this.game as any).emit("rollSlots");
    };

    // 依序執行每一輪，確保不超過紀錄長度
    while (this.game.isRunning() && roundIndex < rounds.length) {
      this.game.play();
      roundIndex++;
    }

    return this.game.score;
  }

  /**
   * 注入單局數據並計算圖案
   */
  private injectRoundData(roundData: FrontendRecord["rounds"][0]) {
    const { randNums } = roundData;

    // 1. 設定主要的三個隨機數
    this.game.randNums = [randNums["0"], randNums["1"], randNums["2"]];

    // 2. 還原模式變數 (排除主要隨機數)
    Object.entries(randNums).forEach(([key, value]) => {
      if (["0", "1", "2"].includes(key)) return;

      const mode = this.game.getMode(key as ModeName);
      if (mode) {
        mode.variable.randNum = value;
      }
    });

    // 3. 計算圖案 (複製 LaBaG 的內部邏輯)
    const { ranges } = this.game.getCurrentConfig();
    this.game.randNums.forEach((num, index) => {
      const match = ranges.find((r) => num <= r.threshold);
      this.game.patterns[index] = match ? match.pattern : null;
    });
  }

  /**
   * 驗證紀錄的分數是否正確
   */
  public validate(record: FrontendRecord): boolean {
    try {
      if (!this.isValidRecord(record)) {
        return false;
      }

      const calculatedScore = this.calculateScore(record.rounds);
      return calculatedScore === record.score;
    } catch (error) {
      console.error("Record validation error:", error);
      return false;
    }
  }

  /**
   * 檢查紀錄格式是否基本有效
   */
  private isValidRecord(record: FrontendRecord): boolean {
    const { score, rounds } = record;
    return (
      typeof score === "number" &&
      !isNaN(score) &&
      Array.isArray(rounds) &&
      rounds.length > 0
    );
  }
}
