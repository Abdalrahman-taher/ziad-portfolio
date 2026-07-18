import { getProjectBySlug } from "./project-loader.js";

const siteUrl = "https://ziad-portfolio.pages.dev";
const titleElement = document.getElementById("projectTitle");
const categoryElement = document.getElementById("projectCategory");
const summaryElement = document.getElementById("projectSummary");
const challengeElement = document.getElementById("projectChallenge");
const solutionElement = document.getElementById("projectSolution");
const roleElement = document.getElementById("projectRole");
const deliverablesElement = document.getElementById("projectDeliverables");
const softwareElement = document.getElementById("projectSoftware");
const tagsElement = document.getElementById("projectTags");
const pdfElement = document.getElementById("projectPdf");
const galleryElement = document.getElementById("projectGallery");
const galleryImageElement = document.getElementById("projectGalleryImage");
const galleryCounterElement = document.getElementById("projectGalleryCounter");
const galleryPrevButton = document.getElementById("projectGalleryPrev");
const galleryNextButton = document.getElementById("projectGalleryNext");
const projectBackLink = document.getElementById("projectBackLink");

let galleryImages = [];
let currentGalleryIndex = 0;
let touchStartX = 0;

function setText(element, value) {
    if (element) {
        element.textContent = value || "";
    }
}

function renderList(element, items, itemClass = "") {
    if (!element) return;

    element.innerHTML = "";

    if (!Array.isArray(items)) return;

    items.forEach(item => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        if (itemClass) {
            listItem.className = itemClass;
        }
        element.appendChild(listItem);
    });
}

function updateMeta(selector, value, attribute = "content") {
    const element = document.querySelector(selector);

    if (element && value) {
        element.setAttribute(attribute, value);
    }
}

function updateProjectMetadata(project) {
    const pageTitle = `${project.title} | ${project.category} Case Study | Ziad Ahmed`;
    const pageDescription = project.summary;
    const pageUrl = `${siteUrl}/project.html?slug=${encodeURIComponent(project.slug || project.id)}`;
    const imageUrl = project.coverImage.startsWith("http")
        ? project.coverImage
        : `${siteUrl}/${project.coverImage}`;

    document.title = pageTitle;
    updateMeta('meta[name="description"]', pageDescription);
    updateMeta('link[rel="canonical"]', pageUrl, "href");
    updateMeta('meta[property="og:title"]', pageTitle);
    updateMeta('meta[property="og:description"]', pageDescription);
    updateMeta('meta[property="og:url"]', pageUrl);
    updateMeta('meta[property="og:image"]', imageUrl);
    updateMeta('meta[property="og:image:alt"]', `${project.title} ${project.category} case study cover`);
    updateMeta('meta[name="twitter:title"]', pageTitle);
    updateMeta('meta[name="twitter:description"]', pageDescription);
    updateMeta('meta[name="twitter:image"]', imageUrl);
    updateMeta('meta[name="twitter:image:alt"]', `${project.title} ${project.category} case study cover`);
}

function updateGalleryImage() {
    if (!galleryImageElement || !galleryCounterElement) return;

    const imagePath = galleryImages[currentGalleryIndex];

    if (!imagePath) {
        galleryImageElement.removeAttribute("src");
        galleryImageElement.alt = "";
        galleryCounterElement.textContent = "0 / 0";
        return;
    }

    const title = titleElement?.textContent || "Project";

    galleryImageElement.src = imagePath;
    galleryImageElement.alt = `${title} portfolio case study image ${currentGalleryIndex + 1}`;
    galleryCounterElement.textContent = `${currentGalleryIndex + 1} / ${galleryImages.length}`;
}

function showGalleryImage(index) {
    if (!galleryImages.length) return;

    currentGalleryIndex = (index + galleryImages.length) % galleryImages.length;
    updateGalleryImage();
}

function initGallery(images) {
    galleryImages = Array.isArray(images) ? images : [];
    currentGalleryIndex = 0;

    if (galleryElement) {
        galleryElement.hidden = galleryImages.length === 0;
    }

    updateGalleryImage();
}

galleryPrevButton?.addEventListener("click", () => {
    showGalleryImage(currentGalleryIndex - 1);
});

galleryNextButton?.addEventListener("click", () => {
    showGalleryImage(currentGalleryIndex + 1);
});

document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
        showGalleryImage(currentGalleryIndex - 1);
    }

    if (event.key === "ArrowRight") {
        showGalleryImage(currentGalleryIndex + 1);
    }
});

galleryElement?.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

galleryElement?.addEventListener("touchend", event => {
    const touchEndX = event.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) < 40) return;

    if (swipeDistance > 0) {
        showGalleryImage(currentGalleryIndex - 1);
    } else {
        showGalleryImage(currentGalleryIndex + 1);
    }
}, { passive: true });

projectBackLink?.addEventListener("click", () => {
    sessionStorage.setItem("returnToProjects", "true");
});

function showProjectNotFound() {
    document.title = "Project not found";

    setText(titleElement, "Project not found");
    setText(categoryElement, "");
    setText(summaryElement, "The requested project could not be found.");
    setText(challengeElement, "");
    setText(solutionElement, "");
    renderList(roleElement, []);
    renderList(deliverablesElement, []);
    renderList(softwareElement, []);
    renderList(tagsElement, []);
    initGallery([]);

    if (pdfElement) pdfElement.innerHTML = "";
}

function renderProject(project) {
    updateProjectMetadata(project);

    setText(titleElement, project.title);
    setText(categoryElement, project.category);
    setText(summaryElement, project.summary);
    setText(challengeElement, project.challenge);
    setText(solutionElement, project.solution);
    renderList(roleElement, project.role);
    renderList(deliverablesElement, project.deliverables);
    renderList(softwareElement, project.software);
    renderList(tagsElement, project.tags, "project-tag");

    if (pdfElement) {
        pdfElement.innerHTML = "";

        if (project.pdf) {
            const heading = document.createElement("h2");
            heading.textContent = "PDF";

            const link = document.createElement("a");
            link.href = project.pdf;
            link.textContent = "View PDF";

            pdfElement.append(heading, link);
        }
    }

    initGallery(project.gallery);
}

async function initProjectPage() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    if (!slug) {
        showProjectNotFound();
        return;
    }

    try {
        const project = await getProjectBySlug(slug);

        if (!project) {
            showProjectNotFound();
            return;
        }

        renderProject(project);
    } catch (error) {
        showProjectNotFound();
    }
}

initProjectPage();
