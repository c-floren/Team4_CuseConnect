const searchInput = document.getElementById("formSearch");
const categorySelect = document.getElementById("formCategoryFilter");
const formsList = document.getElementById("formsList");
const formsCount = document.getElementById("formsCount");
const noFormsMatch = document.getElementById("noFormsMatch");

const formItems = Array.from(formsList.querySelectorAll(".form-row-item"));

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;

  let visibleCount = 0;

  formItems.forEach((item) => {
    const name = item.dataset.name || "";
    const itemCategory = item.dataset.category || "";

    const matchesQuery = !query || name.includes(query);
    const matchesCategory = !category || itemCategory === category;
    const show = matchesQuery && matchesCategory;

    item.style.display = show ? "flex" : "none";
    if (show) visibleCount += 1;
  });

  formsCount.textContent = String(visibleCount);
  noFormsMatch.style.display = visibleCount === 0 ? "block" : "none";
}

searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);
