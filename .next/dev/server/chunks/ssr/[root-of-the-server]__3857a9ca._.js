module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/lib/strapi.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchSchools",
    ()=>fetchSchools,
    "fetchSchoolsFromStrapiOnly",
    ()=>fetchSchoolsFromStrapiOnly
]);
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const MOCK_SCHOOLS = [
    {
        id: 1,
        slug: "heritage-school",
        Name: "Heritage School",
        name: "Heritage School",
        location: "Mumbai",
        city: "Mumbai",
        type: "CBSE",
        curriculum: "CBSE",
        Ratings: 4.8,
        rating: 4.8,
        reviews: 125,
        students: 450,
        fee_range: "₹2,50,000 - ₹4,00,000",
        feeRange: "₹2,50,000 - ₹4,00,000",
        established: "2005",
        description: "Heritage School is a premier CBSE institution dedicated to holistic education and character building.",
        highlights: [
            "ISO Certified",
            "STEM Lab",
            "Sports Excellence",
            "Multilingual Education"
        ],
        facilities: [
            "Basketball Court",
            "Science Lab",
            "Computer Lab",
            "Library"
        ],
        contact: {
            phone: "+91 22 1234 5678",
            email: "info@heritageschool.com",
            website: "www.heritageschool.com"
        },
        image: "/placeholder.svg"
    },
    {
        id: 2,
        slug: "st-johns-academy",
        Name: "St. John's Academy",
        name: "St. John's Academy",
        location: "Bangalore",
        city: "Bangalore",
        type: "ICSE",
        curriculum: "ICSE",
        Ratings: 4.7,
        rating: 4.7,
        reviews: 98,
        students: 380,
        fee_range: "₹2,00,000 - ₹3,50,000",
        feeRange: "₹2,00,000 - ₹3,50,000",
        established: "1998",
        description: "St. John's Academy is committed to providing quality education with emphasis on values and discipline.",
        highlights: [
            "Scholarship Programs",
            "Cultural Activities",
            "Debate Club",
            "Music Program"
        ],
        facilities: [
            "Swimming Pool",
            "Auditorium",
            "Cafeteria",
            "Art Studio"
        ],
        contact: {
            phone: "+91 80 9876 5432",
            email: "contact@stjohns.edu",
            website: "www.stjohns.edu"
        },
        image: "/placeholder.svg"
    },
    {
        id: 3,
        slug: "modern-vidhyapith",
        Name: "Modern Vidhyapith",
        name: "Modern Vidhyapith",
        location: "Delhi",
        city: "Delhi",
        type: "State Board",
        curriculum: "State Board",
        Ratings: 4.6,
        rating: 4.6,
        reviews: 87,
        students: 520,
        fee_range: "₹1,50,000 - ₹2,50,000",
        feeRange: "₹1,50,000 - ₹2,50,000",
        established: "2002",
        description: "Modern Vidhyapith offers comprehensive education with focus on innovation and modern teaching methods.",
        highlights: [
            "Tech Integration",
            "Student Exchange",
            "Green Campus",
            "Mentorship"
        ],
        facilities: [
            "Technology Center",
            "Garden",
            "Gym",
            "Medical Room"
        ],
        contact: {
            phone: "+91 11 5678 9012",
            email: "admissions@modernvidhya.org",
            website: "www.modernvidhya.org"
        },
        image: "/placeholder.svg"
    }
];
// Normalize Strapi v4 responses where most fields live under `attributes`
function normalizeSchool(item) {
    const attrs = item?.attributes ?? item ?? {};
    const img = attrs.image ?? item?.image;
    const imageUrl = img?.data?.attributes?.url || img?.attributes?.url || img?.url;
    const name = attrs.Name || attrs.name || "Unnamed School";
    // Generate slug from name if not provided
    let slug = (attrs.slug || name).toLowerCase().trim().replace(/[^\w\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // spaces to hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-|-$/g, "") // trim hyphens from start/end
    ;
    return {
        id: item?.id ?? attrs.id,
        slug,
        name,
        location: attrs.location || "",
        city: attrs.city || "",
        type: attrs.type || "",
        curriculum: attrs.curriculum || "",
        rating: attrs.Ratings ?? attrs.rating ?? 0,
        reviews: attrs.reviews ?? 0,
        students: attrs.students ?? 0,
        feeRange: attrs.fee_range ?? attrs.feeRange ?? "",
        established: attrs.established ?? "",
        description: attrs.description,
        highlights: attrs.highlights,
        facilities: attrs.facilities,
        contact: attrs.contact,
        image: imageUrl ? `${STRAPI_URL}${imageUrl}` : "/placeholder.svg"
    };
}
async function fetchSchools() {
    try {
        const url = `${STRAPI_URL}/api/schools?populate=image&publicationState=live,preview`;
        console.log('Fetching schools from:', url);
        const res = await fetch(url, {
            cache: "no-store"
        });
        if (!res.ok) {
            console.error(`Strapi Error (${res.status}):`, await res.text());
            return MOCK_SCHOOLS.map(normalizeSchool);
        }
        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data : [];
        console.log(`Strapi returned ${data.length} schools`);
        if (data.length === 0) {
            console.warn('No schools found in Strapi, using mock data');
            return MOCK_SCHOOLS.map(normalizeSchool);
        }
        return data.map(normalizeSchool);
    } catch (error) {
        console.error('Error fetching from Strapi:', error);
        return MOCK_SCHOOLS.map(normalizeSchool);
    }
}
async function fetchSchoolsFromStrapiOnly() {
    try {
        const url = `${STRAPI_URL}/api/schools?populate=image&publicationState=live,preview`;
        console.log('Fetching schools from Strapi (no fallback):', url);
        const res = await fetch(url, {
            cache: "no-store"
        });
        if (!res.ok) {
            console.error(`Strapi Error (${res.status}):`, await res.text());
            return [];
        }
        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data : [];
        console.log(`Strapi returned ${data.length} schools`);
        if (data.length === 0) {
            console.warn('No schools found in Strapi');
            return [];
        }
        return data.map(normalizeSchool);
    } catch (error) {
        console.error('Error fetching from Strapi:', error);
        return [];
    }
}
}),
"[project]/components/school-detail.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/components/school-detail.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/school-detail.tsx <module evaluation>", "default");
}),
"[project]/components/school-detail.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/components/school-detail.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/school-detail.tsx", "default");
}),
"[project]/components/school-detail.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$school$2d$detail$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/school-detail.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$school$2d$detail$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/school-detail.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$school$2d$detail$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/schools/[slug]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SchoolPage,
    "generateMetadata",
    ()=>generateMetadata,
    "generateStaticParams",
    ()=>generateStaticParams
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$strapi$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/strapi.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$school$2d$detail$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/school-detail.tsx [app-rsc] (ecmascript)");
;
;
;
;
async function generateStaticParams() {
    try {
        const schools = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$strapi$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchSchools"])();
        return schools.map((school)=>({
                slug: school.slug
            }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}
async function generateMetadata({ params }) {
    try {
        const { slug } = await params;
        const schools = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$strapi$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchSchools"])();
        const school = schools.find((s)=>s.slug === slug);
        if (!school) {
            return {
                title: 'School Not Found',
                description: 'The requested school could not be found.'
            };
        }
        return {
            title: `${school.name} - ${school.location} | Kindred School Search`,
            description: school.description || `Learn more about ${school.name}, a ${school.type} school in ${school.location}.`,
            openGraph: {
                title: school.name,
                description: school.description || `Learn more about ${school.name}, a ${school.type} school in ${school.location}.`,
                images: school.image ? [
                    {
                        url: school.image
                    }
                ] : []
            }
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'School Details'
        };
    }
}
async function SchoolPage({ params }) {
    try {
        const { slug } = await params;
        if (!slug) {
            console.error('No slug provided in params');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
        }
        const schools = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$strapi$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchSchools"])();
        if (!schools || schools.length === 0) {
            console.warn('No schools returned from fetchSchools()');
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
        }
        let requestedSlug = String(slug).toLowerCase().trim();
        // Remove "the-" prefix if present (common in school names)
        const cleanedSlug = requestedSlug.replace(/^the-/, "");
        console.log(`Looking for school. Original slug: "${requestedSlug}", Cleaned: "${cleanedSlug}"`);
        console.log(`Available schools:`, schools.map((s)=>({
                id: s.id,
                slug: s.slug,
                name: s.name
            })));
        // Try 1: exact slug match
        let school = schools.find((s)=>(s.slug || '').toLowerCase().trim() === requestedSlug);
        // Try 2: slug match without "the-" prefix
        if (!school) {
            school = schools.find((s)=>{
                const sSlug = (s.slug || '').toLowerCase().trim();
                return sSlug === cleanedSlug || sSlug === requestedSlug;
            });
        }
        // Try 3: ID match (if numeric)
        if (!school) {
            const asNum = Number(requestedSlug);
            if (!isNaN(asNum)) {
                school = schools.find((s)=>s.id === asNum);
            }
        }
        // Try 4: name contains search
        if (!school) {
            const searchTerms = cleanedSlug.split('-');
            school = schools.find((s)=>{
                const schoolName = (s.name || '').toLowerCase();
                return searchTerms.some((term)=>schoolName.includes(term)) || schoolName.includes(cleanedSlug);
            });
        }
        // Try 5: first word match
        if (!school && cleanedSlug.length > 0) {
            const firstWord = cleanedSlug.split('-')[0];
            school = schools.find((s)=>{
                const schoolName = (s.name || '').toLowerCase();
                return schoolName.startsWith(firstWord);
            });
        }
        if (!school) {
            console.error(`School not found for "${requestedSlug}". Using first school as fallback.`);
            school = schools[0];
        }
        console.log(`Found school:`, {
            id: school.id,
            name: school.name,
            slug: school.slug
        });
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$school$2d$detail$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
            school: school
        }, void 0, false, {
            fileName: "[project]/app/schools/[slug]/page.tsx",
            lineNumber: 136,
            columnNumber: 12
        }, this);
    } catch (error) {
        console.error('Error loading school:', error);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
}
}),
"[project]/app/schools/[slug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/schools/[slug]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3857a9ca._.js.map