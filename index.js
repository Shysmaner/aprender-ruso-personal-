const d = document,
    $contentSection = d.querySelector(".content-section");


function speakRussian(sentence) {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = 'ru-RU';

    const availableVoices = window.speechSynthesis.getVoices();
    const russianVoice = availableVoices.find(voice => voice.lang === 'ru-RU');
    if (russianVoice) {
        utterance.voice = russianVoice;
    }

    speechSynthesis.speak(utterance);
}

async function populate() {
    try {
        const requestURL = "./stories.json",
            request = new Request(requestURL);

        const response = await fetch(request);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const stories = await response.json();


        let allSplittedStories = [],
            allSplittedTranslations = [];

        Object.values(stories).forEach(storie => {
            const $storieDiv = d.createElement("div");
            $storieDiv.classList.add("storie-div");
            $storieDiv.classList.add(`${storie.id}`);

            $storieDiv.style.setProperty("background-image", ` url('${storie.img}') `);

            $contentSection.appendChild($storieDiv);

            const splittedStorie = storie.text.split("."),
                splittedTranslation = storie.translation.split(".");

            allSplittedStories.push(splittedStorie);
            allSplittedTranslations.push(splittedTranslation);

            let i, storieNumber;
            d.querySelectorAll(".storie-div").forEach(storieDiv => {
                storieDiv.addEventListener("click", e => {

                    const $storieContentDiv = d.createElement("div");
                    $storieContentDiv.classList.add("storie-content-div");
                    storieNumber = storieDiv.classList[1];
                    $storieContentDiv.innerHTML = `
                        <i class="fa-solid fa-close"></i>
                        <h2>${storie.title}</h2>
                        <img src="${storie.img}"}></img>
                        <h3>Ruso</h3>
                        <p class="storie-p">${Array.from(allSplittedStories[parseInt(storieDiv.classList[1])])[0]}</p>
                        <i class="fa-solid fa-volume-high"></i>
                        <h3>Inglés</h3>
                        <p class="storie-translation-p">${Array.from(allSplittedTranslations[parseInt(storieDiv.classList[1])])[0]}</p>  
                        <div class="navigator-div"></div>
                    `;

                    const $navigatorDiv = $storieContentDiv.querySelector(".navigator-div");

                    for (i = 1; i < splittedStorie.length; i++) {
                        const $navigationA = d.createElement("a");
                        $navigationA.classList.add("navigation-a");
                        $navigationA.innerHTML = i;

                        $navigatorDiv.appendChild($navigationA);
                    }

                    $navigatorDiv.querySelectorAll(".navigation-a").forEach(a => {
                        a.addEventListener("click", e => {
                            let storie = Array.from(allSplittedStories[parseInt(storieNumber)]),
                                translation = Array.from(allSplittedTranslations[parseInt(storieNumber)]);

                            $storieContentDiv.querySelector(".storie-p").innerHTML = storie[a.textContent - 1];
                            $storieContentDiv.querySelector(".storie-translation-p").innerHTML = translation[a.textContent - 1];

                            speechSynthesis.cancel();
                        });
                    });

                    if (e.target.classList[1] === $storieDiv.classList[1]) {
                        d.body.appendChild($storieContentDiv);

                        d.querySelectorAll(".fa-volume-high").forEach(faVolumeHigh=>{
                            faVolumeHigh.addEventListener("click", e=>{
                                speakRussian(e.target.parentNode.querySelector(".storie-p").textContent);
                            });
                        });
                    }

                    d.querySelectorAll(".fa-close").forEach(faClose => {
                        faClose.addEventListener("click", e => {
                            d.body.removeChild($storieContentDiv);
                        })
                    });
                });
            })
        });

    } catch (error) {
        console.error("Fetch error:", error);
    }
}

d.addEventListener("DOMContentLoaded", () => {
    populate();
});