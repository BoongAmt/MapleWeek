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
            addArea.querySelector(".task-input").focus();
        }
    });
});

// 표시 기능

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

    const thursday = new Date(now);
    thursday.setDate(now.getDate() - mondayBasedDay + 3);

    return `${thursday.getFullYear()}-${
        String(thursday.getMonth() + 1).padStart(2, "0")
    }-${
        String(thursday.getDate()).padStart(2, "0")
    }`;
}