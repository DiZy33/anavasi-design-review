"use strict";

const $ = (id) => document.getElementById(id);
const surface = $("surface");
const assets = "../stage-3/assets/";
const t = (ru, en) => $("language").value === "en" ? en : ru;
const esc = (text) => String(text).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);
const icon = (path) => `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${path}"/></svg>`;
const icons = {
  book: icon("M3 5h7l2 2 2-2h7v14h-7l-2 2-2-2H3zM12 7v14"),
  search: icon("M15 15l6 6M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"),
  heart: icon("M12 20 4 12C-1 6 7 2 12 8c5-6 13-2 8 4z"),
  check: icon("m5 12 4 4 10-10"),
  sun: icon("M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"),
};
const states = {
  C01: ["Каталог", "Каталог курсов", "Отдельный вход из меню. Три предложения показывают цену и объём курса.", "64-17573"],
  C02: ["Каталог", "Описание и программа", "Карточка знакомит с темами и уроками. Просмотр программы оставляет дату старта пустой.", "64-17573"],
  C03: ["Каталог", "Подтверждение 0 ₽", "Подтвердите добавление или включите имитацию ошибки. Доступ появится после успешной записи.", "64-17573"],
  C04: ["Каталог", "Добавление", "Ожидание подтверждения записи. Повторное нажатие заблокировано.", "64-17573"],
  C05: ["Каталог", "Курс добавлен", "Переход в уроки. Дата первого старта остаётся пустой.", "75-1019"],
  C06: ["Каталог", "Уже добавлен", "Повторное открытие предложения, включая сохранённый доступ после обновления.", "75-1019"],
  C07: ["Каталог", "Ошибка и повтор", "Доступ ещё не выдан. Повтор использует то же предложение.", "64-17573"],
  L01: ["Библиотека", "Нет добавленных тем", "Пустая библиотека на чистой установке ведёт в каталог. Базовая библиотека и фильтры остаются в Figma.", "75-1019"],
  L02: ["Библиотека", "Фильтры и пустая выдача", "Поиск, категория, статус и избранное применяются вместе. Сброс снимает все ограничения.", "75-1089"],
  L03: ["Библиотека", "Избранное", "Проверьте пустое избранное, добавление и удаление сердца.", "75-1019"],
  L04: ["Библиотека", "Первый старт", "Только явное «Смотреть» или «Начать задание» фиксирует дату. Отмена возвращает к теме.", "64-17234"],
  D01: ["На каждый день", "Вопрос дня", "Выберите один из четырёх вариантов. Проверка использует дату показанного вопроса.", "64-17399"],
  D02: ["На каждый день", "Неверный ответ", "Короткая подсказка даёт ещё одну попытку.", "64-17399"],
  D03: ["На каждый день", "Верный ответ", "Объяснение и начисление один раз за день. Возврат показывает сохранённый результат.", "64-17399"],
  D04: ["На каждый день", "Термин дня", "Определение и пример разделены. Словарь доступен из того же окна.", "64-17399"],
  D05: ["На каждый день", "Словарь", "Поиск по термину и определению. Один и тот же набор в двух языках.", "64-17399"],
  R01: ["Прогресс", "Баллы и серия", "Баллы вынесены в отдельный блок. Серия и достигнутые уровни показаны независимо.", "64-17353"],
  R02: ["Прогресс", "Условие уровня", "Детали уровня поверх карты. Условие и статус показываются отдельно.", "64-17353"],
  R03: ["Прогресс", "Самопроверка задания", "Подтверждение доступно после записи непустого ответа. Редактирование сбрасывает текущий статус.", "64-17234"],
  S01: ["Настройки", "Язык интерфейса", "Примените русский или английский. Вымышленные примеры переключаются вместе с интерфейсом.", "64-20204"],
  S02: ["Настройки", "Размер текста", "Три пресета дополняют системный масштаб. Проверьте переносы при 200%.", "64-20204"],
  S03: ["Настройки", "Утренняя сводка", "По умолчанию выключена. Включите её, чтобы выбрать категории и время.", "64-20204"],
  S04: ["Настройки", "Нет разрешения", "Приложение объясняет, зачем нужны уведомления. Запрос разрешения оформляет Android.", "64-20204"],
  H01: ["Чат и возврат", "Цитата и сердце", "Один фрагмент сообщения даёт контекст для новых взаимодействий. Полный экран чата остаётся в Figma.", "75-1297"],
  H02: ["Чат и возврат", "Недоступные действия", "Сообщение честно объясняет локальный режим. Черновик остаётся в редакторе.", "75-1297"],
  B01: ["Чат и возврат", "Предпросмотр возврата", "Симуляция начатого жеста. Отмена сохраняет экран и черновик, завершение проверяет защиту выхода.", "75-1297"],
  B02: ["Чат и возврат", "Черновик и выход", "Останьтесь, повторите запись или явно отбросьте изменения. Возврат ведёт к источнику входа.", "75-1297"],
  B03: ["Чат и возврат", "Вход в каталог из меню", "Сопоставьте высоту заголовка и позицию символа с соседними экранами. Показан фрагмент нового пункта меню.", "64-17573"],
  G01: ["Вводный курс", "Практика добавления", "Гид ведёт в реальный поток каталога. Успешное добавление позволяет вернуться к шагу практики.", "64-17573"],
};

const courses = [
  ["Искусство Средневековья", "Medieval art", "Образ, храм и город", "Images, churches and cities", "lecture-cover.png"],
  ["Искусство Древней Греции", "Ancient Greek art", "Миф, театр и керамика", "Myth, theatre and ceramics", "lecture-side-left.png"],
  ["Язык музейной экспозиции", "Reading a museum display", "Предмет, этикетка и маршрут", "Objects, labels and routes", "lecture-side-right.png"],
];
const glossary = [
  ["Триптих", "Triptych", "Произведение из трёх частей, объединённых общей композицией.", "A work in three parts united by one composition."],
  ["Апсида", "Apse", "Выступ здания, часто полукруглый в плане.", "A projecting space, often semicircular in plan."],
  ["Аркада", "Arcade", "Ряд арок, опирающихся на колонны или столбы.", "A row of arches supported by columns or piers."],
  ["Атрибут", "Attribute", "Предмет, по которому узнают персонажа.", "An object used to identify a figure."],
  ["Базилика", "Basilica", "Продольное здание, разделённое на нефы.", "An elongated building divided into aisles."],
  ["Витраж", "Stained glass", "Композиция из цветного стекла.", "A composition made of coloured glass."],
  ["Диптих", "Diptych", "Произведение из двух связанных частей.", "A work made of two connected parts."],
  ["Мозаика", "Mosaic", "Изображение из небольших кусочков камня, стекла или керамики.", "An image made from small pieces of stone, glass or ceramic."],
  ["Неф", "Nave", "Продольное пространство внутри здания.", "A longitudinal space inside a building."],
  ["Портал", "Portal", "Архитектурно оформленный вход.", "An architecturally framed entrance."],
  ["Рельеф", "Relief", "Скульптурное изображение, выступающее над плоскостью.", "A sculpted image projecting from a surface."],
  ["Ротонда", "Rotunda", "Здание или зал круглого плана.", "A building or hall with a circular plan."],
  ["Фреска", "Fresco", "Живопись по сырой штукатурке.", "Painting on wet plaster."],
  ["Фриз", "Frieze", "Горизонтальная декоративная полоса.", "A horizontal decorative band."],
];
const fresh = () => ({
  course: 0, owned: new Set(), favorites: false, fail: false, fromGuide: false, started: false,
  answer: null, correct: false, earned: false, draft: "", quote: false, heart: false, unavailable: "",
  exitFail: false, returnTo: "chats", appScale: "1", digest: false, time: "09:00",
  categories: [true, true, true], homework: false, homeworkEarned: false, savedAnswer: true,
  query: "", filter: false, category: "", viewed: false, termQuery: "", level: "2",
});
let model = fresh();
let state = "C01";
let pending = null;
let pendingGeneration = 0;
const backTargets = {
  C01: "B03", C02: "C01", C03: "C02", C05: "C01", C06: "C01", C07: "C02",
  L01: "C01", L02: "C05", L03: "L02", L04: "L03", D02: "D01", D03: "D01",
  D05: "D04", R02: "R01", R03: "R01", S02: "S01", S03: "S01", S04: "S03",
  H02: "H01", B01: "H01", B02: "H01",
};
const heading = (title, back = true, menu = false) => `<header class="app-header">
  ${back ? `<button class="icon" data-action="back" aria-label="${t("Назад", "Back")}"><img src="${assets}figma_back.png" alt=""></button>` : "<span></span>"}
  <h2>${title}</h2>
  ${menu ? `<button class="icon" data-go="B03" aria-label="${t("Меню", "Menu")}"><img src="${assets}figma_home_menu.png" alt=""></button>` : "<span></span>"}
</header>`;
const button = (text, action, value = "", secondary = false, disabled = false) =>
  `<button type="button" class="${secondary ? "secondary" : "action"}" data-action="${action}" data-value="${value}" ${disabled ? "disabled" : ""}>${text}</button>`;
const goButton = (text, to, secondary = false) => button(text, "go", to, secondary);
const actions = (...items) => `<div class="actions">${items.join("")}</div>`;
const page = (title, body, options = {}) =>
  heading(title, options.back !== false, options.menu) + `<div class="app-scroll">${body}</div>`;
const modal = (title, content, origin) => heading(origin, false) +
  `<div class="origin" inert>${t("Открыто поверх текущего экрана", "Opened over the current screen")}</div>
  <div class="overlay"><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabindex="-1">
    <h3 id="dialog-title">${title}</h3>${content}</section></div>`;
const symbol = (type) => `<span class="symbol">${icons[type]}</span>`;
const empty = (type, title, copy, cta) => `<div class="card empty">${symbol(type)}<h3>${title}</h3><p class="muted">${copy}</p>${cta}</div>`;
const offerName = (i = model.course) => t(courses[i][0], courses[i][1]);
const lessonName = () => t("Образ и символ", "Image and symbol");
const price = () => t("0 ₽", "₽0");
const radio = (name, value, label, checked) => `<label class="option"><input type="radio" name="${name}" value="${value}" ${checked ? "checked" : ""}>${label}</label>`;
const chip = (text, action, value, pressed) => `<button class="chip" data-action="${action}" data-value="${value}" aria-pressed="${pressed}">${text}</button>`;
const origin = () => t("Профиль", "Profile");

function catalogue() {
  return page(t("Каталог курсов", "Course catalogue"),
    `<div class="hero"><img src="${assets}figma_home_maze.png" alt=""><h3>${t("Искусство и культура", "Art and culture")}</h3>
    <p>${t("Выберите демо-курс. После добавления его темы появятся в уроках.", "Choose a demo course. Add it to see its topics in Lessons.")}</p></div>
    ${courses.map((course, i) => `<article class="card offer"><div class="offer-header"><div><span class="tag">${t("Демо", "Demo")} · ${price()}</span>
      <h3>${offerName(i)}</h3></div><img src="${assets}${course[4]}" alt=""></div><p class="muted">${t(course[2], course[3])} · ${t("4 урока", "4 lessons")}</p>
      ${button(model.owned.has(i) ? t("Уже добавлен", "Already added") : t("О курсе", "View course"), "offer", i, true)}</article>`).join("")}`,
    { back: true });
}

function outline() {
  const course = courses[model.course];
  const topics = [
    [[t("Образ и символ", "Image and symbol"), t("Романский и готический храм", "Romanesque and Gothic churches")],
      [t("Город и искусство", "The city and its art"), t("Мастерская художника", "The artist’s workshop")]],
    [[t("Миф на сосуде", "Myth on a vessel"), t("Язык вазописи", "Reading vase painting")],
      [t("Античная сцена", "The ancient stage"), t("Музыка и театр", "Music and theatre")]],
    [[t("История предмета", "The story of an object"), t("Музейная этикетка", "The museum label")],
      [t("Как строят маршрут", "Building a route"), t("Диалог произведений", "Works in dialogue")]],
  ][model.course];
  return page(t("О курсе", "About this course"),
    `<div class="hero"><img src="${assets}${course[4]}" alt=""><span class="tag">${t("Демо", "Demo")} · ${price()}</span><h3>${offerName()}</h3><p>${t(course[2], course[3])}</p></div>
     <h3>${t("Программа", "Course outline")}</h3>
     ${topics.map((topic, i) => `<div class="card"><strong>${t("Тема", "Topic")} ${i + 1}</strong><ul class="list">${topic.map((lesson) => `<li>${lesson}</li>`).join("")}</ul></div>`).join("")}
     ${actions(goButton(t("Добавить за 0 ₽", "Add for ₽0"), "C03"))}`);
}

function acquisition() {
  const title = t("Добавить курс?", "Add course?");
  const context = t("О курсе", "About this course");
  const course = `<div class="card row">${symbol("book")}<div><strong>${offerName()}</strong><p class="muted">${t("2 темы · 4 урока", "2 topics · 4 lessons")}</p></div></div>`;
  if (state === "C03") return modal(title, course + `<p>${t("Курс сохранится на этом устройстве. Расписание появится после первого старта урока.", "This course will be added on this device. Its schedule starts with your first lesson.")}</p>
    <label class="option"><input id="simulate" type="checkbox" ${model.fail ? "checked" : ""}>${t("Имитировать ошибку записи", "Simulate a save failure")}</label>
    ${actions(button(t("Добавить за 0 ₽", "Add for ₽0"), "acquire"), goButton(t("Отмена", "Cancel"), "C02", true))}`, context);
  if (state === "C04") return modal(t("Добавляем курс", "Adding course"), course +
    `<p role="status">${t("Сохраняем доступ на устройстве…", "Saving access on this device…")}</p>
    ${actions(button(t("Подождите", "Please wait"), "none", "", false, true))}`, context);
  if (state === "C07") return modal(t("Не удалось добавить курс", "Could not add course"), course +
    `<p class="band error" role="alert">${t("Запись прервалась. Доступ пока не добавлен.", "Saving was interrupted. Access has not been added.")}</p>
    ${actions(button(t("Повторить", "Retry"), "acquire"), goButton(t("Назад к описанию", "Back to outline"), "C02", true))}`, context);
  return modal(state === "C05" ? t("Курс добавлен", "Course added") : t("Курс уже в уроках", "Course is already in Lessons"),
    course + `<p class="band success" role="status">${t("Темы доступны в разделе «Уроки».", "Topics are available in Lessons.")}</p>
    ${actions(goButton(t("Открыть уроки", "Open Lessons"), "L03"), model.fromGuide
      ? goButton(t("Вернуться к практике", "Return to practice"), "G01", true)
      : goButton(t("К каталогу", "Back to catalogue"), "C01", true))}`, context);
}

function library() {
  const title = t("Уроки", "Lessons");
  if (state === "L01") return page(title, empty("book", t("Темы появятся здесь", "Your topics will appear here"),
    t("Добавьте демо-курс из каталога, чтобы открыть его темы.", "Add a demo course from the catalogue to open its topics."),
    goButton(t("В каталог", "Open catalogue"), "C01", true)));
  if (state === "L04") return modal(t("Первый старт", "First start"),
    `<div class="card row">${symbol("book")}<div><strong>${lessonName()}</strong><p class="muted">${offerName()}</p></div></div>
    <p>${model.started ? t("Дата старта сохранена. Можно продолжить урок.", "Your start date is saved. You can continue the lesson.")
      : t("Начало просмотра или задания добавит уроки и сроки в ваш календарь.", "Starting a video or assignment adds lesson dates and deadlines to your calendar.")}</p>
    ${actions(button(t("Смотреть", "Watch"), "start"), button(t("Начать задание", "Start assignment"), "start", "assignment", true),
      goButton(t("Вернуться к теме", "Back to topic"), "L03", true))}`, title);
  return page(title, `<input id="topic-query" class="field" type="search" value="${esc(model.query)}" placeholder="${t("Найти тему", "Find a topic")}" aria-label="${t("Поиск по темам", "Search topics")}">
    <div class="chips">
      ${chip(t("Теория", "Theory"), "category", "theory", model.category === "theory")}
      ${chip(t("Практикум", "Practice"), "category", "practice", model.category === "practice")}
      ${chip(t("Просмотренные", "Viewed"), "viewed", "", model.viewed)}
      ${chip(t("Избранное", "Favourites"), "filter", "", model.filter)}
    </div><div id="topic-result">${topicResult()}</div>`, { menu: true });
}

function topicResult() {
  const title = t("Образ и символ", "Image and symbol");
  const found = (!model.filter || model.favorites) && !model.viewed && model.category !== "practice" &&
    title.toLocaleLowerCase().includes(model.query.trim().toLocaleLowerCase());
  if (state === "L02" && !found || state === "L03" && !found) {
    const favOnly = model.filter && !model.favorites && !model.viewed && !model.query;
    return empty(favOnly ? "heart" : "search",
      favOnly ? t("Пока нет избранного", "No favourites yet") : t("Темы не найдены", "No topics found"),
      favOnly ? t("Нажмите на сердце у темы, чтобы сохранить её здесь.", "Tap a topic’s heart to save it here.")
        : t("Измените запрос или снимите один из фильтров.", "Change the query or remove a filter."),
      button(t("Сбросить фильтры", "Clear filters"), "clear-filter", "", true));
  }
  return `<article class="card"><div class="row">${symbol("book")}<div><strong>${title}</strong><p class="muted">${t("Теория · 2 урока", "Theory · 2 lessons")}</p></div></div>
    <div class="chips">${chip(model.favorites ? t("♥ В избранном", "♥ Saved") : t("♡ В избранное", "♡ Save"), "favourite", "", model.favorites)}</div>
    ${actions(goButton(t("Открыть тему", "Open topic"), "L04", true))}</article>`;
}

const questionChoices = [
  ["Фриз", "Frieze"], ["Витраж", "Stained glass"], ["Рельеф", "Relief"], ["Мозаика", "Mosaic"],
];
function daily() {
  const title = t("Вопрос дня", "Daily question");
  const prompt = t("Как называют композицию из цветного стекла?", "What is a composition made from coloured glass called?");
  if (state === "D03") return page(title,
    `<div class="band success row">${symbol("check")}<div><strong>${t("Верно", "Correct")}</strong><p>${t("+5 баллов за сегодня", "+5 points for today")}</p></div></div>
    <div class="card"><h3>${t("Витраж", "Stained glass")}</h3><p>${t("Цветные фрагменты стекла складываются в изображение. В храмовых окнах его рисунок виден на просвет.", "Pieces of coloured glass form a picture. In church windows, daylight reveals the design.")}</p></div>
    <p class="muted">${t("Сегодняшний результат сохранён.", "Today’s result is saved.")}</p>
    ${actions(goButton(t("К термину дня", "Open term of the day"), "D04", true), goButton(t("К баллам", "View points"), "R01", true))}`);
  if (state === "D02") return page(title,
    `<div class="card"><h3>${t("Попробуйте ещё раз", "Try again")}</h3><p>${prompt}</p></div>
    <div class="band error" role="status"><strong>${t("Подсказка", "Hint")}</strong><p>${t("Подумайте о цветном окне, через которое проходит свет.", "Think of a coloured window that lets light through.")}</p></div>
    ${actions(button(t("Ещё попытка", "Try again"), "retry-question"))}`);
  return page(title, `<div class="band row">${symbol("sun")}<div><span class="tag">${t("5 ноября", "5 November")}</span><h3>${prompt}</h3></div></div>
    <div class="actions" aria-label="${t("Варианты ответа", "Answer choices")}">${questionChoices.map((pair, i) =>
      `<button class="choice" data-action="choice" data-value="${i}" aria-pressed="${model.answer === i}"><span>${"ABCD"[i]}</span>${t(...pair)}</button>`).join("")}</div>
    ${actions(button(t("Проверить ответ", "Check answer"), "check-question", "", false, model.answer === null))}`);
}

function term() {
  if (state === "D05") return page(t("Словарь", "Dictionary"),
    `<input id="term-query" class="field" type="search" value="${esc(model.termQuery)}" aria-label="${t("Поиск по словарю", "Search dictionary")}" placeholder="${t("Поиск по словарю", "Search dictionary")}">
    <div id="term-results">${termResults()}</div>`);
  return page(t("Термин дня", "Term of the day"),
    `<div class="hero"><img src="${assets}figma_profile_art.png" alt=""><span class="tag">${t("5 ноября", "5 November")}</span><h3>${t("Триптих", "Triptych")}</h3>
    <p>${t(glossary[0][2], glossary[0][3])}</p></div><div class="card"><strong>${t("Как узнать", "What to look for")}</strong>
    <p>${t("В алтарном триптихе центральную панель часто обрамляют две боковые створки.", "In an altarpiece, a central panel is often framed by two hinged wings.")}</p></div>
    ${actions(goButton(t("Открыть словарь", "Open dictionary"), "D05", true))}`);
}

function termResults() {
  const query = model.termQuery.trim().toLocaleLowerCase();
  const rows = glossary.filter(([ru, en, defRu, defEn]) =>
    `${t(ru, en)} ${t(defRu, defEn)}`.toLocaleLowerCase().includes(query));
  return rows.length ? `<ul class="list" aria-live="polite">${rows.map(([ru, en, defRu, defEn]) =>
    `<li><strong>${t(ru, en)}</strong><p class="muted">${t(defRu, defEn)}</p></li>`).join("")}</ul>`
    : `<p class="band" role="status">${t("Термин не найден. Попробуйте другой запрос.", "No matching terms. Try another search.")}</p>`;
}

const levels = [
  ["Вводный", "Introduction", "Завершите вводный курс.", "Complete the introductory guide."],
  ["Основы", "Foundations", "Завершите одну тему.", "Complete one topic."],
  ["Применение", "Application", "Подтвердите одно домашнее задание.", "Confirm one homework assignment."],
  ["Углубление", "Deeper study", "Завершите три разные темы.", "Complete three distinct topics."],
  ["Конструирование", "Construction", "Создайте личное событие.", "Create a personal event."],
  ["Практика", "Practice", "Ответьте верно на вопросы пяти разных дней.", "Answer correctly on five different dates."],
  ["Аттестация", "Assessment", "Завершите курс и все его задания.", "Complete one course and all its homework."],
  ["Финал", "Finale", "Завершите два курса со всеми заданиями.", "Complete two courses and all their homework."],
];
function progress() {
  const title = t("Ваш рейтинг", "Your progress");
  if (state === "R02") {
    const level = Number(model.level);
    const [ru, en, defRu, defEn] = levels[level - 1];
    return modal(`${level}. ${t(ru, en)}`,
      `<div class="band"><span class="tag">${level === 1 ? t("Получен", "Achieved") : level === 2 ? t("Текущая цель", "Current goal") : t("Следующий уровень", "Later milestone")}</span>
      <p>${t(defRu, defEn)}</p></div>
      ${actions(goButton(t("К рейтингу", "Back to progress"), "R01", true))}`, title);
  }
  if (state === "R03") return page(t("Задание", "Assignment"),
    `<div class="card"><h3>${t("Образ и символ", "Image and symbol")}</h3><p>${t("Объясните, как одна деталь меняет смысл изображения.", "Explain how one detail changes the meaning of the image.")}</p></div>
     <label class="hint" for="answer">${t("Мой ответ", "My answer")}</label>
     <textarea id="answer" class="field" rows="3">${esc(model.answerText ?? t("Ключ помогает узнать персонажа.", "The key helps identify the figure."))}</textarea>
     <div class="band ${model.homework ? "success" : ""}" role="status">${model.homework ? t("Задание отмечено выполненным", "Homework marked complete") : model.savedAnswer ? t("Ответ сохранён на устройстве", "Answer saved on this device") : t("Ответ нужно сохранить", "Save your answer first")}</div>
     ${actions(button(t("Сохранить ответ", "Save answer"), "save-answer", "", true), button(t("Подтвердить выполнение", "Confirm completion"), "homework", "", false, !model.savedAnswer || model.homework))}`);
  return page(title, `<div class="hero"><span class="tag">${t("Личный прогресс", "Personal progress")}</span><div class="score">${10 + (model.earned ? 5 : 0) + (model.homeworkEarned ? 20 : 0)}</div>
    <h3>${t("Баллы", "Points")}</h3><p>${t("За первые выполненные действия", "For first-time learning actions")}</p></div>
    <div class="card"><strong>${t("Серия занятий", "Study streak")}</strong><p class="muted">${t("3 дня подряд", "3 days in a row")}</p></div>
    <div class="card"><strong>${t("Уровни", "Milestones")}</strong><p class="muted">${t("1 из 8 · следующий — «Основы»", "1 of 8 · next: Foundations")}</p>
    <label class="option">${t("Уровень", "Milestone")} <select id="level" class="field">${levels.map(([ru, en], i) => `<option value="${i + 1}" ${model.level === String(i + 1) ? "selected" : ""}>${i + 1}. ${t(ru, en)}</option>`).join("")}</select></label>
    ${actions(goButton(t("Условие уровня", "View requirement"), "R02", true))}</div>`);
}

function settings() {
  const save = button(t("Применить", "Apply"), "apply-settings");
  const close = button(t("Закрыть", "Close"), "close-settings", "", true);
  if (state === "S01") return modal(t("Язык", "Language"),
    `<div class="band row"><img class="setting-icon" width="40" height="40" alt="" src="${assets}figma_profile_language.png"><p>${t("Язык интерфейса и демо-материалов.", "Language for the app and demo materials.")}</p></div>
    <fieldset class="card"><legend>${t("Язык приложения", "App language")}</legend>
    ${radio("app-language", "ru", "Русский", $("language").value === "ru")}${radio("app-language", "en", "English", $("language").value === "en")}</fieldset>${actions(save, close)}`, origin());
  if (state === "S02") return modal(t("Размер текста", "Text size"),
    `<div class="band row"><img class="setting-icon" width="40" height="40" alt="" src="${assets}figma_profile_text.png"><div><strong>${t("Образ и символ", "Image and symbol")}</strong><p>${t("Так выглядит текст урока.", "This is how lesson text looks.")}</p></div></div>
    <fieldset class="card"><legend>${t("Размер в приложении", "App text size")}</legend>
    ${radio("app-scale", "1", t("Как в системе", "System default"), model.appScale === "1")}
    ${radio("app-scale", "1.15", t("Крупный", "Large"), model.appScale === "1.15")}
    ${radio("app-scale", "1.3", t("Очень крупный", "Extra large"), model.appScale === "1.3")}</fieldset>${actions(save, close)}`, origin());
  if (state === "S04") return modal(t("Разрешите уведомления", "Allow notifications"),
    `<p>${t("Android пока не разрешает показать сводку. Выбранные время и категории сохранены.", "Android cannot show your digest yet. Your time and categories are saved.")}</p>
    ${actions(button(t("Открыть системные настройки", "Open system settings"), "system-settings"), goButton(t("Позже", "Later"), "S03", true))}`, origin());
  const categories = [t("Личные события", "Personal events"), t("Уроки и сроки", "Lessons and deadlines"), t("Олимпиады региона", "Regional olympiads")];
  return modal(t("Утренняя сводка", "Morning digest"),
    `<div class="band row"><img class="setting-icon" width="40" height="40" alt="" src="${assets}figma_profile_notifications.png"><p>${t("Одно уведомление о событиях на сегодня и ещё два дня.", "One notification for today and the next two days.")}</p></div>
    <label class="option"><input type="checkbox" id="digest" ${model.digest ? "checked" : ""}>${t("Включить сводку", "Enable digest")}</label>
    <fieldset class="card" ${model.digest ? "" : "disabled"}><legend>${t("Время и события", "Time and events")}</legend>
    <label class="option">${t("Время", "Time")} <input class="field" id="digest-time" type="time" required value="${model.time}"></label>
    ${categories.map((label, i) => `<label class="option"><input type="checkbox" data-category="${i}" ${model.categories[i] ? "checked" : ""}>${label}</label>`).join("")}</fieldset>
    ${actions(save, model.digest ? goButton(t("Проверить отказ Android", "Preview denied permission"), "S04", true) : close)}`, origin());
}

const sender = () => t("Мария · демо", "Maria · demo");
const message = () => t("Какую деталь на картине вы заметили первой?", "Which detail in the painting caught your eye first?");
function chat() {
  if (state === "B03") return page(t("Меню", "Menu"),
    `<div class="card row">${symbol("book")}<div><strong>${t("Каталог курсов", "Course catalogue")}</strong>
    <p class="muted">${t("Демо-курсы по искусству и культуре", "Demo courses in art and culture")}</p></div></div>
    ${actions(button(t("Открыть каталог", "Open catalogue"), "menu-catalogue"))}`);
  if (state === "H02") return modal(t("Действие недоступно", "Action unavailable"),
    `<div class="band"><p>${model.unavailable === "send" ? t("Сообщение остаётся локальным черновиком.", "Your message stays as a local draft.")
      : model.unavailable === "voice" ? t("Запись голосовых сообщений недоступна в демо-чате.", "Voice recording is unavailable in this demo chat.")
        : t("Файлы нельзя прикрепить в локальном демо-чате.", "Attachments are unavailable in this local demo chat.")}</p></div>
    ${actions(goButton(t("К черновику", "Back to draft"), "H01", true))}`, sender());
  if (state === "B01") return modal(t("Предпросмотр возврата", "Back preview"),
    `<div class="card gesture"><strong>${t("Предыдущий экран", "Previous screen")}</strong><p>${model.returnTo === "chats" ? t("Чаты", "Chats") : offerName()}</p></div>
    <p>${t("Черновик остаётся на месте до завершения жеста.", "The draft stays in place until the gesture completes.")}</p>
    ${actions(goButton(t("Отменить жест", "Cancel gesture"), "H01", true), button(t("Завершить возврат", "Complete Back"), "exit-chat"))}`, sender());
  if (state === "B02") return modal(t("Черновик ещё не сохранён", "Draft has not been saved"),
    `<p class="band error">${t("Останьтесь в чате или повторите запись перед выходом.", "Stay in the chat or retry saving before you leave.")}</p>
    ${actions(button(t("Повторить и выйти", "Retry and leave"), "retry-exit"), goButton(t("Остаться", "Stay"), "H01", true), button(t("Выйти без изменений", "Discard changes and leave"), "discard", "", true))}`, sender());
  return heading(sender()) + `<div class="app-scroll"><div class="message"><p>${message()}</p>
    <div class="chips"><button data-action="heart" aria-pressed="${model.heart}" aria-label="${t("Отметить сердцем", "React with a heart")}">${model.heart ? "♥ 1" : "♡"}</button>
    <button data-action="quote">${t("Ответить", "Quote")}</button></div></div></div>
    <div class="composer">${model.quote ? `<div class="quoted"><strong>${sender()}</strong><p>${message()}</p>${button(t("Убрать цитату", "Remove quote"), "quote", "", true)}</div>` : ""}
    <textarea id="draft" class="field" rows="2" placeholder="${t("Написать черновик", "Write a draft")}" aria-label="${t("Черновик", "Draft")}">${esc(model.draft)}</textarea>
    <p class="hint muted">${t("Локальный черновик", "Local draft")}</p>
    <div class="chips">${button(t("Файл", "File"), "unavailable", "file", true)}${button(t("Голос", "Voice"), "unavailable", "voice", true)}${button(t("Отправить", "Send"), "unavailable", "send", true)}</div>
    <div class="chips">${goButton(t("Жест назад", "Back gesture"), "B01", true)}${button(model.exitFail ? t("Сбой записи включён", "Save failure enabled") : t("Имитировать сбой", "Simulate save failure"), "fail-exit", "", true)}</div>
    <label class="option">${t("Вход из", "Entered from")} <select id="chat-origin" class="field">
      <option value="chats">${t("Чаты", "Chats")}</option><option value="course" ${model.returnTo === "course" ? "selected" : ""}>${t("Курс", "Course")}</option>
    </select></label></div>`;
}

function guide() {
  return page(t("Вводный курс", "Introductory guide"), `<div class="hero"><img src="${assets}figma_home_maze.png" alt=""><span class="tag">${t("Практика", "Practice")}</span>
    <h3>${t("Добавьте первый курс", "Add your first course")}</h3><p>${t("Откройте каталог, выберите демо-курс и подтвердите добавление за 0 ₽.", "Open the catalogue, choose a demo course and confirm adding it for ₽0.")}</p></div>
    ${model.owned.size ? `<p class="band success">${t("Курс появился в уроках. Вы вернулись к этому шагу.", "The course is in Lessons. You returned to this step.")}</p>` : ""}
    ${actions(button(t("Открыть каталог", "Open catalogue"), "guide-catalogue"))}`, { menu: true });
}

function render({ focus = false, preserveScroll = false } = {}) {
  const oldScroll = preserveScroll ? surface.querySelector(".app-scroll")?.scrollTop : 0;
  const [group, title, note, node] = states[state];
  document.title = `${title} · Anavasi, этап 4`;
  $("state-code").textContent = `${state} · ${group}`;
  $("state-title").textContent = title;
  $("state-note").textContent = note;
  $("reference").href = `https://www.figma.com/design/gO7czKDJEPs8z3aG2YPlAE?node-id=${node}`;
  $("device").lang = $("language").value;
  $("device").style.setProperty("--width", `${$("width").value}px`);
  const scale = Number($("zoom").value) * Number(model.appScale);
  $("device").style.setProperty("--scale", scale);
  $("device").toggleAttribute("data-large", scale >= 1.8);
  const views = {
    C01: catalogue, C02: outline, C03: acquisition, C04: acquisition, C05: acquisition, C06: acquisition, C07: acquisition,
    L01: library, L02: library, L03: library, L04: library,
    D01: daily, D02: daily, D03: daily, D04: term, D05: term,
    R01: progress, R02: progress, R03: progress, S01: settings, S02: settings, S03: settings, S04: settings,
    H01: chat, H02: chat, B01: chat, B02: chat, B03: chat, G01: guide,
  };
  surface.innerHTML = views[state]();
  const scroll = surface.querySelector(".app-scroll");
  if (scroll && oldScroll) scroll.scrollTop = oldScroll;
  document.querySelectorAll("#index a").forEach((link) => {
    if (link.hash === `#${state}`) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  if (focus) {
    const target = surface.querySelector(".sheet, .app-header h2");
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  }
}

function move(next, replace = false) {
  if (!Object.hasOwn(states, next)) return;
  state = next;
  if (location.hash !== `#${next}`) history[replace ? "replaceState" : "pushState"](null, "", `#${next}`);
  render({ focus: true });
}
function loadState() {
  state = Object.hasOwn(states, location.hash.slice(1)) ? location.hash.slice(1) : "C01";
  if (state === "L02") model.viewed = true;
  if (state === "L03") model.filter = true;
  if (state === "D03") model.correct = model.earned = true;
  render({ focus: location.hash.length > 1 });
}
function rerenderAction(action) {
  render({ preserveScroll: true });
  surface.querySelector(`[data-action="${action}"]`)?.focus({ preventScroll: true });
}

let lastGroup;
for (const [key, [group, title]] of Object.entries(states)) {
  if (group !== lastGroup) {
    const label = document.createElement("h2");
    label.textContent = group;
    $("index").append(label);
    lastGroup = group;
  }
  const link = document.createElement("a");
  link.href = `#${key}`;
  link.innerHTML = `<small>${key}</small><span>${title}</span>`;
  $("index").append(link);
}
window.addEventListener("popstate", loadState);
for (const control of ["language", "width", "zoom"]) $(control).addEventListener("change", () => render());
$("reset").addEventListener("click", () => {
  clearTimeout(pending);
  pendingGeneration += 1;
  model = fresh();
  for (const control of ["language", "width", "zoom"]) $(control).selectedIndex = 0;
  move("C01", true);
});

surface.addEventListener("input", ({ target }) => {
  if (target.id === "draft") model.draft = target.value;
  if (target.id === "answer") {
    model.answerText = target.value;
    model.savedAnswer = false;
    surface.querySelector('[data-action="homework"]').disabled = true;
    const status = surface.querySelector('[role="status"]');
    status.classList.remove("success");
    status.textContent = t("Ответ нужно сохранить", "Save your answer first");
  }
  if (target.id === "topic-query") {
    model.query = target.value;
    $("topic-result").innerHTML = topicResult();
  }
  if (target.id === "term-query") {
    model.termQuery = target.value;
    $("term-results").innerHTML = termResults();
  }
});
surface.addEventListener("change", ({ target }) => {
  if (target.id === "simulate") model.fail = target.checked;
  if (target.id === "digest") {
    model.digest = target.checked;
    render();
    $("digest").focus();
  }
  if (target.id === "digest-time" && target.value) model.time = target.value;
  if (target.dataset.category !== undefined) model.categories[Number(target.dataset.category)] = target.checked;
  if (target.id === "level") model.level = target.value;
  if (target.id === "chat-origin") model.returnTo = target.value;
});

const transitions = {
  go(next) {
    if (next === "L03" && /^C0[56]$/.test(state)) {
      model.filter = false;
      model.viewed = false;
      model.query = "";
    }
    if (next === "D01" && model.correct) next = "D03";
    move(next);
  },
  back() {
    if (state === "H01") return transitions["exit-chat"]();
    if (state === "G01" || state === "C04") return;
    if (state === "C01" && model.fromGuide) return move("G01");
    move(backTargets[state] ?? "C01");
  },
  offer(index) {
    model.course = Number(index);
    move(model.owned.has(model.course) ? "C06" : "C02");
  },
  acquire() {
    const generation = ++pendingGeneration;
    const course = model.course;
    const fail = model.fail;
    model.fail = false;
    move("C04");
    pending = setTimeout(() => {
      if (generation !== pendingGeneration) return;
      if (!fail) model.owned.add(course);
      if (state === "C04") move(fail ? "C07" : "C05", true);
    }, 850);
  },
  category(value) {
    model.category = model.category === value ? "" : value;
    rerenderAction("category");
  },
  viewed() { model.viewed = !model.viewed; rerenderAction("viewed"); },
  filter() { model.filter = !model.filter; rerenderAction("filter"); },
  favourite() { model.favorites = !model.favorites; rerenderAction("favourite"); },
  "clear-filter"() {
    model.query = model.category = "";
    model.viewed = model.filter = false;
    render();
    $("topic-query").focus();
  },
  start(target) {
    model.started = true;
    if (target === "assignment") move("R03");
    else render({ focus: true });
  },
  choice(value) {
    model.answer = Number(value);
    render();
    surface.querySelector(`[data-action="choice"][data-value="${value}"]`).focus();
  },
  "check-question"() {
    model.correct = model.answer === 1;
    model.earned ||= model.correct;
    move(model.correct ? "D03" : "D02");
  },
  "retry-question"() { model.answer = null; move("D01"); },
  "save-answer"() {
    const newAnswer = $("answer").value;
    if (newAnswer !== (model.committedAnswer ?? t("Ключ помогает узнать персонажа.", "The key helps identify the figure."))) model.homework = false;
    model.committedAnswer = newAnswer;
    model.savedAnswer = newAnswer.trim() !== "";
    rerenderAction("save-answer");
  },
  homework() {
    model.homework = model.homeworkEarned = true;
    render({ focus: true });
  },
  "apply-settings"() {
    const language = surface.querySelector('[name="app-language"]:checked');
    const scale = surface.querySelector('[name="app-scale"]:checked');
    if (language) $("language").value = language.value;
    if (scale) model.appScale = scale.value;
    if (state === "S03" && $("digest-time") && !$("digest-time").checkValidity() && model.digest) {
      $("digest-time").reportValidity();
      return;
    }
    render({ focus: true });
    const status = document.createElement("p");
    status.className = "band success";
    status.role = "status";
    status.textContent = t("Настройки применены.", "Settings applied.");
    surface.querySelector(".sheet").append(status);
    status.scrollIntoView({ block: "nearest" });
  },
  "close-settings"() {
    surface.innerHTML = page(origin(), `<div class="card"><h3>${t("Настройки", "Settings")}</h3>
      ${actions(goButton(t("Язык", "Language"), "S01", true), goButton(t("Размер текста", "Text size"), "S02", true), goButton(t("Утренняя сводка", "Morning digest"), "S03", true))}</div>`, { back: false });
    surface.querySelector("button").focus();
  },
  "system-settings"() {
    const text = document.createElement("p");
    text.className = "band";
    text.role = "status";
    text.textContent = t("Системное окно открывается на Android.", "The system screen opens on Android.");
    const sheet = surface.querySelector(".sheet");
    sheet.append(text);
    text.scrollIntoView({ block: "nearest" });
  },
  heart() { model.heart = !model.heart; rerenderAction("heart"); },
  quote() { model.quote = !model.quote; rerenderAction("quote"); },
  unavailable(action) { model.unavailable = action; move("H02"); },
  "fail-exit"() { model.exitFail = !model.exitFail; rerenderAction("fail-exit"); },
  "exit-chat"() {
    if (model.exitFail && (model.draft || model.quote) || state === "B02") return move("B02");
    transitions["retry-exit"]();
  },
  "retry-exit"() {
    model.exitFail = false;
    surface.innerHTML = page(model.returnTo === "chats" ? t("Чаты", "Chats") : offerName(), `<div class="band"><strong>${t("Возврат к источнику", "Returned to the origin")}</strong>
      <p>${t("Черновик хранится на устройстве.", "The draft is stored on this device.")}</p></div>
      ${actions(goButton(t("Открыть чат", "Open chat"), "H01", true))}`, { back: false });
    surface.querySelector("button").focus();
  },
  discard() { model.draft = ""; model.quote = false; transitions["retry-exit"](); },
  "guide-catalogue"() { model.fromGuide = true; move("C01"); },
  "menu-catalogue"() { model.fromGuide = false; move("C01"); },
};
surface.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (!target) return;
  if (target.dataset.go) return move(target.dataset.go);
  const action = target.dataset.action;
  if (Object.hasOwn(transitions, action)) transitions[action](target.dataset.value);
});
surface.addEventListener("keydown", (event) => {
  const sheet = surface.querySelector(".sheet");
  if (!sheet) return;
  if (event.key === "Escape" && state !== "C04") {
    event.preventDefault();
    if (/^S0[123]$/.test(state)) transitions["close-settings"]();
    else transitions.back();
  }
  if (event.key === "Tab") {
    const controls = [...sheet.querySelectorAll("button, input, select, textarea, a")].filter((node) => !node.matches(":disabled"));
    if (!controls.length) return event.preventDefault();
    const [first] = controls;
    const last = controls.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement === sheet)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});
loadState();
