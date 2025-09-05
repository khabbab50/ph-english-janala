const synonymsElement = (arr) => {
  const htmlElement = arr.map(
    (el) =>
      `<div class="badge badge-soft badge-primary text-xl p-4">${el}</div>`
  );
  const arryElJoin = htmlElement.join(" ");
  return arryElJoin;
};

const mannegeLoadin = (status) => {
  if (status === true) {
    document.getElementById("loading").classList.remove("hidden");
    document.getElementById("lesion_word_container").classList.add("hidden");
  } else {
    document.getElementById("lesion_word_container").classList.remove("hidden");
    document.getElementById("loading").classList.add("hidden");
  }
};

const lesionData = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => showLesionData(json.data));
};

const removieActive = () => {
  const lesionBtnActiveRemovie = document.querySelectorAll(".lesion_btn");
  lesionBtnActiveRemovie.forEach((btn) => btn.classList.remove("active"));
};

lodeWords = (id) => {
  mannegeLoadin(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removieActive();

      const lesionBtn = document.getElementById(`lesionBtn-${id}`);
      lesionBtn.classList.add("active");

      displayWords(data.data);
    });
};

const displayWords = (words) => {
  const lesionWordsContainer = document.getElementById("lesion_word_container");
  lesionWordsContainer.innerHTML = "";

  if (words.length == 0) {
    lesionWordsContainer.innerHTML = `
          <div class="col-span-3 flex flex-col justify-center items-center gap-6">
              <img src="assets/alert-error.png" alt="" />
              <p class="bangla-font text-[#79716B] text-sm">
                এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
              </p>
              <h2 class="bangla-font text-3xl font-medium">পরের Lesson এ যান</h2>
            </div>
      `;
    mannegeLoadin(false);
    lesionWordsContainer.appendChild(emtyAlartDiv);
    return;
  }

  words.forEach((word) => {
    mannegeLoadin(true);
    wordsDetails = async (id) => {
      const url = `https://openapi.programming-hero.com/api/word/${id}`;
      const dataUrl = await fetch(url);
      const jsonData = await dataUrl.json();
      const wordInfo = jsonData.data;
      showModalInfo(wordInfo);
    };

    speakWord = async (id) => {
      const url = `https://openapi.programming-hero.com/api/word/${id}`;
      const dataUrl = await fetch(url);
      const jsonData = await dataUrl.json();
      const wordInfo = jsonData.data;

      const wordSpeak = new SpeechSynthesisUtterance(wordInfo.word);
      wordSpeak.lang = "en-us";
      speechSynthesis.speak(wordSpeak);
    };

    const wordsCart = document.createElement("div");

    wordsCart.innerHTML = `
          <div class="bg-white p-6 rounded-lg text-center space-y-6">
            <h2 class="text-3xl font-bold"> ${word.word} </h2>
            <h3 class="text-xl font-medium">Meaning /Pronounciation</h3>
            <p class="bangla-font text-3xl font-semibold">
              "${word.meaning ? word.meaning : "অর্থ খুজে পাওয়া যায়নি"} / ${
      word.pronunciation ? word.pronunciation : "অর্থ খুজে পাওয়া যায়নি"
    }"
          <div class="flex justify-between items-center">
              <button              
              onclick="wordsDetails(${word.id})"
                class="bg-[#1A91FF10] hover:bg-[#1A91FF80] p-6 rounded-md btn"
              >
                <i class="fa-solid fa-circle-info"></i>
              </button>
              <button
              onclick="speakWord(${word.id})"
                class="bg-[#1A91FF10] hover:bg-[#1A91FF80] p-6 rounded-md btn"
              >
                <i class="fa-solid fa-volume-high"></i>
              </button>
            </div>
          </div>
    `;
    lesionWordsContainer.appendChild(wordsCart);
    mannegeLoadin(false);
  });
};

const showModalInfo = (wordInfo) => {
  const modalInfo = document.getElementById("modal_box");
  modalInfo.innerHTML = "";

  const modalInfoDiv = document.createElement("div");
  modalInfoDiv.innerHTML = `          
          <form method="dialog">
            <button
              class="btn btn-sm btn-circle btn-ghost absolute right-5 top-5"
            >
              ✕
            </button>
          </form>
          <div class="p-6 space-y-8">
            <h2 class="bangla-font text-3xl font-semibold">
              ${wordInfo.word} (<i class="fa-solid fa-microphone-lines"></i>: 
              ${wordInfo.pronunciation})
            </h2>
            <div>
              <strong class="text-2xl font-semibold">Meaning</strong>
              <p class="bangla-font text-2xl font-medium">${
                wordInfo.meaning
              }</p>
            </div>
            <div>
              <strong class="text-2xl font-semibold">Example</strong>
              <p class="text-2xl">${wordInfo.sentence}.</p>
            </div>
            <div>
              <p class="bangla-font text-2xl font-medium">সমার্থক শব্দ গুলো</p>
              <div class="flex flex-wrap items-center gap-4">
                ${synonymsElement(wordInfo.synonyms)}
                
              </div>
            </div>
          </div>
          <form method="dialog">
            <button class="btn btn-primary px-5 py-2 mt-8">
              Complete Learning
            </button>
          </form>      
      `;
  modalInfo.appendChild(modalInfoDiv);

  my_modal_3.showModal();
};

const showLesionData = (lesions) => {
  const lesionBtnContainer = document.getElementById("lesion_btn_container");
  lesionBtnContainer.innerHTML = "";

  for (let data of lesions) {
    const lesionDiv = document.createElement("div");
    lesionDiv.innerHTML = `
     <button id="lesionBtn-${data.level_no}" onclick="lodeWords(${data.level_no})" class="btn btn-outline btn-primary lesion_btn"><i class="fa-solid fa-book-open">
      </i> Lesson - ${data.level_no}
     </button>
    `;

    lesionBtnContainer.appendChild(lesionDiv);
  }
};

lesionData();

// search functionality start
document.getElementById("searchBtn").addEventListener("click", () => {
  removieActive();
  const searchInpurt = document.getElementById("searcch_input");
  const searchValue = searchInpurt.value.trim().toLowerCase();
  console.log(searchValue);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((fetchData) => {
      const allData = fetchData.data;
      console.log(allData);

      const filteredData = allData.filter((word) =>
        word.word.toLowerCase().includes(searchValue)
      );
      displayWords(filteredData);
    });
});
// search functionality end
