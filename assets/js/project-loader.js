function normalizeProject(project, folder) {
    if (!project || typeof project !== "object" || Array.isArray(project)) {
        return null;
    }

    if (String(project.status).toLowerCase() === "draft") {
        return null;
    }

    const projectPath = `assets/projects/${folder}/`;
    const gallery = Array.isArray(project.gallery)
        ? project.gallery
        : Array.isArray(project.images)
            ? project.images
            : [];

    const normalizeAssetPath = path => {
        if (!path || typeof path !== "string") return "";
        if (/^(https?:)?\/\//.test(path) || path.startsWith("assets/") || path.startsWith("/")) {
            return path;
        }
        return projectPath + path;
    };

    const normalized = {
        id: project.id || folder,
        title: project.title || "",
        slug: project.slug || folder,
        category: project.category || "",
        summary: project.summary || "",
        coverImage: normalizeAssetPath(project.coverImage) || normalizeAssetPath(gallery[0]),
        gallery: gallery.map(normalizeAssetPath).filter(Boolean),
        challenge: project.challenge || "",
        solution: project.solution || "",
        role: Array.isArray(project.role) ? project.role : [],
        deliverables: Array.isArray(project.deliverables) ? project.deliverables : [],
        software: Array.isArray(project.software) ? project.software : [],
        tags: Array.isArray(project.tags) ? project.tags : [],
        featured: Boolean(project.featured),
        order: Number.isFinite(Number(project.order)) ? Number(project.order) : Number.MAX_SAFE_INTEGER,
        status: project.status || "",
        pdf: project.pdf ? normalizeAssetPath(project.pdf) : null
    };

    if (!normalized.title || !normalized.category || !normalized.summary || !normalized.coverImage) {
        return null;
    }

    return normalized;
}

async function loadProject(folder) {
    try {
        const response = await fetch(`assets/projects/${folder}/project.json`);

        if (!response.ok) {
            return null;
        }

        const project = await response.json();
        return normalizeProject(project, folder);
    } catch (error) {
        return null;
    }
}

async function getProjectBySlug(slug) {
    if (!slug || typeof slug !== "string") {
        return null;
    }

    return loadProject(slug);
}

export {
    normalizeProject,
    loadProject,
    getProjectBySlug
};
