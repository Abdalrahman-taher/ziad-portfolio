import { getProjectBySlug } from "./project-loader.js";

const siteUrl = "https://ziad-portfolio.pages.dev";
const defaultDescription = "Project case study from Ziad Madian's creative brand design portfolio, including identity, visual communication, and campaign work.";
const imageDimensions = {
    "assets/projects/basata/image1_result.webp": [941, 1672],
    "assets/projects/basata/image2_result.webp": [1536, 2752],
    "assets/projects/brgr/image1_result.webp": [2048, 1536],
    "assets/projects/gata/image1_result.webp": [1086, 1448],
    "assets/projects/nexora/image1_result.webp": [1920, 1080],
    "assets/projects/nexora/image2_result.webp": [1920, 1080],
    "assets/projects/nexora/image3_result.webp": [1920, 1080],
    "assets/projects/nexora/image5_result.webp": [1920, 1080],
    "assets/projects/nexora-app/image1_result.webp": [375, 888],
    "assets/projects/nexora-app/image2_result.webp": [375, 888],
    "assets/projects/nexora-app/image3_result.webp": [375, 888],
    "assets/projects/nexora-app/image4_result.webp": [375, 888],
    "assets/projects/nexora-app/image5_result.webp": [375, 888],
    "assets/projects/nexora-app/image6_result.webp": [375, 888],
    "assets/projects/pretty-lady/image2_result.webp": [1024, 1024],
    "assets/projects/pretty-lady/image3_result.webp": [896, 1195],
    "assets/projects/red-bull/image1_result.webp": [1241, 1268],
    "assets/projects/red-bull/image2_result.webp": [1254, 1254],
    "assets/projects/vampirs/image1_result.webp": [1254, 1254],
    "assets/projects/vampirs/image2_result.webp": [1672, 941],
    "assets/projects/velox/image1_result.webp": [1440, 810],
    "assets/projects/velox/image2_result.webp": [1440, 810],
    "assets/projects/velox/image3_result.webp": [1440, 810],
    "assets/projects/velox/image4_result.webp": [1440, 810],
    "assets/projects/velox/image5_result.webp": [1440, 810],
    "assets/projects/velox/image6_result.webp": [1440, 810],
    "assets/projects/velox/image8_result.webp": [1440, 810],
    "assets/projects/vexa/image1_result.webp": [842, 596],
    "assets/projects/vexa/image2_result.webp": [843, 596],
    "assets/projects/vexa/image3_result.webp": [843, 596],
    "assets/projects/vexa/image4_result.webp": [843, 596],
    "assets/projects/vexa/image5_result.webp": [843, 596],
    "assets/projects/vexa/image6_result.webp": [843, 596],
    "assets/projects/vexa/image7_result.webp": [843, 596],
    "assets/projects/vexa/image8_result.webp": [843, 596],
    "assets/projects/vexa/image9_result.webp": [843, 596]
};

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
const projectContentElement = document.getElementById("projectContent");
const projectScrollIndicator = document.getElementById("projectScrollIndicator");

let galleryImages = [];
let currentGalleryIndex = 0;
let touchStartX = 0;

function setMetaAttribute(selector, attribute, value) {
    const element = document.head.querySelector(selector);

    if (element) {
        element.setAttribute(attribute, value);
    }
}

function updateProjectMetadata(project) {
    const title = `${project.title} | Ziad Madian Creative Brand Designer`;
    const description = project.summary || defaultDescription;
    const canonicalUrl = `${siteUrl}/project.html?slug=${encodeURIComponent(project.slug)}`;
    const imageUrl = project.coverImage.startsWith("http")
        ? project.coverImage
        : `${siteUrl}/${project.coverImage}`;

    document.title = title;
    setMetaAttribute('meta[name="description"]', "content", description);
    setMetaAttribute('link[rel="canonical"]', "href", canonicalUrl);
    setMetaAttribute('meta[property="og:title"]', "content", title);
    setMetaAttribute('meta[property="og:description"]', "content", description);
    setMetaAttribute('meta[property="og:url"]', "content", canonicalUrl);
    setMetaAttribute('meta[property="og:image"]', "content", imageUrl);
    setMetaAttribute('meta[property="og:image:alt"]', "content", `${project.title} ${project.category} case study cover`);
    setMetaAttribute('meta[name="twitter:title"]', "content", title);
    setMetaAttribute('meta[name="twitter:description"]', "content", description);
    setMetaAttribute('meta[name="twitter:image"]', "content", imageUrl);
    setMetaAttribute('meta[name="twitter:image:alt"]', "content", `${project.title} ${project.category} case study cover`);
}

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
    galleryImageElement.alt = `${title} project gallery image ${currentGalleryIndex + 1}`;

    const dimensions = imageDimensions[imagePath];

    if (dimensions) {
        galleryImageElement.width = dimensions[0];
        galleryImageElement.height = dimensions[1];
    }

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

projectScrollIndicator?.addEventListener("click", () => {
    projectContentElement?.scrollIntoView({ behavior: "smooth", block: "start" });
});

window.addEventListener("scroll", () => {
    if (!projectScrollIndicator) return;

    projectScrollIndicator.classList.toggle("is-hidden", window.scrollY > 24);
}, { passive: true });

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
