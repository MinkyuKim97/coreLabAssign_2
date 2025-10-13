 function normalizeList(raw) {
    if (raw == null) return [];
    let v = raw;
    try { v = JSON.parse(raw); } catch (e) { /* 평문일 수 있음 */ }
    if (Array.isArray(v)) {
      return [...new Set(v.map(x => String(x).toLowerCase().trim()).filter(Boolean))];
    }
    return [...new Set(String(v).toLowerCase().split(/[\s,;|/]+/).map(s => s.trim()).filter(Boolean))];
  }

  function getCandidates() {
    return [...document.querySelectorAll('#recipe-candidates .candidate')].map(node => {
      const when = normalizeList(node.dataset.when);   // 예: ['morning','lunch']
      const style = normalizeList(node.dataset.style); // 예: ['asians'] 또는 ['western','dessert']
      return {
        id: node.dataset.id,
        url: node.dataset.url,
        title: node.dataset.title || 'NONE',
        desc: node.dataset.desc || '',
        when,
        style,
        photo: node.dataset.photo || '',
      };
    });
  }

  const rnd = (n) => Math.floor(Math.random() * n);
  const pickRandom = (arr) => arr.length ? arr[rnd(arr.length)] : null;

  // 교집합 여부
  const intersects = (a, b) => {
    if (!a.length || !b.length) return false;
    const setA = new Set(a);
    return b.some(x => setA.has(x));
  };

  function pickThree(all) {
    const lunchPool0 = all.filter(x => x.when.includes('lunch'));
    if (!lunchPool0.length) return { morning:null, lunch:null, dinner:null };

    // 점심 후보를 바꿔가며 시도 (막힐 때 탈출)
    for (let attempt = 0; attempt < Math.min(lunchPool0.length, 50); attempt++) {
      const lunchPick = pickRandom(lunchPool0);
      const usedIds = new Set([lunchPick.id]);
      const lunchStyles = lunchPick.style;

      const dinnerPool = all.filter(x =>
        x.when.includes('dinner') &&
        !usedIds.has(x.id) &&
        !intersects(x.style, lunchStyles)
      );
      const dinnerPick = pickRandom(dinnerPool);
      if (!dinnerPick) continue;

      usedIds.add(dinnerPick.id);

      const morningPool = all.filter(x =>
        x.when.includes('morning') &&
        !usedIds.has(x.id)
      );
      const morningPick = pickRandom(morningPool);
      if (!morningPick) continue;

      return { morning: morningPick, lunch: lunchPick, dinner: dinnerPick };
    }
    return { morning:null, lunch:null, dinner:null };
  }

  function renderCard(host, item) {
    host.innerHTML = item
      ? `<a href="/${item.url}">
        <h3>${item.title}</h3>
        <div class="cardImgBox"><img src="${item.photo}" /> </div>         
         ${item.desc ? `<p class="muted">${item.desc}</p>` : ``}
         <div class="muted">
           style: ${item.style.join(', ') || '—'}
         </div>
         </a>`
      : `<p class="muted">NONE</p>`;
  }

  function reroll() {
    const all = getCandidates();
    const picks = pickThree(all);
    renderCard(document.querySelector('#morning-slot .card'), picks.morning);
    renderCard(document.querySelector('#lunch-slot .card'), picks.lunch);
    renderCard(document.querySelector('#dinner-slot .card'), picks.dinner);
  }
  reroll();
  document.getElementById('reroll').addEventListener('click', reroll);










  const buttons = document.querySelectorAll(".controls button");
  const plants = document.querySelectorAll(".plant");

  // buttons.forEach((btn) => {
  //   btn.addEventListener("click", () => {
  //     const target = btn.dataset.num;
  //     plants.forEach((p) => {
  //       p.hidden = p.dataset.index !== target;
  //     });
  //   });
  // });

  // show index==1 at first
  document.querySelector('[data-num="1"]').click();

  // const container = document.getElementById("recipeCont");
  const container = document.getElementById("recipeContGrid");
  const items = Array.from(container.children);

  function render(sorted) {
    container.innerHTML = "";
    sorted.forEach((item) => container.appendChild(item));
  }

  // Sortstate - 0=title / 1=index
  let sortState = 0;
  const sortTitleBtn = document.getElementById("sortTitle");
  sortTitleBtn.classList.add("active");

  sortTitleBtn.addEventListener("click", () => {
    // const sorted = [...items].sort((a, b) =>
    //   a.dataset.title.localeCompare(b.dataset.title)
    // );
    const sorted = [...items].sort(
      (a, b) => Number(a.dataset.title) - Number(b.dataset.title)
    );    render(sorted);
    sortState = 0;
    for(const btn of [sortIndexBtn]){
      btn.classList.remove("active");
    }

  });
  sortTitleBtn.addEventListener("mouseenter", () => {
    if(sortState != 0){
      sortTitleBtn.classList.add("active");
    }
  });
  sortTitleBtn.addEventListener("mouseleave", () => {
    if(sortState != 0){
      sortTitleBtn.classList.remove("active");
    }
  });

  const sortIndexBtn = document.getElementById("sortIndex");
  sortIndexBtn.addEventListener("click", () => {
    const sorted = [...items].sort(
      (a, b) => Number(a.dataset.index) - Number(b.dataset.index)
    );
    render(sorted);
    sortState = 1;
    for(const btn of [sortTitleBtn]){
      btn.classList.remove("active");
    }
  });
  sortIndexBtn.addEventListener("mouseenter", () => {
    if(sortState != 1){
      sortIndexBtn.classList.add("active");
    }
  });
  sortIndexBtn.addEventListener("mouseleave", () => {
    if(sortState != 1){
      sortIndexBtn.classList.remove("active");
    }
  });