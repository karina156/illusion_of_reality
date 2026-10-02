const intro = document.querySelector(".intro");

const circle = document.querySelector(".circle-image");
const title = document.querySelector(".intro__title");

const avatars = [
    document.querySelector(".avatar--1"),
    document.querySelector(".avatar--2"),
    document.querySelector(".avatar--3"),
    document.querySelector(".avatar--4"),
];

const whiteWash = document.querySelector(".white-wash");

const screenPanel = document.querySelector(".screen-panel");
const screenPanelTitle = document.querySelector(
    ".screen-panel__title"
);

const progressBar = document.querySelector(
    ".scroll-progress"
);

/* =========================
   UTILS
========================= */

function clamp(value, min = 0, max = 1) {
    return Math.min(
        Math.max(value, min),
        max
    );
}

function range(
    value,
    inputStart,
    inputEnd,
    outputStart = 0,
    outputEnd = 1
) {
    const progress = clamp(
        (value - inputStart) /
        (inputEnd - inputStart)
    );

    return (
        outputStart +
        (outputEnd - outputStart) * progress
    );
}

function smoothstep(t) {
    return t * t * (3 - 2 * t);
}

function smootherstep(t) {
    return (
        t *
        t *
        t *
        (t * (t * 6 - 15) + 10)
    );
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

/* =========================
   MAIN
========================= */

function updateIntro() {
    const rect =
        intro.getBoundingClientRect();

    const scrollDistance =
        intro.offsetHeight -
        window.innerHeight;

    const progress = clamp(
        -rect.top / scrollDistance
    );

    updateProgress(progress);
    updateCircle(progress);
    updateTitle(progress);
    updateAvatars(progress);
    updateFirstSceneFade(progress);
    updateSecondScreen(progress);
}

/* =========================
   PROGRESS
========================= */

function updateProgress(progress) {
    progressBar.style.width =
        `${progress * 100}%`;
}

/* =========================
   CIRCLE
========================= */

function updateCircle(progress) {
    /*
      появление маленькой точки
    */

    let appear = range(
        progress,
        0,
        0.07
    );

    appear = smoothstep(appear);

    /*
      рост картинки
    */

    let grow = range(
        progress,
        0.05,
        0.34
    );

    grow = smootherstep(grow);

    /*
      Рассчитываем масштаб так,
      чтобы изображение ушло
      далеко за viewport.
    */

    const diagonal = Math.hypot(
        window.innerWidth,
        window.innerHeight
    );

    const circleSize = 140;

    const finalScale =
        (diagonal / circleSize) * 1.45;

    const scale =
        0.05 +
        (finalScale - 0.05) * grow;

    circle.style.opacity = appear;

    circle.style.transform = `
    translate(-50%, -50%)
    scale(${scale})
  `;

    /*
      лёгкая белая дымка
    */

    let wash = range(
        progress,
        0.25,
        0.38
    );

    wash = smootherstep(wash);

    whiteWash.style.opacity =
        wash * 0.12;
}

/* =========================
   FIRST TITLE
========================= */

function updateTitle(progress) {
    let titleProgress = range(
        progress,
        0.27,
        0.43
    );

    titleProgress =
        smootherstep(titleProgress);

    const y =
        35 * (1 - titleProgress);

    const scale =
        0.96 +
        titleProgress * 0.04;

    const blur =
        7 * (1 - titleProgress);

    title.style.opacity =
        titleProgress;

    title.style.transform = `
    translate(-50%, -50%)
    translateY(${y}px)
    scale(${scale})
  `;

    title.style.filter =
        `blur(${blur}px)`;
}

/* =========================
   AVATARS
========================= */

function updateAvatars(progress) {
    const delays = [
        0.39,
        0.42,
        0.40,
        0.43,
    ];

    const values = delays.map(
        (delay) => {
            return smootherstep(
                range(
                    progress,
                    delay,
                    delay + 0.2
                )
            );
        }
    );

    const exit = smootherstep(
        range(
            progress,
            0.72,
            0.84
        )
    );

    const enterDistance =
        window.innerHeight * 0.34;

    /*
      верхние
    */

    const top1 =
        -enterDistance +
        enterDistance * 1.55 * values[0];

    const top2 =
        -enterDistance +
        enterDistance * 1.45 * values[1];

    /*
      нижние
    */

    const bottom1 =
        enterDistance -
        enterDistance * 1.55 * values[2];

    const bottom2 =
        enterDistance -
        enterDistance * 1.45 * values[3];

    /*
      уход в стороны
    */

    const left =
        -window.innerWidth *
        0.32 *
        exit;

    const right =
        window.innerWidth *
        0.32 *
        exit;

    avatars[0].style.opacity =
        values[0];

    avatars[1].style.opacity =
        values[1];

    avatars[2].style.opacity =
        values[2];

    avatars[3].style.opacity =
        values[3];

    avatars[0].style.transform = `
    translate(
      ${left}px,
      ${top1}px
    )
  `;

    avatars[1].style.transform = `
    translate(
      ${right}px,
      ${top2}px
    )
  `;

    avatars[2].style.transform = `
    translate(
      ${left}px,
      ${bottom1}px
    )
  `;

    avatars[3].style.transform = `
    translate(
      ${right}px,
      ${bottom2}px
    )
  `;
}

/* =========================
   FIRST SCENE FADE
========================= */

function updateFirstSceneFade(progress) {
    let fade = range(
        progress,
        0.80,
        0.88
    );

    fade = smootherstep(fade);

    const opacity =
        1 - fade;

    title.style.opacity *= opacity;

    avatars.forEach((avatar) => {
        avatar.style.opacity *= opacity;
    });
}

/* =========================
   SECOND SCREEN
========================= */

function updateSecondScreen(progress) {
    /*
      маленький блок появляется
      в центре и увеличивается
    */

    let panelProgress = range(
        progress,
        0.84,
        0.98
    );

    panelProgress =
        smootherstep(panelProgress);

    /*
      Исходный размер
      соответствует CSS.
    */

    const baseWidth =
        Math.min(
            360,
            window.innerWidth * 0.72
        );

    const baseHeight =
        Math.min(
            200,
            window.innerHeight * 0.28
        );

    /*
      Делаем так, чтобы блок
      перекрыл весь viewport.
    */

    const scaleX =
        window.innerWidth /
        baseWidth;

    const scaleY =
        window.innerHeight /
        baseHeight;

    const targetScale =
        Math.max(
            scaleX,
            scaleY
        ) * 1.08;

    const scale =
        0.05 +
        (targetScale - 0.05) *
        panelProgress;

    const radius =
        32 *
        (1 - panelProgress);

    screenPanel.style.opacity =
        panelProgress;

    screenPanel.style.transform = `
    translate(-50%, -50%)
    scale(${scale})
  `;

    screenPanel.style.borderRadius =
        `${radius}px`;

    /*
      Текст появляется немного позже,
      когда блок почти раскрылся.
    */

    let textProgress = range(
        progress,
        0.92,
        1
    );

    textProgress =
        smootherstep(textProgress);

    const textY =
        25 *
        (1 - textProgress);

    const blur =
        8 *
        (1 - textProgress);

    screenPanelTitle.style.opacity =
        textProgress;

    /*
      ВАЖНО.
  
      screen-panel масштабируется целиком,
      поэтому визуально текст тоже растёт.
  
      Компенсируем масштаб родителя,
      чтобы надпись сохраняла нормальный размер.
    */

    const safeScale =
        Math.max(scale, 0.05);

    const inverseScale =
        1 / safeScale;

    screenPanelTitle.style.transform = `
    translate(-50%, -50%)
    translateY(${textY}px)
    scale(${inverseScale})
  `;

    screenPanelTitle.style.filter =
        `blur(${blur}px)`;
}

/* =========================
   EVENTS
========================= */

window.addEventListener(
    "scroll",
    updateIntro,
    {
        passive: true,
    }
);

window.addEventListener(
    "resize",
    updateIntro
);

updateIntro(); function updateSecondScreen(progress) {
    /*
      Экран появляется из центра
      и разрастается до полного размера
    */
    let panelProgress = range(progress, 0.84, 0.98);
    panelProgress = smootherstep(panelProgress);

    const panelScale = 0.04 + (1 - 0.04) * panelProgress;

    screenPanel.style.opacity = panelProgress;
    screenPanel.style.transform = `
    translate(-50%, -50%)
    scale(${panelScale})
  `;

    /*
      Заголовок появляется чуть позже
    */
    let titleProgress = range(progress, 0.91, 1.0);
    titleProgress = smootherstep(titleProgress);

    const titleY = 24 * (1 - titleProgress);
    const titleBlur = 8 * (1 - titleProgress);

    screenPanelTitle.style.opacity = titleProgress;
    screenPanelTitle.style.transform = `
    translateY(${titleY}px)
  `;
    screenPanelTitle.style.filter = `blur(${titleBlur}px)`;

    /*
      Подзаголовок
    */
    const screenPanelSubtitle = document.querySelector(
        ".screen-panel__subtitle"
    );

    let subtitleProgress = range(progress, 0.94, 1.0);
    subtitleProgress = smootherstep(subtitleProgress);

    const subtitleY = 16 * (1 - subtitleProgress);
    const subtitleBlur = 6 * (1 - subtitleProgress);

    screenPanelSubtitle.style.opacity = subtitleProgress;
    screenPanelSubtitle.style.transform = `
    translateY(${subtitleY}px)
  `;
    screenPanelSubtitle.style.filter = `blur(${subtitleBlur}px)`;
}