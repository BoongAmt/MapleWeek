// task 토글

document.addEventListener("click", (e) => {

    if (e.target.classList.contains("delete-task-btn")) return;

    const task = e.target.closest(".task");
    if (!task) return;

    const section = task.closest("section");

    // 편집모드 숨김 설정
    if (section.classList.contains("edit-mode")) {

        // 커스텀 제외
        if (task.classList.contains("custom-task")) return;

        task.classList.toggle("hidden-task");

        const id = task.dataset.id;

        if (id) {
            localStorage.setItem(
                "hide_" + id,
                task.classList.contains("hidden-task")
            );
        }
        updateCategoryVisibility(section);
        return;
    }

    // 평소에는 체크
    task.classList.toggle("done");

    const id = task.dataset.id;

    if (id) {
        localStorage.setItem(id, task.classList.contains("done"));
    }
});


// 초기화 버튼

const resetButtons = document.querySelectorAll(".reset-btn");

resetButtons.forEach(button => {

    button.addEventListener("click", () => {
        const section = button.closest("section");
        const tasks = section.querySelectorAll(".task");

        tasks.forEach(task => {
            task.classList.remove("done");

            const id = task.dataset.id;
            localStorage.setItem(id, false);
        });
    });
});


// 수정 기능

const addButtons = document.querySelectorAll(".add-btn");

addButtons.forEach(button => {

    button.addEventListener("click", () => {

        const section = button.closest("section");
        const addArea = section.querySelector(".add-task-box");
        addArea.classList.toggle("hidden");

        if (!addArea.classList.contains("hidden")) {

            const input = addArea.querySelector(".task-input");

            input.value = "";
            randomPlaceholder(input);
            input.focus();
        }
    });
});

// 토글 기능

const showButtons = document.querySelectorAll(".show-btn");

showButtons.forEach(button => {

    button.addEventListener("click", () => {

        const section = button.closest("section");

        if (section.classList.contains("edit-mode")) {

            // 편집 종료
            section.classList.remove("edit-mode");
            updateCategoryVisibility(section);
        } else {

            // 편집 시작
            section.classList.add("edit-mode");

            // 편집 중에는 모든 제목/목록 보이기
            section.querySelectorAll("h3").forEach(h3 => {
                h3.style.display = "";
            });
            section.querySelectorAll("ul").forEach(ul => {
                ul.style.display = "";
            });
        }
    });
});

const confirmButtons = document.querySelectorAll(".confirm-add-btn");

confirmButtons.forEach(button => {

    button.addEventListener("click", () => {

        const section = button.closest("section");
        const input = section.querySelector(".task-input");
        const text = input.value.trim();

        if (text === "") return;

        const id = crypto.randomUUID();
        createCustomTask(section, text, id);

        const customTasks =
            JSON.parse(localStorage.getItem("customTasks")) || [];

        customTasks.push({
            id: id,
            section: section.id,
            text: text
        });

        localStorage.setItem(
            "customTasks",
            JSON.stringify(customTasks)
        );

        input.value = "";
        input.focus();

        section.querySelector(".add-task-box")
            .classList.add("hidden");
    });
});

const customTasks =
    JSON.parse(localStorage.getItem("customTasks")) || [];

customTasks.forEach(task => {

    const section = document.getElementById(task.section);
    if (!section) return;
    createCustomTask(section, task.text, task.id);
});


document.querySelectorAll(".task").forEach(task => {

    const id = task.dataset.id;

    if (!id) return;

    // 체크 상태
    if (localStorage.getItem(id) === "true") {
        task.classList.add("done");
    }

    // 숨김 상태
    if (localStorage.getItem("hide_" + id) === "true") {
        task.classList.add("hidden-task");
    }

});

document.querySelectorAll("section").forEach(section => {
    updateCategoryVisibility(section);
});

// 엔터키 추가
const taskInputs = document.querySelectorAll(".task-input");

taskInputs.forEach(input => {

    input.addEventListener("keydown", (e) => {

        if (e.key !== "Enter") return;

        e.preventDefault();

        const section = input.closest("section");
        const addButton = section.querySelector(".confirm-add-btn");

        addButton.click();
    });
});


// 일일 초기화
const now = new Date();
const lastDailyReset = localStorage.getItem("lastDailyReset");

const today =
    `${now.getFullYear()}-${
        String(now.getMonth() + 1).padStart(2, "0")
    }-${
        String(now.getDate()).padStart(2, "0")
    }`;

if (lastDailyReset !== today) {

    resetSection(document.getElementById("dailyList"));
    localStorage.setItem("lastDailyReset", today);
}

// 주간 초기화
const weeklyKey = getWeeklyKey();
const lastWeeklyReset = localStorage.getItem("lastWeeklyReset");

if (lastWeeklyReset !== weeklyKey) {

    resetSection(document.getElementById("weeklyList"));

    localStorage.setItem(
        "lastWeeklyReset",
        weeklyKey
    );
}
































































const placeholders = [
    "숙제를 사서 늘리려 하다니 이런 멍청한",
    "고생을 사서 만드는 스타일이신가 봐요",
    "왜 할 일을 만드는 거야?",
    "왜 그러지? 휘청거리고 있지 않나!",
    "리빙 포인트: 1+1은 3이다.",
    "추가할 숙제를 입력하지 마세요.",
    "야, 죽어.",
    "추가할 숙제 입력",
    "너 아직도 그 게임 하니?",
    "당신은 스케줄러의 저주를 받았습니다. 다음 보스에서 데카아웃을 하게 됩니다.",
    "그래서 칠흑 대체 언제 뜸?",
    "축하합니다! 당첨되셨습니다! 상품은 없습니다.",
    "아 맞다 우르스",
    "건의사항 있으면 말하면 추가해줌",
    "일간/주간 숙제는 일별/주별로 알아서 초기화됩니다.",
    "주간 숙제 초기화는 목요일입니다.",
    "에공삼 없는 스펙업은 모래 위에 성을 쌓는 것과 같습니다.",
    "방금 제가 당신의 운을 다 뺏었습니다. ㅅㄱ",
    "최고의 효도: 10억",
    "니 방에 모기 들어가게 해주세요",
    "인터넷 연결이 불안정합니다. 뻥입니다.",
    "엄청나게 큰 미꾸라지는? 미꾸엑스라지",
    "가장 가소로운 채소는? 오이오이~",
    "치킨을 10마리 더 먹으면? 치킨텐더",
    "푸른 소가 용을 구하면? 청소용구함",
    "부엉이가 수영을 하면? 첨부엉 첨부엉",
    "필터를 이용해 특정 숙제를 보이지 않게 할 수 있습니다.",
    "초기화를 누르면 해당 박스의 숙제가 모두 비완료 처리됩니다.",
    "이 사이트를 꺼도 숙제 현황은 변하지 않습니다.",
    "숙제를 눌러서 완료 상태를 전환할 수 있습니다.",
    "지금당장떠나면아무도다치지않는다그러지않으면너희는모두죽어탐정놀이도이젠끝이다오지말아야할곳에발을들였군현실로돌아가면잊지말고전해라스텔라론헌터가너희들의마지막을배웅했다는것을",
    "제가 찾던 숙제 추가 버튼 여기있네요",
    "추가할 숙제 입력 후 엔터키를 눌러도 숙제가 추가됩니다.",
    "교수님 과제가 너무 많습니다",
    "오",
    "흠",
    "특수코어 기간 무제한 기원",
    "리빙 포인트: 하츠네 미쿠는 버튜버가 아니다",
    "리빙 포인트: 카사네 테토는 보컬로이드가 아니다",
    "언더테일 아시는구나! 혹시 모르시는분들에 대해 설명해드립니다 샌즈랑 언더테일의 세가지 엔딩루트중 몰살엔딩의 최종보스로 진.짜.겁.나.어.렵.습.니.다",
    "와! 샌즈!",
    "섹스 남자 고추에 여자 엉덩이 쪽에 너어서 여자는 앙 이라고하고 남자는 개좋아함 섹스 여자가슴 ㅈㄴ큼",
    "미안하다 이거 보여주려고 어그로끌었다.. 메이플 스케줄러 ㄹㅇ 실화냐?",
    "나는 감정없는 싸이코라그런가 이런거보면 미동도안함. 오히려 웃음이나온달까?이정도는 껌이지ㅋ",
    "[Web발신]너는5세대를존중해야한다5세대는156종의포켓몬이추가되었고최초로2편이출시되었으며동시에1천만장이넘게판매되었다또한이상과진실이라는무겁고진중한스토리로변화하였으며N이라는최고인기캐릭",
    "국가공인확률주작777없는슬롯머신없뎃컨텐츠소모속도조절디자인표절자문단쌀먹도박불효살인넷카마햇살론장례식장인증아동학대스토킹페미자연발화퐁섭리1선족폰지사기뚱카롱마카롱",
    "진순캣맘락찔짬처리유급상폐철스퍼거팩트한접시상공75000m면지상에닿기도전에죽음그높이면영하60도가넘기때문에한번만숨쉬어도폐가얼어붙음게다가몸안의체액이순식간에끓어서기화함이극한의환경에노출되면2분도못버팀",
    "콤보사이클없이나오는높은딜링포텐셜정밀하게조정할필요없는강공격범위전투스킬과원소폭발로원천의방울을생성하고그걸흡수하면서스태미너소모없이강공격발사하고강공격동안이동및조준시야조절이자유",
    "『맙소사..』ㅡ내 사랑스러운 용사님이..메이플을 하겠다고ㅡ.『자신은 챙기지도 않는 모습이라니...!!』",
    "... 그래... 『이거면 된거야..』",
    "메이플스토리, 참 괜찮은 게임이네",
    "괘씸한 XX들, 서버 닫아",
    "봇이지 뭐~",
    "인장 주작은 뭐야 씨 발 년",
    "김창섭 네가 만든 Worlds",
    "과징금 크악 씨이빨 바로 리부트 정상화 OUT!!",
    "리부트 정상화 해줬잖아 본서버 완화도 해줬잖아 컨텐츠 출시도 해줬잖아 씨발 다! 그냥 다 해줬잖아",
    "개같은 섬망 색기... CUT",
    "해상도가 어디찌? 따라닷 땃 땃 따",
    "응, 알아.",
    "뭐? 이 악녀가!",
    "제발 맞 아줘 용~",
    "근데 이제 뭐함?",
    "자고로 신앙을 잃는 것은 죽음을 의미하는 것이며...!",
    "그게 바로... 나다!!",
    "세계수는 더 이상 없어. 내가 먹어치워버렸거든!",
    "데미안!!",
    "기분이 상쾌하군!",
    "하하! 여러분들은 이제 끝장입니다!",
    "최고의 아델 코디: 츄츄 아일랜드 세트",
    "리빙 포인트: 챌섭 렌은 거르자",
    "그래서 지vs이 누가 이김?",
    "실례가 안된다면 아이스크림 하나만 사주십시오",
    "외유내강(왜 유죄예요 내가 강간했어요?)",
    "7+4가 11인 이유는? 질싸하면 두줄이 뜨기 때문",
    "애국보수(애널에선 국물줄줄 보지에선 수둔폭발)",
    "보지가 딸꾹질을 하면? 질꺽질꺽",
    "마따끄…잠깐 갤질 좀 안한 사이에 념글이 아주 씹창이 났잖아?",
    "흐응...맨날 싸우는 나쁜 아이들에겐 [punishment♡] 를 내려야겠지?",
    "얼음여왕(Queen)의 매혹적인 향기 ♡ [seductive peroro]",
    "열심히 살아온 스피키가 이런 걸 봐도 되는 걸까요?",
    "하지만 이런 것을 봐버린 이상 스피키만 볼 수는 없어요!",
    "스피키 네르지 마세요!",
    "온화한 저도 화가 났어요",
    "우하하하 팡파레~!",
    "나는 무적이다. 나스닥은 신이고",
    "이걸 보니 문득 롤 초창기부터 지금까지 현역으로 달려온 페이커가 새삼 대단하다고 느껴지네…",
    "찬란한 흉성을 케이크처럼 쉽게 먹는 법",
    "어둠에다크에서 죽음의데스를 느끼며",
    "아 씨바, 할 말을 잊었습니다",
    "또 이러신다..밥이나 드세요",
    "이거 보고 강원기 뽑기로 했다",
    "난 경기도 안양의 이준영이다!",
    "하루만 기다리면 테섭이 나와요!",
    "메붕아 그게 무슨 소리니...",
    "한남소추 메붕이 아니노.",
    "메이플스토리를 알기 전까지는 에브리데이가 드림이었다 이기야.",
    "메붕씨는 메이플 해 봊나 요?",
    "아아, 그런 이유인가요. 잠시 착각해 보력 네요.",
    "메붕씨는 참 젠틀 한남 자 같아요.",
    "그러게요. 참 이상한 자들.......자들이네요.",
    "메붕아 메이플 재밌다면서. 날 속인거니?",
    "솔직히 야겜 안하는 애들이 사랑이 뭔지나 알겠냐?",
    "에...? 싫어... 그게... 우리 학교 닭장이랑 똑같은 냄새가 난단 말이야...",
    "상햇잔아...",
    "식객민웈ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ",
    "미... 미... 미친놈아, 니가 먼저 잘못했잖아!",
    "있잖아 메붕 그거해봐 그거",
    "나의 40단 컴보는 자비심이 없다. 40번의 필살 공격중 한번만 가격 돼도 넌 끝장이지.",
    "Absolute Cinema",
    "YOU JUST ACTIVATED MY TRAP CARD",
    "윌을 죽입시다 윌은 나의 원수",
    "기다려, 당황하지 마라! 이건 공명의 함정이다!",
    "나는 좋다고 생각해",
    "난 살아있다! 살아있다! 난 살아 있다구, 이 니기미 씨부랄것들아!",
    "바보야! 내가 칠흑을 못 먹었던 건 추진력을 얻기 위함이었다.",
    "내가 밥맛이라면 자네는 꿀맛이란 말인가?",
    "내가 이 사람을 화나게 만들었다 나는 감정을 지배할 수 있다!",
    "널 찾아낼 것이다. 찾아내서. 죽여버릴 것이다.",
    "네놈은 그냥 하루하루 똥 만드는 기계일 뿐이지!",
    "내 골반이 멈추지 않는 탓일까? ㅜ.ㅜ",
    "존나 병신같은 생각이넼ㅋㅋㅋㅋ 당장 하자",
    "두 뇌 광 회 전",
    "몹인지아랏내 ㅡㅡ",
    "p.s.점심시간이 끝나고 저에게는 무수히 많은 악수의 요청이...!!",
    "물 같은 걸 끼얹나...?",
    "물은 답을 알고 있다",
    "미친 얘기 같지만 전부 사실이예요.",
    "나는 나보다 약한 녀석의 명령 따위는 듣지 않는다",
    "그런 건 내게 있어 아무래도 상관 없어",
    "그런 널 낳은 부모는 누구지?",
    "사랑의 멋짐을 모르는 당신은 불쌍해요!",
    "뭐 그럼 이 승부는... 살아남은 나의 승리네♣",
    "하지만 여기까지예요. 나, 사슬낫의 제니가 상대니까",
    "순순히 금을 넘기면 유혈사태는 일어나지 않을 것입니다.",
    "슈슉 슈숙. 슉. 시. 시발럼아.",
    "씨바 아무도 나를 막을 순 없으셈 ㅋㅋ",
    "야메로! 이런 싸움은 모 야메룽다!",
    "아, 그래요?",
    "아니다 이 악마야",
    "아니, 나도 잡혔어",
    "안 돼 안 바꿔줘. 바꿀 생각 없어. 빨리 돌아가",
    "여러분의 관심사와 흥미를 빅데이터로 분석하여 가장 높은 흥미를 이끌어낼 만한 글을 도출했습니다.",
    "역시 인간은 재미있어!",
    "전 L입니다.",
    "우리나라가 네 수준으로 떨어진다면 이 세상은 끝이야!",
    "The cake is lie!",
    "메붕님의 그것은 큰가요? 후훗, 야망 말이예요.",
    "이때는 대략 정신이 멍해진다",
    "이 자식, 안 되겠어. 빨리 어떻게든 하지 않으면...",
    "인간이 5명이나 모이면 반드시 1명은 쓰레기가 있다",
    "안녕메붕아너를처음본순간부터좋아했어방학전에고백하고싶었는데바보같이그땐용기가없더라지금은이수많은사람들앞에서오로지너만사랑한다고말하고싶어서큰마음먹고용기내어봐",
    "이제 누가 공지해주냐",
    "인간의 욕심은 끝이 없고 같은 실수를 반복한다",
    "까마귀 배때지 칼빵",
    "잘 들어라, 애초에 기대를 하니까 배신을 당하는 거다.",
    "저 놈의 몸에 생기가 돌아온다!!",
    "저쪽 집이 무너졌다고 해서 구경하러 갔죠. 그런데 보고 오니 우리 집이 무너진 거예요. 보자마자 눈물이 났어요",
    "츄츄츄룻츄 키미노 세이다요 츄츄츄룻츄",
    "저자식한테 그 씹덕 하나 내줘!",
    "조용히 하세요!",
    "존나좋군?",
    "지금까지 이정도로 격렬한 분노를 느낀 적이 없었어",
    "좌절감이 사나이를 키우는 것이다!",
    "축제가 아니라 장례식입니다",
    "치료가 필요할 정도로 심각한 '메이플 중독증' 입니다",
    "칫, 결계인가..",
    "크큭... 선이 보인다...",
    "콩쥐야 ㅈ됐어",
    "틀렸어 이제 꿈이고 희망이고 없어",
    "'크아아아아' 드래곤중에서도 최강의 투명드래곤이 울부짓었다",
    "호라! 모 젠젠 멀쩡하자나?",
    "혼돈! 파괴! 망가!",
    "사고방식 자체가 우리와는 다릅니다",
    "모래반지 빵야빵야",
    "주인님, 얼른 자살을!",
    "여기가 스팟이다!",
    "네가 약한 것이 아니다. 너보다 조금 더 높은 곳에 내가 있을 뿐.",
    "쌟땛",
    "목숨만은 붙여주지. 생명은 가져간다!",
    "죽는 줄 알았다, 이새끼",
    "너무 강한 말은 쓰지 마... 약해 보인다구.",
    "내가 하늘에 서겠다.",
    "대체 언제부터― 경화수월을 쓰지 않았다고 착각한 거지?",
    "언성을, 그렇게 언성을 높이지 마라.",
    "신은, 죽었다. 내가, 죽였다.",
    "아무 일도! 없었다...!!",
    "나 너무 많은 일이 잇엇어 힘들다진짜",
    "...키사메 우린이제 죽었다...",
    "육문이면 떡을 치겠군",
    "우리가 왜 그 제안을 받아들여야 하지?",
    "발기가 풀리지 않을 정도...",
    "...사스케 이야기가 끝나지 않는다",
    "축하합니다! 이 문구를 보기 위해 약 0.52%의 확률을 뚫으셨습니다!"
    // 194개
];









function updateCustomSection(section) {

    const customSection = section.querySelector(".custom-task-section");
    const ul = section.querySelector(".custom-task-list");

    if (ul.children.length === 0) {
        customSection.classList.add("hidden");
    } else {
        customSection.classList.remove("hidden");

        const title = customSection.querySelector("h3");
        title.style.display = "";
        ul.style.display = "";
    }      
}



function createCustomTask(section, text, id) {

    const ul = section.querySelector(".custom-task-list");
    const li = document.createElement("li");

    li.className = "task custom-task";
    li.dataset.id = id;

    if (localStorage.getItem(id) === "true") {
        li.classList.add("done");
    }

    if (localStorage.getItem("hide_" + id) === "true") {
        li.classList.add("hidden-task");
    }

    li.innerHTML = `
        <span>${text}</span>
        <button class="delete-task-btn">✖</button>
    `;
    ul.appendChild(li);

    const deleteBtn = li.querySelector(".delete-task-btn");

    deleteBtn.addEventListener("click", (e) => {

        e.stopPropagation();
        li.remove();

        let customTasks =
            JSON.parse(localStorage.getItem("customTasks")) || [];

        customTasks = customTasks.filter(task => task.id !== id);

        localStorage.setItem(
            "customTasks",
            JSON.stringify(customTasks)
        );
        updateCustomSection(section);
    });

    updateCustomSection(section);
    return li;
}



function updateCategoryVisibility(section) {

    if (section.classList.contains("edit-mode")) return;
    const titles = section.querySelectorAll("h3");

    titles.forEach(title => {

        const ul = title.nextElementSibling;

        if (!ul) return;

        // 보이는 task만 찾기
        const visibleTasks = ul.querySelectorAll(".task:not(.hidden-task)");

        if (visibleTasks.length === 0) {

            title.style.display = "none";
            ul.style.display = "none";
        } else {

            title.style.display = "";
            ul.style.display = "";
        }
    });
}



function resetSection(section) {
    const tasks = section.querySelectorAll(".task");

    tasks.forEach(task => {
        task.classList.remove("done");

        const id = task.dataset.id;
        if (id) {
            localStorage.setItem(id, false);
        }
    });
}


function getWeeklyKey() {

    const now = new Date();

    // 월=0 ... 일=6
    const mondayBasedDay = (now.getDay() + 6) % 7;

    const daysSinceThursday = (mondayBasedDay + 4) % 7;

    const thursday = new Date(now);
    thursday.setDate(now.getDate() - daysSinceThursday);

    return `${thursday.getFullYear()}-${
        String(thursday.getMonth() + 1).padStart(2, "0")
    }-${
        String(thursday.getDate()).padStart(2, "0")
    }`;
}


let lastPlaceholder = -1;

function randomPlaceholder(taskInput) {

    let index;

    do {
        index = Math.floor(Math.random() * placeholders.length);
    } while (index === lastPlaceholder && placeholders.length > 1);

    lastPlaceholder = index;
    taskInput.placeholder = placeholders[index];
}