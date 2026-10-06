// 使用陣列保存五道 p5.js 簡易指令選擇題。
const quizQuestions = [
  // 第一題：測試 setup() 的用途。
  {
    // 設定第一題的題目文字。
    question: "在 p5.js 中，哪一個函式通常只會在程式開始時執行一次？",
    // 設定第一題的四個選項。
    options: ["draw()", "setup()", "mousePressed()", "windowResized()"],
    // 設定第一題的正確選項索引，索引從零開始。
    answer: 1
  },
  // 第二題：測試 createCanvas() 的用途。
  {
    // 設定第二題的題目文字。
    question: "下列哪一個指令可以建立 p5.js 的畫布？",
    // 設定第二題的四個選項。
    options: ["createCanvas()", "makeScreen()", "newCanvas()", "canvasStart()"],
    // 設定第二題的正確選項索引。
    answer: 0
  },
  // 第三題：測試 draw() 的用途。
  {
    // 設定第三題的題目文字。
    question: "p5.js 中的 draw() 函式通常有什麼特性？",
    // 設定第三題的四個選項。
    options: ["只執行一次", "只處理鍵盤事件", "會持續重複執行", "只能設定畫布大小"],
    // 設定第三題的正確選項索引。
    answer: 2
  },
  // 第四題：測試 background() 的用途。
  {
    // 設定第四題的題目文字。
    question: "哪一個指令可以設定整個畫布的背景顏色？",
    // 設定第四題的四個選項。
    options: ["fill()", "stroke()", "background()", "colorMode()"],
    // 設定第四題的正確選項索引。
    answer: 2
  },
  // 第五題：測試 mousePressed() 的用途。
  {
    // 設定第五題的題目文字。
    question: "哪一個函式會在使用者按下滑鼠或點擊畫布時被呼叫？",
    // 設定第五題的四個選項。
    options: ["mousePressed()", "mouseDraw()", "clickCanvas()", "pressStart()"],
    // 設定第五題的正確選項索引。
    answer: 0
  }
];

// ------------------------------ 全域狀態變數 ------------------------------
// 保存目前正在顯示的題目索引。
let currentQuestionIndex = 0;
// 保存目前累積的答對題數。
let score = 0;
// 保存使用者在目前題目選擇的選項索引。
let selectedOptionIndex = -1;
// 紀錄目前題目是否已經作答。
let hasAnswered = false;
// 紀錄測驗是否已經完成五題。
let isQuizFinished = false;
// 保存畫布的圓角卡片與按鈕顯示顏色。
const colors = {
  // 設定整體頁面的深色背景。
  pageBackground: "#101820",
  // 設定卡片使用的深藍色。
  cardBackground: "#1b263b",
  // 設定一般選項使用的藍色。
  optionBackground: "#243b53",
  // 設定滑鼠移入選項時的顏色。
  optionHover: "#315a7d",
  // 設定主要按鈕的金黃色。
  buttonBackground: "#f4a261",
  // 設定按鈕文字的深色。
  buttonText: "#17202a",
  // 設定正確答案的綠色。
  correctBackground: "#2a9d8f",
  // 設定答錯選項必須使用的指定紅色。
  wrongBackground: "#9e2a2b",
  // 設定主要文字的淺色。
  primaryText: "#f8f9fa",
  // 設定次要文字的灰藍色。
  secondaryText: "#b8c6d9",
  // 設定進度條底色。
  progressTrack: "#34495e",
  // 設定進度條填色。
  progressFill: "#f4a261"
};

// ------------------------------ p5.js 生命週期函式 ------------------------------
// setup() 只會在程式開始時執行一次，用來建立全螢幕畫布與初始設定。
function setup() {
  // 將像素密度固定為 1，避免高密度手機造成不必要的繪圖負擔。
  pixelDensity(1);
  // 依照瀏覽器視窗目前寬高建立全螢幕畫布。
  createCanvas(windowWidth, windowHeight);
  // 移除網頁預設外距，避免畫布四周出現空白或捲軸。
  if (typeof document !== "undefined" && document.body) {
    // 將頁面外距設為零，讓畫布貼齊視窗。
    document.body.style.margin = "0";
    // 隱藏頁面捲軸，避免全螢幕畫布產生額外捲動。
    document.body.style.overflow = "hidden";
  }
  // 取得 p5.js 產生的畫布元素。
  const canvasElement = document.querySelector("canvas");
  // 確認畫布存在後套用適合觸控的 CSS。
  if (canvasElement) {
    // 讓畫布以區塊元素顯示，消除行內元素底部空白。
    canvasElement.style.display = "block";
    // 停用瀏覽器對畫布的捲動與縮放手勢。
    canvasElement.style.touchAction = "none";
  }
  // 使用常見的無襯線字型，讓繁體中文在不同裝置上較容易顯示。
  textFont("sans-serif");
  // 讓文字的水平對齊基準預設為左側。
  textAlign(LEFT, TOP);
  // 移除圖形外框，讓介面卡片看起來更乾淨。
  noStroke();
}

// draw() 會持續重複執行，用來繪製畫面與正確答案的上下動畫。
function draw() {
  // 每一幀先繪製整體背景，避免殘留前一幀畫面。
  background(colors.pageBackground);
  // 根據測驗狀態選擇繪製作答畫面或結果畫面。
  if (isQuizFinished) {
    // 五題完成後顯示測驗結果。
    drawResultScreen();
  } else {
    // 尚未完成時顯示題目、選項與互動按鈕。
    drawQuizScreen();
  }
}

// windowResized() 會在瀏覽器視窗尺寸改變時執行，讓畫布保持全螢幕。
function windowResized() {
  // 依照最新的 windowWidth 與 windowHeight 調整全螢幕畫布。
  resizeCanvas(windowWidth, windowHeight);
  // 裝置旋轉後重新固定像素密度，避免畫面比例異常。
  pixelDensity(1);
}

// mousePressed() 會在滑鼠按下或行動裝置觸控被 p5.js 轉換成滑鼠事件時執行。
function mousePressed() {
  // 把目前的指標座標交給統一的互動處理函式。
  handlePointerPressed(mouseX, mouseY);
  // 回傳 false，避免部分瀏覽器對畫布互動產生額外的預設行為。
  return false;
}


// touchStarted() 補充行動裝置的原生觸控處理，確保觸控區足夠且不被捲動攔截。
function touchStarted() {
  // 確認 p5.js 有提供觸控陣列且目前至少有一個觸控點。
  if (typeof touches !== "undefined" && touches.length > 0) {
    // 取得第一個觸控點的畫布座標。
    const firstTouch = touches[0];
    // 將觸控座標交給與滑鼠共用的互動流程。
    handlePointerPressed(firstTouch.x, firstTouch.y);
  }
  // 阻止瀏覽器把點擊解讀為捲動或縮放。
  return false;
}

// ------------------------------ 主要畫面繪製函式 ------------------------------
// drawQuizScreen() 負責繪製目前題目的完整作答畫面。
function drawQuizScreen() {
  // 取得會依視窗尺寸重新計算的版面資料。
  const layout = getLayout();
  // 取得目前題目的資料物件。
  const currentQuestion = quizQuestions[currentQuestionIndex];
  // 繪製畫面上方的標題與答題進度。
  drawHeader(layout);
  // 繪製題目內容卡片。
  drawQuestionCard(layout, currentQuestion);
  // 繪製四個可點擊的選項卡片。
  drawOptions(layout, currentQuestion);
  // 若已經作答，繪製答對或答錯的提示文字。
  drawFeedback(layout, currentQuestion);
  // 若已經作答，顯示前往下一題或查看結果的按鈕。
  if (hasAnswered) {
    // 繪製作答後才會出現的流程按鈕。
    drawNextButton(layout);
  }
}

// drawResultScreen() 負責繪製五題結束後的成績畫面。
function drawResultScreen() {
  // 取得依畫布尺寸計算的結果頁版面。
  const layout = getResultLayout();
  // 將文字設定為水平置中、垂直置頂。
  textAlign(CENTER, TOP);
  // 繪製結果標題。
  textSize(layout.titleSize);
  fill(colors.primaryText);
  text("測驗完成！", width / 2, layout.titleY);
  // 繪製答對題數。
  textSize(layout.scoreSize);
  fill(colors.buttonBackground);
  text(`${score} / ${quizQuestions.length}`, width / 2, layout.scoreY);
  // 逐行繪製鼓勵訊息，避免手機窄畫面超出左右邊界。
  textSize(layout.messageSize);
  fill(colors.secondaryText);
  for (let lineIndex = 0; lineIndex < layout.messageLines.length; lineIndex += 1) {
    // 計算目前訊息行的位置。
    const messageLineY = layout.messageY + lineIndex * layout.messageLineHeight;
    // 將目前訊息行置中繪製。
    text(layout.messageLines[lineIndex], width / 2, messageLineY);
  }
  // 繪製重新測驗按鈕。
  drawRestartButton(layout);
  // 恢復一般左上文字對齊，避免影響下一幀。
  textAlign(LEFT, TOP);
}

// ------------------------------ 版面配置函式 ------------------------------
// getLayout() 依照畫布大小計算作答頁面的所有位置與尺寸。
function getLayout() {
  // 取得目前題目，讓文字長度參與高度計算。
  const currentQuestion = quizQuestions[currentQuestionIndex];
  // 判斷目前是否為橫向畫面，供手機橫向模式調整欄數。
  const isLandscape = width >= height;
  // 依畫布寬高共同計算縮放比例，避免只看寬度造成短畫面溢出。
  let density = constrain(Math.min(width / 900, height / 720), 0.62, 1.12);
  // 橫向短畫面縮小間距，但不縮小到不利觸控的程度。
  if (isLandscape && height < 500) {
    // 限制短畫面的整體間距比例。
    density = Math.min(density, 0.8);
  }
  // 計算左右安全留白，避免文字或卡片貼近螢幕邊緣。
  const sidePadding = constrain(width * 0.055, 16, 72);
  // 計算主要內容寬度，並保留至少一個像素避免極窄畫面出錯。
  const contentWidth = Math.max(1, width - sidePadding * 2);
  // 寬螢幕使用雙欄；小螢幕使用單欄；矮橫屏也使用雙欄避免垂直溢出。
  const isSingleColumn = !(width >= 700 || (height < 520 && width >= 300 && width / Math.max(height, 1) > 0.7));
  // 設定選項欄數。
  const optionColumns = isSingleColumn ? 1 : 2;
  // 計算各區塊之間的間距。
  const sectionGap = constrain(Math.min(width, height) * 0.028 * density, 8, 24);
  // 依寬度和縮放比例計算標題大小。
  const titleSize = constrain(width * 0.045 * density, 19, 40);
  // 計算一般文字大小，保留手機可讀的最低尺寸。
  const bodySize = constrain(width * 0.026 * density, 13, 22);
  // 計算標題與進度列的位置。
  const titleY = Math.max(12, sidePadding * 0.35);
  const progressTextY = titleY + titleSize * 1.12 + sectionGap * 0.35;
  const progressY = progressTextY + bodySize * 0.9 + sectionGap * 0.45;
  // 設定進度條高度。
  const progressHeight = constrain(7 * density, 6, 10);
  // 計算題目卡片位置與內距。
  const questionY = progressY + progressHeight + sectionGap;
  const questionPadding = constrain(18 * density, 14, 24);
  const questionLineHeight = bodySize * 1.35;
  // 先設定題目字體，再依卡片寬度取得自動換行結果。
  textSize(bodySize);
  const questionLines = getWrappedLines(currentQuestion.question, Math.max(20, contentWidth - questionPadding * 2));
  // 題目卡片高度依行數自動增加，避免文字超出卡片。
  const questionHeight = Math.max(58, questionPadding * 2 + questionLines.length * questionLineHeight);
  // 計算選項區域與選項寬度。
  const optionsY = questionY + questionHeight + sectionGap;
  const optionGap = constrain(Math.min(width, height) * 0.024 * density, 7, 18);
  const optionWidth = Math.max(1, (contentWidth - optionGap * (optionColumns - 1)) / optionColumns);
  const optionTextSize = Math.max(12, bodySize * 0.92);
  const optionLineHeight = optionTextSize * 1.3;
  const optionPaddingX = constrain(18 * density, 14, 22);
  const optionPaddingY = constrain(13 * density, 10, 17);
  // 取得四個選項中需要最多行的高度，確保同列選項不會互相重疊。
  textSize(optionTextSize);
  let maxOptionLines = 1;
  for (let optionIndex = 0; optionIndex < currentQuestion.options.length; optionIndex += 1) {
    // 取得目前選項的文字標籤。
    const optionLabel = String.fromCharCode(65 + optionIndex);
    // 計算目前選項自動換行後的行數。
    const optionLines = getWrappedLines(`${optionLabel}. ${currentQuestion.options[optionIndex]}`, Math.max(20, optionWidth - optionPaddingX * 2));
    // 保存所有選項中的最大行數。
    maxOptionLines = Math.max(maxOptionLines, optionLines.length);
  }
  // 設定選項高度，最低 48 像素以維持足夠的觸控區。
  const optionHeight = Math.max(48, optionPaddingY * 2 + maxOptionLines * optionLineHeight);
  const optionRows = Math.ceil(currentQuestion.options.length / optionColumns);
  const optionsHeight = optionRows * optionHeight + Math.max(0, optionRows - 1) * optionGap;
  const optionsBottom = optionsY + optionsHeight;
  // 計算作答回饋文字的換行與高度。
  const feedbackText = getFeedbackText(currentQuestion);
  const feedbackTextSize = Math.max(12, bodySize * 0.82);
  const feedbackLineHeight = feedbackTextSize * 1.3;
  textSize(feedbackTextSize);
  const feedbackLines = getWrappedLines(feedbackText, Math.max(20, contentWidth));
  const feedbackHeight = hasAnswered ? feedbackLines.length * feedbackLineHeight : 0;
  const feedbackY = optionsBottom + (hasAnswered ? sectionGap * 0.75 : 0);
  // 設定按鈕寬度與高度，避免按鈕過小或超出窄螢幕。
  const buttonWidth = Math.min(Math.max(170, contentWidth * 0.48), contentWidth);
  const buttonHeight = Math.max(48, 54 * density);
  const buttonY = hasAnswered ? feedbackY + feedbackHeight + sectionGap * 0.8 : optionsBottom + sectionGap;
  // 回傳繪圖與互動共用的同一份版面資料。
  return { isLandscape, isSingleColumn, sidePadding, contentWidth, titleSize, bodySize, titleY, progressTextY, progressY, progressHeight, questionY, questionHeight, questionPadding, questionLineHeight, questionLines, optionColumns, optionGap, optionWidth, optionTextSize, optionLineHeight, optionPaddingX, optionHeight, optionsY, optionsHeight, optionsBottom, feedbackTextSize, feedbackLineHeight, feedbackLines, feedbackY, buttonWidth, buttonHeight, buttonY };
}

// getResultLayout() 依照畫布大小計算結果頁面的位置與尺寸。
function getResultLayout() {
  // 計算結果頁面的左右安全留白。
  const sidePadding = constrain(width * 0.08, 20, 80);
  // 計算結果文字可以使用的最大寬度。
  const contentWidth = Math.max(1, width - sidePadding * 2);
  // 依畫布短邊和高度計算結果頁縮放比例。
  const density = constrain(Math.min(width / 800, height / 650), 0.7, 1.1);
  // 計算結果標題、分數與鼓勵文字大小。
  const titleSize = constrain(48 * density, 27, 56);
  const scoreSize = constrain(92 * density, 58, 108);
  const messageSize = constrain(21 * density, 15, 25);
  // 依高度計算標題位置。
  const titleY = Math.max(20, height * 0.14);
  const scoreY = titleY + titleSize * 1.2 + 12;
  // 讓鼓勵訊息在窄螢幕自動換行。
  textSize(messageSize);
  const messageLines = getWrappedLines(getResultMessage(), contentWidth);
  const messageLineHeight = messageSize * 1.35;
  const messageY = scoreY + scoreSize * 1.05 + 16;
  // 設定重新測驗按鈕的寬度和足夠的觸控高度。
  const buttonWidth = Math.min(Math.max(180, width * 0.54), contentWidth);
  const buttonHeight = Math.max(48, 56 * density);
  const buttonY = messageY + messageLines.length * messageLineHeight + 24;
  // 回傳結果頁所有元件共用的版面資料。
  return { sidePadding, contentWidth, titleSize, scoreSize, messageSize, titleY, scoreY, messageLines, messageLineHeight, messageY, buttonWidth, buttonHeight, buttonY };
}

// ------------------------------ 題目畫面元件 ------------------------------
// drawHeader() 繪製測驗標題、題號與進度條。
function drawHeader(layout) {
  // 將文字對齊切換為左上對齊。
  textAlign(LEFT, TOP);
  // 設定標題文字大小。
  textSize(layout.titleSize);
  // 使用主要文字顏色繪製標題。
  fill(colors.primaryText);
  // 繪製測驗標題。
  text("p5.js 指令小測驗", layout.sidePadding, 28);
  // 設定進度文字的大小。
  textSize(layout.bodySize * 0.78);
  // 使用次要文字顏色繪製目前題號。
  fill(colors.secondaryText);
  // 顯示目前是第幾題以及總題數。
  text(`第 ${currentQuestionIndex + 1} 題／共 ${quizQuestions.length} 題`, layout.sidePadding, 92);
  // 計算進度條的寬度。
  const progressWidth = layout.contentWidth;
  // 設定進度條圓角。
  rectMode(CORNER);
  // 使用進度條底色繪製完整軌道。
  fill(colors.progressTrack);
  // 繪製進度條背景。
  rect(layout.sidePadding, 120, progressWidth, 8, 4);
  // 使用進度條填色繪製目前答題進度。
  fill(colors.progressFill);
  // 依照目前題號比例繪製進度。
  rect(layout.sidePadding, 120, progressWidth * ((currentQuestionIndex + 1) / quizQuestions.length), 8, 4);
}

// drawQuestionCard() 繪製題目卡片與可自動換行的題目文字。
function drawQuestionCard(layout, currentQuestion) {
  // 設定卡片使用左上角為基準的矩形模式。
  rectMode(CORNER);
  // 使用卡片背景色繪製題目卡片。
  fill(colors.cardBackground);
  // 繪製依文字行數動態調整高度的題目卡片。
  rect(layout.sidePadding, layout.questionY, layout.contentWidth, layout.questionHeight, 16);
  // 設定題目文字大小與顏色。
  textSize(layout.bodySize);
  fill(colors.primaryText);
  // 將已換行的題目逐行畫在卡片內。
  drawLines(layout.questionLines, layout.sidePadding + layout.questionPadding, layout.questionY + layout.questionPadding, layout.questionLineHeight, LEFT);
}

// drawOptions() 繪製四個選項，並處理選取、答錯與正確答案動畫。
function drawOptions(layout, currentQuestion) {
  // 取得四個選項各自的矩形範圍。
  const optionRects = getOptionRects(layout);
  // 逐一繪製所有選項。
  for (let optionIndex = 0; optionIndex < currentQuestion.options.length; optionIndex += 1) {
    // 取得目前選項矩形。
    const optionRect = optionRects[optionIndex];
    // 預設選項不做垂直位移。
    let verticalOffset = 0;
    // 答錯時讓正確選項持續上下跳動。
    if (hasAnswered && selectedOptionIndex !== currentQuestion.answer && optionIndex === currentQuestion.answer) {
      // 依照畫面間距限制動畫幅度，避免跳出相鄰卡片範圍。
      verticalOffset = sin(frameCount * 0.12) * Math.min(8, layout.optionGap * 0.65);
    }
    // 滑鼠移入判斷使用靜態矩形，觸控則由點擊處理函式判斷。
    const isHovered = isPointInsideRect(mouseX, mouseY, optionRect);
    // 設定選項預設背景色。
    let optionColor = colors.optionBackground;
    // 作答後將正確答案顯示為綠色。
    if (hasAnswered && optionIndex === currentQuestion.answer) {
      // 標示正確答案。
      optionColor = colors.correctBackground;
    }
    // 答錯時將選錯的選項改成指定的 #9e2a2b。
    if (hasAnswered && optionIndex === selectedOptionIndex && selectedOptionIndex !== currentQuestion.answer) {
      // 套用需求指定的深紅色。
      optionColor = colors.wrongBackground;
    }
    // 尚未作答且滑鼠停留時顯示互動提示色。
    if (!hasAnswered && isHovered) {
      // 套用滑鼠移入顏色。
      optionColor = colors.optionHover;
    }
    // 繪製選項背景卡片。
    fill(optionColor);
    rect(optionRect.x, optionRect.y + verticalOffset, optionRect.width, optionRect.height, 14);
    // 取得包含字母標籤的選項完整文字。
    const optionLabel = String.fromCharCode(65 + optionIndex);
    const optionText = `${optionLabel}. ${currentQuestion.options[optionIndex]}`;
    // 設定選項文字樣式。
    textSize(layout.optionTextSize);
    fill(colors.primaryText);
    // 依卡片可用寬度自動換行。
    const optionLines = getWrappedLines(optionText, optionRect.width - layout.optionPaddingX * 2);
    // 計算多行文字的垂直起點，使文字在卡片內置中。
    const textStartY = optionRect.y + (optionRect.height - optionLines.length * layout.optionLineHeight) / 2 + verticalOffset;
    // 繪製選項文字，避免超出卡片或與其他選項重疊。
    drawLines(optionLines, optionRect.x + layout.optionPaddingX, textStartY, layout.optionLineHeight, LEFT);
  }
}

// drawFeedback() 在使用者作答後顯示結果提示。
function drawFeedback(layout, currentQuestion) {
  // 尚未作答時不顯示回饋文字。
  if (!hasAnswered) {
    // 保留選項下方空間給下一次版面計算。
    return;
  }
  // 設定回饋文字樣式。
  textSize(layout.feedbackTextSize);
  textAlign(LEFT, TOP);
  // 根據答題結果選擇提示顏色。
  const isCorrect = selectedOptionIndex === currentQuestion.answer;
  fill(isCorrect ? colors.correctBackground : "#ffb4a2");
  // 將已換行的回饋文字繪製在選項下方。
  drawLines(layout.feedbackLines, layout.sidePadding, layout.feedbackY, layout.feedbackLineHeight, LEFT);
}

// drawNextButton() 繪製作答後的下一題或查看結果按鈕。
function drawNextButton(layout) {
  // 取得繪製與點擊共用的下一題按鈕矩形。
  const buttonRect = getNextButtonRect(layout);
  // 判斷滑鼠是否停留在按鈕上。
  const isHovered = isPointInsideRect(mouseX, mouseY, buttonRect);
  // 依滑鼠狀態選擇按鈕顏色。
  fill(isHovered ? "#ffd166" : colors.buttonBackground);
  // 繪製具有足夠觸控高度的按鈕。
  rect(buttonRect.x, buttonRect.y, buttonRect.width, buttonRect.height, 14);
  // 將按鈕文字置中。
  textAlign(CENTER, CENTER);
  textSize(Math.max(14, layout.bodySize));
  fill(colors.buttonText);
  // 最後一題顯示查看結果，其餘題目顯示下一題。
  const buttonText = currentQuestionIndex === quizQuestions.length - 1 ? "查看結果" : "下一題";
  text(buttonText, width / 2, buttonRect.y + buttonRect.height / 2);
  // 恢復一般文字對齊。
  textAlign(LEFT, TOP);
}

// drawRestartButton() 繪製結果畫面的重新測驗按鈕。
function drawRestartButton(layout) {
  // 取得繪製與點擊共用的重新測驗按鈕矩形。
  const buttonRect = getRestartButtonRect(layout);
  // 判斷滑鼠是否停留在重新測驗按鈕上。
  const isHovered = isPointInsideRect(mouseX, mouseY, buttonRect);
  // 依滑鼠狀態選擇按鈕顏色。
  fill(isHovered ? "#ffd166" : colors.buttonBackground);
  // 繪製重新測驗按鈕。
  rect(buttonRect.x, buttonRect.y, buttonRect.width, buttonRect.height, 14);
  // 將按鈕文字置中。
  textAlign(CENTER, CENTER);
  textSize(Math.max(14, layout.messageSize));
  fill(colors.buttonText);
  text("重新測驗", width / 2, buttonRect.y + buttonRect.height / 2);
  // 恢復一般文字對齊。
  textAlign(LEFT, TOP);
}

// ------------------------------ 互動與座標函式 ------------------------------
// getOptionRects() 依照目前版面產生四個選項的矩形座標。
function getOptionRects(layout) {
  // 建立空陣列保存所有選項的矩形。
  const optionRects = [];
  // 取得目前題目的選項數量。
  const optionCount = quizQuestions[currentQuestionIndex].options.length;
  // 逐一計算選項位置。
  for (let optionIndex = 0; optionIndex < optionCount; optionIndex += 1) {
    // 計算目前選項的列和欄。
    const row = floor(optionIndex / layout.optionColumns);
    const column = optionIndex % layout.optionColumns;
    // 依欄數、間距與安全留白計算矩形位置。
    const optionX = layout.sidePadding + column * (layout.optionWidth + layout.optionGap);
    const optionY = layout.optionsY + row * (layout.optionHeight + layout.optionGap);
    // 保存目前選項的點擊矩形。
    optionRects.push({ x: optionX, y: optionY, width: layout.optionWidth, height: layout.optionHeight });
  }
  // 回傳所有選項矩形。
  return optionRects;
}

// handlePointerPressed() 統一處理選項、下一題與重新測驗按鈕的點擊。
function handlePointerPressed(pointerX, pointerY) {
  // 如果測驗已結束，只檢查重新測驗按鈕。
  if (isQuizFinished) {
    // 取得結果頁面的版面資料。
    const layout = getResultLayout();
    // 建立重新測驗按鈕的矩形範圍。
    const restartRect = { x: width / 2 - layout.buttonWidth / 2, y: layout.buttonY, width: layout.buttonWidth, height: layout.buttonHeight };
    // 點擊重新測驗按鈕時，重設所有測驗狀態。
    if (isPointInsideRect(pointerX, pointerY, restartRect)) {
      // 執行重新開始測驗的函式。
      restartQuiz();
    }
    // 結束結果畫面的互動處理。
    return;
  }
  // 取得目前題目的版面資料。
  const layout = getLayout();
  // 取得目前題目的資料物件。
  const currentQuestion = quizQuestions[currentQuestionIndex];
  // 使用者尚未作答時，才允許點擊四個選項。
  if (!hasAnswered) {
    // 取得四個選項的矩形範圍。
    const optionRects = getOptionRects(layout);
    // 逐一檢查使用者點擊了哪個選項。
    for (let optionIndex = 0; optionIndex < optionRects.length; optionIndex += 1) {
      // 判斷指標是否點擊目前選項。
      if (isPointInsideRect(pointerX, pointerY, optionRects[optionIndex])) {
        // 保存使用者選取的選項索引。
        selectedOptionIndex = optionIndex;
        // 將題目設定為已作答狀態，鎖定選項避免重複作答。
        hasAnswered = true;
        // 若選到正確答案，將答對題數加一。
        if (selectedOptionIndex === currentQuestion.answer) {
          // 增加一分。
          score += 1;
        }
        // 點擊選項後結束迴圈，避免同一次點擊重複處理。
        break;
      }
    }
    // 尚未作答區段處理完成後直接結束函式。
    return;
  }
  // 建立下一題或查看結果按鈕的矩形範圍。
  const nextButtonRect = { x: width / 2 - layout.buttonWidth / 2, y: layout.buttonY, width: layout.buttonWidth, height: layout.buttonHeight };
  // 只有點擊按鈕時才進入下一題流程。
  if (isPointInsideRect(pointerX, pointerY, nextButtonRect)) {
    // 執行前往下一題或顯示結果的函式。
    goToNextQuestion();
  }
}

// isPointInsideRect() 判斷一個座標是否位於指定矩形內。
function isPointInsideRect(pointX, pointY, rectData) {
  // 檢查水平與垂直座標是否都位於矩形範圍中。
  return pointX >= rectData.x && pointX <= rectData.x + rectData.width && pointY >= rectData.y && pointY <= rectData.y + rectData.height;
}

// goToNextQuestion() 進入下一題，或在最後一題後顯示結果。
function goToNextQuestion() {
  // 判斷目前是否已經是最後一題。
  if (currentQuestionIndex >= quizQuestions.length - 1) {
    // 將測驗切換為完成狀態。
    isQuizFinished = true;
    // 結束函式，避免索引超出題目陣列範圍。
    return;
  }
  // 將目前題目索引往後移動一題。
  currentQuestionIndex += 1;
  // 清除上一題的選項選取狀態。
  selectedOptionIndex = -1;
  // 將作答狀態重設為尚未作答。
  hasAnswered = false;
}

// restartQuiz() 將所有測驗資料還原，讓使用者可以重新挑戰。
function restartQuiz() {
  // 將題目索引重設為第一題。
  currentQuestionIndex = 0;
  // 將答對題數歸零。
  score = 0;
  // 清除已選取的選項。
  selectedOptionIndex = -1;
  // 將作答狀態重設為尚未作答。
  hasAnswered = false;
  // 將測驗完成狀態關閉。
  isQuizFinished = false;
}


// getFeedbackText() 根據目前答題結果回傳回饋文字，供繪圖與版面共用。
function getFeedbackText(currentQuestion) {
  // 判斷使用者是否選到正確答案。
  const isCorrect = selectedOptionIndex === currentQuestion.answer;
  // 答錯時明確提示綠色上下跳動選項是正確答案。
  return isCorrect ? "答對了！" : "答錯了，綠色上下跳動選項是正確答案。";
}

// getResultMessage() 根據分數回傳適合的鼓勵訊息。
function getResultMessage() {
  // 滿分時顯示最積極的鼓勵文字。
  if (score === quizQuestions.length) {
    // 回傳滿分訊息。
    return "太棒了！你已經熟悉這些 p5.js 指令。";
  }
  // 分數達到一半以上時顯示持續練習的訊息。
  if (score >= Math.ceil(quizQuestions.length / 2)) {
    // 回傳中高分訊息。
    return "表現不錯！再複習一下就會更熟練。";
  }
  // 其他分數顯示鼓勵重新學習的訊息。
  return "別灰心！重新測驗一次，記住每個指令的用途吧。";
}

// drawWrappedText() 將過長文字依照指定寬度自動換行。
function drawWrappedText(content, startX, startY, maxWidth, lineHeight) {
  // 將文字切成單一字元，適合繁體中文沒有空白的句子。
  const characters = Array.from(content);
  // 建立目前正在組合的文字行。
  let currentLine = "";
  // 保存下一行的垂直位置。
  let currentY = startY;
  // 逐一處理每個文字字元。
  for (let characterIndex = 0; characterIndex < characters.length; characterIndex += 1) {
    // 取得目前正在處理的字元。
    const character = characters[characterIndex];
    // 暫時把新字元接到目前文字行後面。
    const testLine = currentLine + character;
    // 如果超過最大寬度，就先繪製上一行。
    if (textWidth(testLine) > maxWidth && currentLine.length > 0) {
      // 繪製已經完成的文字行。
      text(currentLine, startX, currentY);
      // 清空文字行並加入目前超出寬度的字元。
      currentLine = character;
      // 將下一行向下移動一個行高。
      currentY += lineHeight;
    } else {
      // 尚未超過寬度時，繼續累積文字。
      currentLine = testLine;
    }
  }
  // 繪製最後尚未輸出的文字行。
  if (currentLine.length > 0) {
    // 把最後一行文字繪製到畫布上。
    text(currentLine, startX, currentY);
  }
}


// getWrappedLines() 依照文字寬度將繁體中文切成多行，避免超出畫布。
function getWrappedLines(content, maxWidth) {
  // 將文字拆成單一字元，適合沒有空白分隔的中文句子。
  const characters = Array.from(content);
  // 建立保存換行結果的陣列。
  const lines = [];
  // 保存目前正在組合的文字行。
  let currentLine = "";
  // 逐字累積並測量文字寬度。
  for (let characterIndex = 0; characterIndex < characters.length; characterIndex += 1) {
    // 取得目前字元。
    const character = characters[characterIndex];
    // 暫時把字元加入目前文字行。
    const testLine = currentLine + character;
    // 超過寬度時先保存上一行，再從目前字元開始新行。
    if (textWidth(testLine) > maxWidth && currentLine.length > 0) {
      // 將已完成文字行放入陣列。
      lines.push(currentLine);
      // 開始新的文字行。
      currentLine = character;
    } else {
      // 尚未超過寬度時繼續累積。
      currentLine = testLine;
    }
  }
  // 保存最後一行文字。
  if (currentLine.length > 0) {
    // 將最後一行加入陣列。
    lines.push(currentLine);
  }
  // 空文字也至少回傳一行，避免版面高度計算錯誤。
  return lines.length > 0 ? lines : [""];
}

// drawLines() 將已經換行的文字逐行繪製到畫布。
function drawLines(lines, startX, startY, lineHeight, horizontalAlign) {
  // 設定水平對齊並維持上方垂直對齊。
  textAlign(horizontalAlign, TOP);
  // 逐行繪製文字。
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    // 計算目前文字行的垂直位置。
    const lineY = startY + lineIndex * lineHeight;
    // 繪製目前文字行。
    text(lines[lineIndex], startX, lineY);
  }
}