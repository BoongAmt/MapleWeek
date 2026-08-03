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



const songs = [
    {
        title: "ユメニマデ(꿈에서까지)",
        artist: "ゆんすけ(윤스케)"
    },
    {
        title: "ラブパラ(러브파라)",
        artist: "DECO*27"
    },
    {
        title: "妄想税(망상세)",
        artist: "DECO*27"
    },
    {
        title: "ゴーストルール(고스트 룰)",
        artist: "DECO*27"
    },
    {
        title: "妄想感傷代償連盟(망상감상대상연맹)",
        artist: "DECO*27"
    },
    {
        title: "ヒバナ(히바나)",
        artist: "DECO*27"
    },
    {
        title: "乙女解剖(소녀해부)",
        artist: "DECO*27"
    },
    {
        title: "アンドロイドガール(안드로이드 걸)",
        artist: "DECO*27"
    },
    {
        title: "ポジティブ・パレード(포지티브 퍼레이드)",
        artist: "DECO*27"
    },
    {
        title: "ヴァンパイア(뱀파이어)",
        artist: "DECO*27"
    },
    {
        title: "シンデレラ(신데렐라)",
        artist: "DECO*27"
    },
    {
        title: "ジレンマ(딜레마)",
        artist: "DECO*27"
    },
    {
        title: "ボルテッカー(볼트태클)",
        artist: "DECO*27"
    },
    {
        title: "モニタリング(모니터링)",
        artist: "DECO*27"
    },
    {
        title: "チェリーポップ(체리 팝)",
        artist: "DECO*27"
    },
    {
        title: "粛清マーチ(숙청 행진)",
        artist: "DECO*27"
    },  
    {
        title: "偽りの幕を引いて(거짓의 막을 내리고)",
        artist: "Kine Lune"
    },
    {
        title: "ニルポスト(Nilpost)",
        artist: "Kine Lune"
    },
    {
        title: "ポゼス(Posses)",
        artist: "Kine Lune"
    },
    {
        title: "MTMTM",
        artist: "TAK"
    },
    {
        title: "PPPP",
        artist: "TAK"
    },
    {
        title: "ミジ子の恋(미지코의 사랑)",
        artist: "iyowa"
    },
    {
        title: "水死体にもどらないで(익사체로 돌아가지 말아줘)",
        artist: "iyowa"
    },
    {
        title: "わたしは禁忌(나는 금기)",
        artist: "iyowa"
    },
    {
        title: "IMAWANOKIWA",
        artist: "iyowa"
    },
    {
        title: "黄金数(황금수)",
        artist: "iyowa"
    },
    {
        title: "1000年生きてる(1000년 살고 있어)",
        artist: "iyowa"
    },
    {
        title: "オーバー！(오버!)",
        artist: "iyowa"
    },
    {
        title: "あだぽしゃ(애디포시어)",
        artist: "iyowa"
    },
    {
        title: "うらぽしゃ(우라포시어)",
        artist: "iyowa"
    },
    {
        title: "きゅうくらりん(두근 어질)",
        artist: "iyowa"
    },
    {
        title: "パジャミィ(파자미)",
        artist: "iyowa"
    },
    {
        title: "異星にいこうね(다른 별에 가자)",
        artist: "iyowa"
    },
    {
        title: "AKUMA!",
        artist: "iyowa"
    },
    {
        title: "熱異常(열이상)",
        artist: "iyowa"
    },
    {
        title: "頬が乾くまで(뺨이 마를 때까지)",
        artist: "iyowa"
    },
    {
        title: "地球の裏(지구의 뒷면)",
        artist: "iyowa"
    },
    {
        title: "ももいろの鍵(복숭아색 열쇠)",
        artist: "iyowa"
    },
    {
        title: "散歩の邪魔(산책의 방해)",
        artist: "iyowa"
    },
    {
        title: "灰色の靴(잿빛 구두)",
        artist: "iyowa"
    },
    {
        title: "海辺の電話ボックス(해변의 전화박스)",
        artist: "MIMI"
    },
    {
        title: "水音とカーテン(물소리와 커튼)",
        artist: "MIMI"
    },
    {
        title: "マシュマリー(마슈마리)",
        artist: "MIMI"
    },
    {
        title: "何もない様な(아무것도 없는 듯한)",
        artist: "MIMI"
    },
    {
        title: "ルルージュ(르 루쥬)",
        artist: "MIMI"
    },
    {
        title: "いっせーのーで(하나 둘 셋에)",
        artist: "MIMI"
    },
    {
        title: "くうになる(텅 비어가)",
        artist: "MIMI"
    },
    {
        title: "風鈴歌(풍경가)",
        artist: "MIMI"
    },
    {
        title: "SorrowChat",
        artist: "MIMI"
    },
    {
        title: "モデラト(모데라토)",
        artist: "MIMI"
    },
    {
        title: "FLOAT",
        artist: "MIMI"
    },
    {
        title: "ヒミツ(비밀)",
        artist: "MIMI"
    },
    {
        title: "最愛人生ランナー(최애 인생 러너)",
        artist: "Kairiki bear"
    },
    {
        title: "イナイイナイ依存症(없어 없어 의존증)",
        artist: "Kairiki bear"
    },
    {
        title: "ヒトサマアレルギー(인간님 알레르기)",
        artist: "Kairiki bear"
    },
    {
        title: "セイデンキニンゲン(정전기 인간)",
        artist: "Kairiki bear"
    },
    {
        title: "失敗作少女(실패작 소녀)",
        artist: "Kairiki bear"
    },
    {
        title: "アルカリレットウセイ(알칼리 열등생)",
        artist: "Kairiki bear"
    },
    {
        title: "ココロナンセンス(마음 넌센스)",
        artist: "Kairiki bear"
    },
    {
        title: "レミングミング(레밍밍)",
        artist: "Kairiki bear"
    },
    {
        title: "バラバラココロ(흐트러진 마음)",
        artist: "Kairiki bear"
    },
    {
        title: "ベノム(베놈)",
        artist: "Kairiki bear"
    },
    {
        title: "アンヘル(앙헬)",
        artist: "Kairiki bear"
    },
    {
        title: "ルマ(루마)",
        artist: "Kairiki bear"
    },
    {
        title: "アイ情劣等生(애정 열등생)",
        artist: "Kairiki bear"
    },
    {
        title: "ダーリンダンス(달링 댄스)",
        artist: "Kairiki bear"
    },
    {
        title: "カーニバルハッピー(카니발 해피)",
        artist: "Kairiki bear"
    },
    {
        title: "ローラー(룰러)",
        artist: "Kairiki bear"
    },
    {
        title: "メロメロイド(헤롱헤롱로이드)",
        artist: "Kairiki bear"
    },
    {
        title: "バグ(버그)",
        artist: "Kairiki bear"
    },
    {
        title: "メンタルチェンソー(멘탈 체인소)",
        artist: "Kairiki bear"
    },
    {
        title: "マリオネ(마리오네)",
        artist: "Kairiki bear"
    },
    {
        title: "アンハッピーバースデイ(언해피 버스데이)",
        artist: "Kairiki bear"
    },
    {
        title: "マイナスレッテル(마이너스 꼬리표)",
        artist: "Kairiki bear"
    },
    {
        title: "マグメル(마그멜)",
        artist: "Kairiki bear"
    },
    {
        title: "ショコラティヱ(쇼콜라티에)",
        artist: "Lapix"
    },
    {
        title: "分かっちゃいないね(모르는구나)",
        artist: "monet"
    },
    {
        title: "アイスクリームマジック(아이스크림 매직)",
        artist: "雪乃イト(유키노 이토)"
    },
    {
        title: "空回りライブラリ(공회전 라이브러리)",
        artist: "雪乃イト(유키노 이토)"
    },
    {
        title: "ʚ ♡⃛ ɞ",
        artist: "yume."
    },
    {
        title: "怪電話(괴전화)",
        artist: "r-906"
    },
    {
        title: "匙ノ咒(숟가락의 저주)",
        artist: "r-906"
    },
    {
        title: "モノクロセンス(모노크롬 센스)",
        artist: "r-906"
    },
    {
        title: "三日月ステップ(초승달 스텝)",
        artist: "r-906"
    },
    {
        title: "ノウナイディスコ(뇌내 디스코)",
        artist: "r-906"
    },
    {
        title: "まにまに(뜻대로)",
        artist: "r-906"
    },
    {
        title: "スーパーノヴァ(슈퍼노바)",
        artist: "r-906"
    },
    {
        title: "プシ(프시)",
        artist: "r-906"
    },
    {
        title: "JUMPIN’ OVER !",
        artist: "r-906"
    },
    {
        title: "Catchy !?",
        artist: "r-906"
    },
    {
        title: "あなたしか見えないの(당신밖에 보이지 않아)",
        artist: "r-906"
    },
    {
        title: "パノプティコン(판옵티콘)",
        artist: "r-906"
    },
    {
        title: "Summering",
        artist: "じん(진)"
    },
    {
        title: "カゲロウデイズ(아지랑이 데이즈)",
        artist: "じん(진)"
    },
    {
        title: "チルドレンレコード(칠드런 레코드)",
        artist: "じん(진)"
    },
    {
        title: "夜咄ディセイブ(야화 디세이브)",
        artist: "じん(진)"
    },
    {
        title: "サマータイムレコード(서머타임 레코드)",
        artist: "じん(진)"
    },
    {
        title: "アディショナルメモリー(에디셔널 메모리)",
        artist: "じん(진)"
    },
    {
        title: "イマジナリーリロード(이매지너리 리로드)",
        artist: "じん(진)"
    },
    {
        title: "マイファニーウィークエンド(마이 퍼니 위켄드)",
        artist: "じん(진)"
    },
    {
        title: "新人類(신인류)",
        artist: "じん(진), marasy8, 堀江晶太(호리에 쇼타)"
    },
    {
        title: "SnowMix♪",
        artist: "marasy8"
    },
    {
        title: "CODE-87404104:RUINS",
        artist: "藤末樹(후지스에 미키)"
    },
    {
        title: "マーシャル・マキシマイザー(마셜 맥시마이저)",
        artist: "柊マグネタイト(히이라기 마그네타이트)"
    },
    {
        title: "終焉逃避行(종언도피행)",
        artist: "柊マグネタイト(히이라기 마그네타이트)"
    },
    {
        title: "アンプランド・アポトーシス(언플랜드 아포토시스)",
        artist: "柊マグネタイト(히이라기 마그네타이트)"
    },
    {
        title: "カノン(카논)",
        artist: "柊マグネタイト(히이라기 마그네타이트)"
    },
    {
        title: "再見ロマネスク(짜이찌엔 로마네스크)",
        artist: "柊マグネタイト(히이라기 마그네타이트)"
    },
    {
        title: "リアライズ(리얼라이즈)",
        artist: "柊マグネタイト(히이라기 마그네타이트)"
    },
    {
        title: "アンテナ39(안테나 39)",
        artist: "柊マグネタイト(히이라기 마그네타이트)"
    },
    {
        title: "リトライ(리트라이)",
        artist: "柊マグネタイト(히이라기 마그네타이트)"
    },
    {
        title: "ユニ(유니)",
        artist: "柊マグネタイト(히이라기 마그네타이트)"
    },
    {
        title: "撫でんな(쓰다듬지 마)",
        artist: "柊マグネタイト(히이라기 마그네타이트)"
    },
    {
        title: "ファブリック・フラワー(패브릭 플라워)",
        artist: "柊マグネタイト(히이라기 마그네타이트)"
    },
    {
        title: "TYQOON",
        artist: "Sohbana"
    },
    {
        title: "退廃的人生讃歌(퇴폐적 인생 찬가)",
        artist: "Ro2noki"
    },
    {
        title: "アマチュア音楽やめられねぇんだわ(아마추어 음악 그만둘 수 없어)",
        artist: "Ro2noki"
    },
    {
        title: "雁首、揃えてご機嫌よう(머리, 다 함께 평안하시길)",
        artist: "卯花ロク(우카 로쿠)"
    },
    {
        title: "オーダー、仰せのままに(오더, 분부대로)",
        artist: "卯花ロク(우카 로쿠)"
    },
    {
        title: "ロスト、シュタイナー(로스트, 슈타이너)",
        artist: "卯花ロク(우카 로쿠)"
    },
    {
        title: "ワーストリグレット(워스트 리그렛)",
        artist: "youまん(you맨)"
    },
    {
        title: "DUCTFOOD",
        artist: "yowanecity"
    },
    {
        title: "赤いカラスが鳴いたから(붉은 까마귀가 울었으니까)",
        artist: "NY channel"
    },
    {
        title: "ハウラー(하울러)",
        artist: "Fushi"
    },
    {
        title: "アルケヱ(아르케)",
        artist: "Fushi"
    },
    {
        title: "フロムナインス(프롬 나인스)",
        artist: "Fushi"
    },
    {
        title: "ヴァニティ(바니티)",
        artist: "Fushi"
    },
    {
        title: "エラードミー(에러드 미)",
        artist: "Fushi"
    },
    {
        title: "少女ケシゴム(소녀 지우개)",
        artist: "MARETU"
    },
    {
        title: "コインロッカーベイビー(코인 로커 베이비)",
        artist: "MARETU"
    },
    {
        title: "脳内革命ガール(뇌내혁명 걸)",
        artist: "MARETU"
    },
    {
        title: "パケットヒーロー(패킷 히어로)",
        artist: "MARETU"
    },
    {
        title: "スクラマイズ(스크러마이즈)",
        artist: "MARETU"
    },
    {
        title: "スヂ(줄거리)",
        artist: "MARETU"
    },
    {
        title: "マエガミスト(마에가미스트)",
        artist: "MARETU"
    },
    {
        title: "ホワイトハッピー(화이트 해피)",
        artist: "MARETU"
    },
    {
        title: "うみなおし(다시 낳기)",
        artist: "MARETU"
    },
    {
        title: "ダーリン(달링)",
        artist: "MARETU"
    },
    {
        title: "コウカツ(교활)",
        artist: "MARETU"
    },
    {
        title: "ゴキブリの味(바퀴벌레의 맛)",
        artist: "MARETU"
    },
    {
        title: "しう(시우)",
        artist: "MARETU"
    },
    {
        title: "ぴんく(핑크)",
        artist: "MARETU"
    },
    {
        title: "ニューダーリン(뉴 달링)",
        artist: "MARETU"
    },
    {
        title: "あいしていたのに(사랑하고 있었는데)",
        artist: "MARETU"
    },
    {
        title: "エンゼル92(엔젤92)",
        artist: "MARETU"
    },
    {
        title: "メルティランドナイトメア(멜티 랜드 나이트메어)",
        artist: "はるまきごはん(하루마키고한)"
    },
    {
        title: "フランケンX(프랑켄 X)",
        artist: "はるまきごはん(하루마키고한), 煮ル果実(니루 카지츠)"
    },
    {
        title: "ゼロトーキング(제로 토킹)",
        artist: "はるまきごはん(하루마키고한)"
    },
    {
        title: "エンパープル(엠퍼플)",
        artist: "はるまきごはん(하루마키고한)"
    },
    {
        title: "バッドエンドメーカー(베드 앤드 메이커)",
        artist: "香椎モイミ(카시이 모이미)"
    },
    {
        title: "キャットラビング(캣 러빙)",
        artist: "香椎モイミ(카시이 모이미)"
    },
    {
        title: "アタシ：アップデート(나:업데이트)",
        artist: "香椎モイミ(카시이 모이미)"
    },
    {
        title: "ベルコメン(벨코멘)",
        artist: "香椎モイミ(카시이 모이미)"
    },
    {
        title: "ロストアンブレラ(로스트 엄브렐라)",
        artist: "稲葉曇(이나바 쿠모리)"
    },
    {
        title: "ラグトレイン(래그 트레인)",
        artist: "稲葉曇(이나바 쿠모리)"
    },
    {
        title: "レイニーブーツ(레이니 부츠)",
        artist: "稲葉曇(이나바 쿠모리)"
    },
    {
        title: "ハローマリーナ(헬로 마리나)",
        artist: "稲葉曇(이나바 쿠모리)"
    },
    {
        title: "きみに回帰線(너에게로 회귀선)",
        artist: "稲葉曇(이나바 쿠모리)"
    },
    {
        title: "リレイアウター(릴레이아우터)",
        artist: "稲葉曇(이나바 쿠모리)"
    },
    {
        title: "電気予報(전기예보)",
        artist: "稲葉曇(이나바 쿠모리)"
    },
    {
        title: "絶体暗星(절체암성)",
        artist: "稲葉曇(이나바 쿠모리)"
    },
    {
        title: "ロールレスウエポン(롤리스 웨폰)",
        artist: "稲葉曇(이나바 쿠모리), Neru"
    },
    {
        title: "最凶勇者(최흉용자)",
        artist: "DIVELA"
    },
    {
        title: "METEOR",
        artist: "DIVELA"
    },
    {
        title: "すすめ！さいつよ堕天使(나아가! 최강의 타천사)",
        artist: "DIVELA"
    },
    {
        title: "救いようのない素晴らしき運命(구제불능의 멋진 운명)",
        artist: "DIVELA"
    },
    {
        title: "スーサイダーズ・ディストピア(수어사이더스 디스토피아)",
        artist: "DIVELA"
    },
    {
        title: "おどロボ(오도로보)",
        artist: "海茶(우미챠)"
    },
    {
        title: "チュルリラ・チュルリラ・ダッダッダ！(츄루리라·츄루리라·땃땃따!)",
        artist: "和田たけあき(와다 타케아키)"
    },
    {
        title: "キライ・キライ・ジガヒダイ！(싫어·싫어·자아비대!)",
        artist: "和田たけあき(와다 타케아키)"
    },
    {
        title: "チェチェ・チェック・ワンツー！(체체·체크·원투!)",
        artist: "和田たけあき(와다 타케아키)"
    },
    {
        title: "トラッシュ・アンド・トラッシュ！(트래시 앤드 트래시!)",
        artist: "和田たけあき(와다 타케아키)"
    },
    {
        title: "ビースト・ダンス(비스트 댄스)",
        artist: "和田たけあき(와다 타케아키)"
    },
    {
        title: "おどれ！VRダンス！(춤춰라! VR댄스!)",
        artist: "和田たけあき(와다 타케아키)"
    },
    {
        title: "ポジティブ・ハラスメント！！！(포지티브 해러스먼트!!!)",
        artist: "和田たけあき(와다 타케아키)"
    },
    {
        title: "うらめしヤッホー(원통해라 야호)",
        artist: "和田たけあき(와다 타케아키)"
    },
    {
        title: "ばらばらアダバナ(뿔뿔이 아다바나)",
        artist: "和田たけあき(와다 타케아키)"
    },
    {
        title: "共犯(공범)",
        artist: "てにをは(테니오하), 和田たけあき(와다 타케아키)"
    },
    {
        title: "ヴィラン(빌런)",
        artist: "てにをは(테니오하)"
    },
    {
        title: "一角獣(일각수)",
        artist: "てにをは(테니오하)"
    },
    {
        title: "デビル(데빌)",
        artist: "てにをは(테니오하)"
    },
    {
        title: "ザネリ(쟈넬리)",
        artist: "てにをは(테니오하)"
    },
    {
        title: "ライアーダンサー(라이어 댄서)",
        artist: "マサラダ(마사라다)"
    },
    {
        title: "ミィハー(미하)",
        artist: "Chinozo"
    },
    {
        title: "レナ(레나)",
        artist: "Chinozo"
    },
    {
        title: "グッバイ宣言(굿바이 선언)",
        artist: "Chinozo"
    },
    {
        title: "シェーマ(셰마)",
        artist: "Chinozo"
    },
    {
        title: "ジェラシス(제라시스)",
        artist: "Chinozo"
    },
    {
        title: "エリート(엘리트)",
        artist: "Chinozo"
    },
    {
        title: "ニュートンダンス(뉴턴 댄스)",
        artist: "ナユタン星人(나유탄 성인), Chinozo"
    },
    {
        title: "エイリアンエイリアン(에일리언 에일리언)",
        artist: "ナユタン星人(나유탄 성인)"
    },
    {
        title: "惑星ループ(행성 루프)",
        artist: "ナユタン星人(나유탄 성인)"
    },
    {
        title: "ダンスロボットダンス(댄스 로봇 댄스)",
        artist: "ナユタン星人(나유탄 성인)"
    },
    {
        title: "太陽系デスコ(태양계 디스코)",
        artist: "ナユタン星人(나유탄 성인)"
    },
    {
        title: "金星のダンス(금성의 댄스)",
        artist: "ナユタン星人(나유탄 성인)"
    },
    {
        title: "ひみつのユーフォー(비밀의 유에프오)",
        artist: "ナユタン星人(나유탄 성인)"
    },
    {
        title: "ポジティブ☆ダンスタイム(포지티브☆댄스 타임)",
        artist: "キノシタ(키노시타)"
    },
    {
        title: "ポッピンキャンディ☆フィーバー ！(팝핀 캔디☆피버!)",
        artist: "キノシタ(키노시타)"
    },
    {
        title: "人間のくせになまいきだ(인간 주제에 건방지잖아)",
        artist: "キノシタ(키노시타)"
    },
    {
        title: "ラストリゾート(라스트 리조트)",
        artist: "Ayase"
    },
    {
        title: "幽霊東京(유령 도쿄)",
        artist: "Ayase"
    },
    {
        title: "シネマ(시네마)",
        artist: "Ayase"
    },
    {
        title: "HERO",
        artist: "Ayase"
    },
    {
        title: "クーネル・エンゲイザー(쿠네루 엔게이저)",
        artist: "電ǂ鯨(전기고래)"
    },
    {
        title: "バイロンの証明(바이런의 증명)",
        artist: "とうかさ(토우사카)"
    },
    {
        title: "最高やんK(최고야 K)",
        artist: "yukkuriK"
    },
    {
        title: "鉄錆の雨と篝火(쇠녹의 비와 횃불)",
        artist: "よしぶる(요시부루)"
    },
    {
        title: "フェイクユートピア(페이크 유토피아)",
        artist: "mistriam"
    },
    {
        title: "シャルル(샤를)",
        artist: "バルーン(벌룬)"
    },
    {
        title: "雨とペトラ(비와 페트라)",
        artist: "バルーン(벌룬)"
    },
    {
        title: "パメラ(파멜라)",
        artist: "バルーン(벌룬)"
    },
    {
        title: "花に風(꽃에 바람)",
        artist: "バルーン(벌룬)"
    },
    {
        title: "ミザン(미장)",
        artist: "バルーン(벌룬), ぬゆり(누유리)"
    },
    {
        title: "フラジール(프래질)",
        artist: "ぬゆり(누유리)"
    },
    {
        title: "フィクサー(픽서)",
        artist: "ぬゆり(누유리)"
    },
    {
        title: "命ばっかり(목숨뿐)",
        artist: "ぬゆり(누유리)"
    },
    {
        title: "ロウワー(로워)",
        artist: "ぬゆり(누유리)"
    },
    {
        title: "プロトディスコ(프로토 디스코)",
        artist: "ぬゆり(누유리)"
    },
    {
        title: "シルバーツインズ(실버 트윈즈)",
        artist: "ぬゆり(누유리), 栗山夕璃(쿠리야마 유리)"
    },
    {
        title: "フェレス(펠레스)",
        artist: "栗山夕璃(쿠리야마 유리)"
    },
    {
        title: "アナフィラキシー(아나필락시)",
        artist: "栗山夕璃(쿠리야마 유리)"
    },
    {
        title: "君色マリンスノウ(너의 색깔 마린 스노우)",
        artist: "カルロス袴田(카를로스 하카마다)"
    },
    {
        title: "ちがう!!!(달라!!!)",
        artist: "カルロス袴田(카를로스 하카마다)"
    },
    {
        title: "スーパーマーケット☆フィーバー(슈퍼마켓☆피버)",
        artist: "カルロス袴田(카를로스 하카마다)"
    },
    {
        title: "海のサーチライト(바다의 서치라이트)",
        artist: "子牛(코우시)"
    },
    {
        title: "秋の未確認生物(가을의 미확인생물)",
        artist: "子牛(코우시)"
    },
    {
        title: "再演(재연)",
        artist: "Akali"
    },
    {
        title: "産娑羅(산사라)",
        artist: "Akali"
    },
    {
        title: "アイシテナイフ(아이시테 나이프)",
        artist: "ゐろは苹果(이로하 링고)"
    },
    {
        title: "イナくなっちゃえ大作戦(DOMESTIC Revenger)",
        artist: "みつあくま(미츠 아쿠마)"
    },
    {
        title: "ショウコ隠滅、少女純潔(Virgin birth)",
        artist: "みつあくま(미츠 아쿠마)"
    },
    {
        title: "トウキョウダイバアフェイクショウ(도쿄 다이버 페이크 쇼)",
        artist: "ツミキ(츠미키)"
    },
    {
        title: "トオトロジイダウトフル(토톨로지 다우트폴)",
        artist: "ツミキ(츠미키)"
    },
    {
        title: "スイサイ／アンブレラ／ロクガツ／ドライフラワ(수채/우산/6월/드라이플라워)",
        artist: "ツミキ(츠미키)"
    },
    {
        title: "リコレクションエンドロウル(리컬렉션 엔드롤)",
        artist: "ツミキ(츠미키)"
    },
    {
        title: "ニビイロドロウレ(농회색 돌로레)",
        artist: "ツミキ(츠미키)"
    },
    {
        title: "アノニマスファンフアレ(어나니머스 팡파레)",
        artist: "ツミキ(츠미키)"
    },
    {
        title: "ヒウマノイドズヒウマニズム(휴머노이즈 휴머니즘)",
        artist: "ツミキ(츠미키)"
    },
    {
        title: "アングレイデイズ(언그레이 데이즈)",
        artist: "ツミキ(츠미키)"
    },
    {
        title: "レゾンデイトル・カレイドスコウプ(레종 데트르・칼레이도스코프)",
        artist: "ツミキ(츠미키)"
    },
    {
        title: "カルチャ(컬쳐)",
        artist: "ツミキ(츠미키)"
    },
    {
        title: "キティ(키티)",
        artist: "ツミキ(츠미키)"
    },
    {
        title: "フォニイ(포니)",
        artist: "ツミキ(츠미키)"
    },
    {
        title: "トウキョウ・シャンディ・ランデヴ(도쿄 섄디 랑데부)",
        artist: "ツミキ(츠미키)"
    },
    {
        title: "アイヴイ(아이비)",
        artist: "ツミキ(츠미키)"
    },
    {
        title: "しゃしゃてん(샤샤텐)",
        artist: "一二三(히후미)"
    },
    {
        title: "礼儀作法(예의범절)",
        artist: "一二三(히후미)"
    },
    {
        title: "踊る恐竜さん(춤추는 공룡씨)",
        artist: "一二三(히후미)"
    },
    {
        title: "結い傷な(묶인 상처인)",
        artist: "一二三(히후미)"
    },
    {
        title: "サクラノタトゥー(벚꽃 타투)",
        artist: "ピノキオピー(피노키오피), 一二三(히후미)"
    },
    {
        title: "腐れ外道とチョコレゐト(썩은 외도와 초콜릿)",
        artist: "ピノキオピー(피노키오피)"
    },
    {
        title: "ねぇねぇねぇ。(있잖아 있잖아 있잖아.)",
        artist: "ピノキオピー(피노키오피)"
    },
    {
        title: "神っぽいな(신 같네)",
        artist: "ピノキオピー(피노키오피)"
    },
    {
        title: "魔法少女とチョコレゐト(마법소녀와 초콜릿)",
        artist: "ピノキオピー(피노키오피)"
    },
    {
        title: "初音ミクの激唱(하츠네 미쿠의 격창)",
        artist: "cosMo@暴走P(cosMo@폭주P)"
    },
    {
        title: "リアル初音ミクの消失(리얼 하츠네 미쿠의 소실)",
        artist: "cosMo@暴走P(cosMo@폭주P)"
    },
    {
        title: "R.I.P.ゴシップの海(R.I.P.가십의 바다)",
        artist: "cosMo@暴走P(cosMo@폭주P)"
    },
    {
        title: "初音天地開闢神話(하츠네 천지개벽 신화)",
        artist: "cosMo@暴走P(cosMo@폭주P)"
    },
    {
        title: "マシンガンポエムドール(머신건 포엠 돌)",
        artist: "cosMo@暴走P(cosMo@폭주P)"
    },
    {
        title: "ロースピードフェイクリリック(로우 스피드 페이크 리릭)",
        artist: "cosMo@暴走P(cosMo@폭주P)"
    },
    {
        title: "終点(종점)",
        artist: "cosMo@暴走P(cosMo@폭주P)"
    },
    {
        title: "ロミオとシンデレラ(로미오와 신데렐라)",
        artist: "doriko"
    },
    {
        title: "エスペランサ(에스페란사)",
        artist: "Dopam!ne"
    },
    {
        title: "シビュラ(시빌라)",
        artist: "wotaku"
    },
    {
        title: "ジェヘナ(게헨나)",
        artist: "wotaku"
    },
    {
        title: "ホロン(홀론)",
        artist: "wotaku"
    },
    {
        title: "コントロール(컨트롤)",
        artist: "wotaku"
    },
    {
        title: "アンティーク(앤티크)",
        artist: "wotaku"
    },
    {
        title: "ヴィシュヌ(비슈누)",
        artist: "wotaku"
    },
    {
        title: "業病(업병)",
        artist: "wotaku"
    },
    {
        title: "世界不正解(세계부정해)",
        artist: "wotaku"
    },
    {
        title: "アルセーヌ(아르센)",
        artist: "wotaku"
    },
    {
        title: "ファントム(팬텀)",
        artist: "wotaku"
    },
    {
        title: "なんだっけ！？(뭐였더라!?)",
        artist: "タケノコ少年(죽순소년)"
    },
    {
        title: "そうだった！！(그랬지!!)",
        artist: "タケノコ少年(죽순소년)"
    },
    {
        title: "ん？(응?)",
        artist: "タケノコ少年(죽순소년)"
    },
    {
        title: "シンデレラコンプレックス(신데렐라 컴플렉스)",
        artist: "タケノコ少年(죽순소년)"
    },
    {
        title: "ラストアリス(라스트 앨리스)",
        artist: "タケノコ少年(죽순소년)"
    },
    {
        title: "ヒアソビ(불장난)",
        artist: "Camellia"
    },
    {
        title: "生命性シンドロウム(생명선 신드롬)",
        artist: "Camellia"
    },
    {
        title: "感情ディシーブ(감정 디시브)",
        artist: "ろーある(로아루)"
    },
    {
        title: "あめだま(눈깔사탕)",
        artist: "PEPOYO"
    },
    {
        title: "『±0』",
        artist: "PEPOYO"
    },
    {
        title: "紙避行記(종이피행기)",
        artist: "PEPOYO"
    },
    {
        title: "桃源郷で救済を(도원향에 구제를)",
        artist: "PEPOYO"
    },
    {
        title: "ハイドレンジア(하이드렌지아)",
        artist: "LonePi"
    },
    {
        title: "水死体は恋したい(익사체는 사랑하고 싶어)",
        artist: "LonePi"
    },
    {
        title: "エゴロック(에고 록)",
        artist: "すりぃ(스리이)"
    },
    {
        title: "テレキャスタービーボーイ(텔레캐스터 비보이)",
        artist: "すりぃ(스리이)"
    },
    {
        title: "ジャンキーナイトタウンオーケストラ(정키 나이트 타운 오케스트라)",
        artist: "すりぃ(스리이)"
    },
    {
        title: "カメレオン(카멜레온)",
        artist: "すりぃ(스리이)"
    },
    {
        title: "フクロウさん(부엉이씨)",
        artist: "すりぃ(스리이)"
    },
    {
        title: "バニー(바니)",
        artist: "すりぃ(스리이)"
    },
    {
        title: "レリギオス(렐리기오스)",
        artist: "hanerusakana"
    },
    {
        title: "KING",
        artist: "Kanaria"
    },
    {
        title: "エンヴィーベイビー(엔비 베이비)",
        artist: "Kanaria"
    },
    {
        title: "アイデンティティ(아이덴티티)",
        artist: "Kanaria"
    },
    {
        title: "ショウタイム・ルーラー(쇼타임 룰러)",
        artist: "烏屋茶房(카라스야사보우)"
    },
    {
        title: "バイメーバイメー(바이메 바이메)",
        artist: "마이키P"
    },
    {
        title: "アンチジョーカー(안티 조커)",
        artist: "마이키P"
    },
    {
        title: "このふざけた素晴らしき世界は、僕の為にある(이 실없이 멋진 세계는, 나를 위해 있어)",
        artist: "n.k"
    },
    {
        title: "オルソドクシア(오르소독시아)",
        artist: "ぐちり(구치리)"
    },
    {
        title: "アブノーマリティ･ダンシンガール(어브노멀리티 댄싱 걸)",
        artist: "ぐちり(구치리)"
    },
    {
        title: "シャーデンフロイデ(샤덴프로이데)",
        artist: "ぐちり(구치리)"
    },
    {
        title: "オクタゴン(옥타곤)",
        artist: "titana"
    },
    {
        title: "メンヘラじゃないもん!(멘헤라가 아닌 걸!)",
        artist: "Isana"
    },
    {
        title: "ラブドゥスムージー(러브드 스무디)",
        artist: "Isana"
    },
    {
        title: "カナリ(카나리)",
        artist: "INE"
    },
    {
        title: "ジンクス(징크스)",
        artist: "RuLu"
    },
    {
        title: "アスノヨゾラ哨戒班(내일의 밤하늘 초계반)",
        artist: "Orangestar"
    },
    {
        title: "Alice in 冷凍庫(Alice in 냉동고)",
        artist: "Orangestar"
    },
    {
        title: "回る空うさぎ(회전하는 하늘 토끼)",
        artist: "Orangestar"
    },
    {
        title: "DAYBREAK FRONTLINE",
        artist: "Orangestar"
    },
    {
        title: "Henceforth",
        artist: "Orangestar"
    },
    {
        title: "Surges",
        artist: "Orangestar"
    },
    {
        title: "トラフィック・ジャム(트래픽 잼)",
        artist: "煮ル果実(니루 카지츠)"
    },
    {
        title: "クノイチでも恋がしたい(쿠노이치라도 사랑이 하고 싶어)",
        artist: "みきとP(미키토P)"
    },
    {
        title: "バレリーコ(발레리코)",
        artist: "みきとP(미키토P)"
    },
    {
        title: "39みゅーじっく！(39뮤직!)",
        artist: "みきとP(미키토P)"
    },
    {
        title: "ロキ(로키)",
        artist: "みきとP(미키토P)"
    },
    {
        title: "少女レイ(소녀 레이)",
        artist: "みきとP(미키토P)"
    },
    {
        title: "ミルククラウン・オン・ソーネチカ(밀크 크라온 온 소네치카)",
        artist: "ユジー(유지)"
    },
    {
        title: "対象x(대상x)",
        artist: "ユリイ・カノン(유리이 카논)"
    },
    {
        title: "超常現象(초상현상)",
        artist: "ろくろ(로쿠로)"
    },
    {
        title: "セカイ再信仰特区(세계 재신앙 특구)",
        artist: "ろくろ(로쿠로)"
    },
    {
        title: "スロウダウナー(슬로우 다우너)",
        artist: "ろくろ(로쿠로)"
    },
    {
        title: "悪役にキスシーンを(악역에게 키스신을)",
        artist: "40meterP"
    },
    {
        title: "恋愛裁判(연애재판)",
        artist: "40meterP"
    },
    {
        title: "ねぇ、どろどろさん(저기, 질척질척씨)",
        artist: "YASUHIRO"
    },
    {
        title: "ゴー・トゥ・大都会(고 투 대도시)",
        artist: "月裏(츠키리)"
    },
    {
        title: "さよならテンダー(안녕히 텐더)",
        artist: "koyori"
    },
    {
        title: "テオ(테오)",
        artist: "Omoi"
    },
    {
        title: "君が飛び降りるのなら(네가 뛰어내린다면)",
        artist: "Omoi"
    },
    {
        title: "グリーンライツ・セレナーデ(그린라이츠 세레나데)",
        artist: "Omoi"
    },
    {
        title: "ミスリード・ミスリード(미스리드 미스리드)",
        artist: "Omoi"
    },
    {
        title: "マトリョシカ(마트료시카)",
        artist: "ハチ(하치)"
    },
    {
        title: "ドーナツホール(도넛 홀)",
        artist: "ハチ(하치)"
    },
    {
        title: "気まぐれメルシィ(변덕쟁이 메르시)",
        artist: "八王子P(하치오지P)"
    },
    {
        title: "Gimme×Gimme",
        artist: "Giga, 八王子P(하치오지P)"
    },
    {
        title: "裏表ラバーズ(겉과 속의 러버즈)",
        artist: "wowaka"
    },
    {
        title: "ローリンガール(롤링 걸)",
        artist: "wowaka"
    },
    {
        title: "ワールズエンド・ダンスホール(월즈 엔드 댄스홀)",
        artist: "wowaka"
    },
    {
        title: "アンハッピー・リフレイン(언해피 리프레인)",
        artist: "wowaka"
    },
    {
        title: "アンノウン・マザーグース(언노운 마더 구스)",
        artist: "wowaka"
    },
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

    // 노래 추천 가중치
    const songWeight = 22;

    const total =
        placeholders.length + songWeight;

    let index;

    do {
        index = Math.floor(Math.random() * total);
    } while (
        index === lastPlaceholder &&
        index < placeholders.length &&
        placeholders.length > 1
    );

    // 노래 추천
    if (index >= placeholders.length) {

        const song =
            songs[Math.floor(Math.random() * songs.length)];

        taskInput.placeholder =
            `노래 추천 - ${song.title} / ${song.artist}`;

        lastPlaceholder = -1;
    }
    // 일반 문구
    else {

        taskInput.placeholder = placeholders[index];
        lastPlaceholder = index;
    }
}