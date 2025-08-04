console.log("hello would");

let contaner = document.querySelector(".contaner");
let chatcontaner = document.querySelector(".chat-contener");
let prompt = document.querySelector("#userbox");
let btn = document.querySelector("#btn");
let userMassege = null;

let API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCKRBznww07vCPqRTuiuEMVEBK-Js5NVcg";

// 👇 Typing effect function
function typetext(element, text, speed = 20) {
    element.innerHTML = "";
    let i = 0;
    let typing = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            element.scrollIntoView({ behavior: "smooth", block: "end" });
        } else {
            clearInterval(typing);
        }
    }, speed);
}

function creatChatBot(html, className) {
    let div = document.createElement("div");
    div.classList.add(className);
    div.innerHTML = html;
    return div;
}

function scrollToBottom() {
    chatcontaner.scrollTo({
        top: chatcontaner.scrollHeight,
        behavior: "smooth"
    });
}

async function getairesponse(aichatbox) {
    let aitext = aichatbox.querySelector(".text");
    try {
        let respons = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        "role": "user",
                        "parts": [{ text: userMassege }]
                    }
                ]
            })
        });

        let data = await respons.json();
        let aikarespons = data?.candidates[0].content.parts[0].text;

        // 👇 Use typing animation
        localStorage.setItem("aikaresppnse",JSON.stringify(aikarespons))
        typetext(aitext, aikarespons, 0.1);
        scrollToBottom();
    } catch (error) {
        aitext.innerText = "❌ Error aaya response lene mein.";
    } finally {
        aichatbox.querySelector("#loading").style.display = "none";
    }
};

function showLoading() {
    let html = `<div class="ai-img">
        <img src="ai.webp" alt="" id="ai">
    </div>
    <p class="text"></p>
    <img src="load.gif" alt="" width="40" id="loading">`;

    let aichatbox = creatChatBot(html, "ai-chat-box");
    chatcontaner.appendChild(aichatbox);
    localStorage.setItem("user",userMassege)
    scrollToBottom();
    getairesponse(aichatbox);
}

btn.addEventListener("click", () => {
    contaner.style.display = "none";
    userMassege = prompt.value;
    if (!userMassege) return;

    let html = `<div class="user-img">
        <img src="user.webp" alt="" id="user">
    </div>
    <p class="text"></p>`;

    let userchatbox = creatChatBot(html, "user-chat-box");
    userchatbox.querySelector(".text").innerHTML = userMassege;

    chatcontaner.appendChild(userchatbox);
    scrollToBottom();

    setTimeout(showLoading, 500);  // delay thoda kam kiya
    prompt.value = "";


});

