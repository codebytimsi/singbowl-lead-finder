const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "OM Enterprise Buyer Lead Finder backend is running!"
    });
});


// ===============================
// EMAIL EXTRACTION
// ===============================

function extractEmails(html) {
    if (!html) {
        return [];
    }

    const matches = html.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    );

    if (!matches) {
        return [];
    }

    const emails = [...new Set(matches)];

    return emails.filter(function (email) {
        const lowerEmail = email.toLowerCase();

        return (
            !lowerEmail.includes("example.com") &&
            !lowerEmail.includes("sentry") &&
            !lowerEmail.includes(".png") &&
            !lowerEmail.includes(".jpg") &&
            !lowerEmail.includes(".jpeg") &&
            !lowerEmail.includes("wixpress")
        );
    });
}


// ===============================
// GET WEBSITE HTML
// ===============================

async function getWebsiteHTML(url) {
    if (!url) {
        return "";
    }

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/157 Safari/537.36"
            }
        });

        if (!response.ok) {
            return "";
        }

        return await response.text();

    } catch (error) {
        return "";
    }
}


// ===============================
// FIND PUBLIC BUSINESS EMAIL
// ===============================

async function findPublicEmail(website) {
    if (!website) {
        return null;
    }

    let baseURL;

    try {
        baseURL = new URL(website);
    } catch (error) {
        return null;
    }

    const pagesToCheck = [
        baseURL.href,
        new URL("/contact", baseURL.origin).href,
        new URL("/contact-us", baseURL.origin).href,
        new URL("/pages/contact", baseURL.origin).href,
        new URL("/pages/contact-us", baseURL.origin).href,
        new URL("/about", baseURL.origin).href,
        new URL("/about-us", baseURL.origin).href
    ];

    for (const pageURL of pagesToCheck) {

        try {
            const html = await getWebsiteHTML(pageURL);

            const emails = extractEmails(html);

            if (emails.length > 0) {
                return emails[0];
            }

        } catch (error) {
            continue;
        }
    }

    return null;
}


// ===============================
// CHECK IF RESULT HAS REAL WEBSITE
// ===============================

function hasValidWebsite(result) {

    const rawLink =
        result.link || "";

    if (!rawLink) {
        return false;
    }

    let parsedURL;

    try {
        parsedURL = new URL(rawLink);

    } catch (error) {
        return false;
    }

    // Only normal HTTP/HTTPS websites
    if (
        parsedURL.protocol !== "http:" &&
        parsedURL.protocol !== "https:"
    ) {
        return false;
    }

    const hostname =
        parsedURL.hostname.toLowerCase();

    // Reject Google/internal links
    const blockedHostnames = [
        "google.com",
        "google.co",
        "googleusercontent.com",
        "gstatic.com"
    ];

    const isBlockedHost =
        blockedHostnames.some(function (domain) {

            return (
                hostname === domain ||
                hostname.endsWith("." + domain)
            );

        });

    if (isBlockedHost) {
        return false;
    }

    return true;
}


// ===============================
// FILTER USEFUL BUSINESS RESULTS
// ===============================

function isUsefulBusinessResult(result) {

    if (!result) {
        return false;
    }

    // First make sure there is a real website
    if (!hasValidWebsite(result)) {
        return false;
    }

    const title =
        (result.title || "").toLowerCase();

    const link =
        (result.link || "").toLowerCase();

    const snippet =
        (result.snippet || "").toLowerCase();


    // ===============================
    // BLOCK MARKETPLACES
    // ===============================

    const blockedDomains = [
        "amazon.com",
        "amazon.in",
        "ebay.com",
        "etsy.com",
        "walmart.com",
        "aliexpress.com",
        "temu.com",
        "shop.app",
        "facebook.com",
        "pinterest.com",
        "youtube.com",
        "instagram.com",
        "tiktok.com"
    ];

    const isBlocked =
        blockedDomains.some(function (domain) {
            return link.includes(domain);
        });

    if (isBlocked) {
        return false;
    }


    // ===============================
    // BLOCK OBVIOUS PRODUCT RESULTS
    // ===============================

    const productWords = [
        "buy now",
        "add to cart",
        "product details",
        "in stock",
        "sku",
        "sale price"
    ];

    const productScore =
        productWords.filter(function (word) {

            return (
                title.includes(word) ||
                snippet.includes(word)
            );

        }).length;

    if (productScore >= 2) {
        return false;
    }


    // ===============================
    // BLOCK GOOGLE-LIKE GARBAGE
    // ===============================

    const garbagePatterns = [
        "caes",
        "google",
        "gstatic",
        "googleusercontent"
    ];

    const looksLikeGarbage =
        garbagePatterns.some(function (pattern) {

            return (
                title.includes(pattern) ||
                link.includes(pattern)
            );

        });

    if (looksLikeGarbage) {
        return false;
    }


    return true;
}


// ===============================
// SEARCH BUYERS
// ===============================

app.get("/api/search", async (req, res) => {

    const keyword =
        req.query.q;

    if (!keyword) {
        return res.status(400).json({
            error:
                "Search keyword is required."
        });
    }

    try {

        const buyerQuery =
            `${keyword} retailers stores wholesalers -amazon -etsy -ebay -walmart`;


        const url =
            `https://serpapi.com/search.json?engine=google` +
            `&q=${encodeURIComponent(buyerQuery)}` +
            `&gl=us` +
            `&hl=en` +
            `&num=10` +
            `&api_key=${process.env.SERPAPI_KEY}`;


        const response =
            await fetch(url);


        if (!response.ok) {
            throw new Error(
                "SerpAPI request failed."
            );
        }


        const data =
            await response.json();


        const rawResults =
            data.organic_results || [];


        // Filter bad / irrelevant results
        const businessResults =
            rawResults.filter(
                isUsefulBusinessResult
            );


        // Find public emails
        const enrichedResults =
            await Promise.all(

                businessResults.map(
                    async function (result) {

                        const email =
                            await findPublicEmail(
                                result.link
                            );


                        return {
                            ...result,
                            public_email:
                                email
                        };

                    }
                )

            );


        res.json({

            ...data,

            search_query:
                buyerQuery,

            organic_results:
                enrichedResults

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            error:
                "Failed to fetch search results."

        });

    }

});


// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});