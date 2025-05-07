// ===== API KEY SETUP =====
const apiKeys = [
    'AIzaSyDZVWKuP5s5uCYGlFxcLksEf-yF7aMGmnE',
    'AIzaSyA64DA0Z1TzqJpRWDafxs5c6HUyxjstQfg',
    'AIzaSyClKmgGGtX7UVSkUfGlornkFpUeJHayV9c',
    'AIzaSyAZcj8THnTATnve-5ZDiCzf5qt1O_tAwM8'
  ];
  const searchEngines = [
    'e55325090f39c4714',
    '830332fe521974d91',
    'd2ac7c2a19fb94f28',
    '875be3cc867cf4426'
  ];
  let currentKeyIndex = 0;
  let currentCxIndex = 0;
  
  // ===== IMAGE FETCHERS =====
  async function fetchImages(query) {
    const apiKey = apiKeys[currentKeyIndex];
    const cx = searchEngines[currentCxIndex];
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${cx}&key=${apiKey}&searchType=image&num=3`;
  
    try {
      const res = await fetch(url);
      if (res.status === 403 || res.status === 429) {
        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
        currentCxIndex = (currentCxIndex + 1) % searchEngines.length;
        return fetchImages(query);
      }
  
      const data = await res.json();
      return data.items.map(item => item.link);
    } catch (err) {
      console.error("Image fetch failed:", err);
      return [];
    }
  }
  
  async function fetchSkillImages(query) {
    const apiKey = apiKeys[currentKeyIndex];
    const cx = searchEngines[currentCxIndex];
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)} icon&cx=${cx}&key=${apiKey}&searchType=image&num=1`;
  
    try {
      const res = await fetch(url);
      if (res.status === 403 || res.status === 429) {
        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
        currentCxIndex = (currentCxIndex + 1) % searchEngines.length;
        return fetchSkillImages(query);
      }
  
      const data = await res.json();
      return data.items[0]?.link || '';
    } catch (err) {
      console.error("Skill image fetch failed:", err);
      return '';
    }
  }
  
  // ===== INITIAL LOADERS =====
  // async function loadSkillImages() {
  //   const skillCards = document.querySelectorAll('.skill-card');
  //   for (const card of skillCards) {
  //     const query = card.getAttribute('data-skill');
  //     const img = card.querySelector('.skill-icon');
  //     const src = await fetchSkillImages(query);
  //     if (src) {
  //       img.src = src;
  //       img.alt = query;
  //     }
  //   }
  // }
  
  function setupProjectExpansion() {
    const projectCards = document.querySelectorAll(".project-card");
  
    projectCards.forEach(card => {
      card.addEventListener("click", async () => {
        const isExpanded = card.classList.contains("expanded");
  
        document.querySelectorAll(".project-card").forEach(c => {
          c.classList.remove("expanded");
          c.querySelector(".project-images").innerHTML = '';
        });
  
        if (!isExpanded) {
          card.classList.add("expanded");
  
          const query = card.getAttribute("data-query");
          const imageContainer = card.querySelector(".project-images");
          const images = await fetchImages(query);
  
          images.forEach(url => {
            const img = document.createElement("img");
            img.src = url;
            img.alt = query;
            imageContainer.appendChild(img);
          });
        }
      });
    });
  }
  
  // ===== ON LOAD =====
  window.addEventListener("load", () => {
    // Swal.fire({
    //   title: 'Welcome!',
    //   text: 'Scroll down to explore my portfolio.',
    //   icon: 'info',
    //   confirmButtonText: 'Let’s Go!'
    // });

    let timerInterval;
Swal.fire({
  title: "Scroll down to explore my Portfolio!",
  html: "I will close in <b></b> milliseconds.",
  timer: 2500,
  timerProgressBar: true,
  background: '#f0f0f0',
  didOpen: () => {
    Swal.showLoading();
    const timer = Swal.getPopup().querySelector("b");
    timerInterval = setInterval(() => {
      timer.textContent = `${Swal.getTimerLeft()}`;
    }, 100);
  },
  willClose: () => {
    clearInterval(timerInterval);
  }
}).then((result) => {
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    console.log("I was closed by the timer");
  }
});
  
    // loadSkillImages();
    setupProjectExpansion();
  });
  