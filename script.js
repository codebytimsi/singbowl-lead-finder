const searchBtn = document.getElementById("searchBtn");
const keywordInput = document.getElementById("keyword");

const resultsContainer = document.getElementById("resultsContainer");
const resultStatus = document.getElementById("resultStatus");

const buyerCount = document.getElementById("buyerCount");
const websiteCount = document.getElementById("websiteCount");
const emailCount = document.getElementById("emailCount");


// ===============================
// CLEAN WEBSITE DISPLAY
// ===============================

function getCleanWebsite(url) {
    if (!url) return "";

    try {
        const parsedUrl = new URL(url);

        return parsedUrl.hostname.replace(/^www\./, "");

    } catch (error) {
        return "";
    }
}


// ===============================
// SEARCH BUYERS
// ===============================

searchBtn.addEventListener("click", async function () {

    const keyword =
        keywordInput.value.trim();

    if (!keyword) {
        alert("Please enter a search keyword.");
        return;
    }

    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    resultStatus.textContent =
        "Finding real-time buyers...";

    resultsContainer.innerHTML = `
        <p style="padding: 20px;">
            Searching the US market...
        </p>
    `;

    try {

        const response =
            await fetch(
                `http://localhost:3000/api/search?q=${encodeURIComponent(keyword)}`
            );


        if (!response.ok) {
            throw new Error(
                "Failed to fetch buyers."
            );
        }


        const data =
            await response.json();


        const results =
            data.organic_results || [];


        // ===============================
        // UPDATE STATS
        // ===============================

        buyerCount.textContent =
            results.length;


        websiteCount.textContent =
            results.filter(function (result) {
                return result.link;
            }).length;


        emailCount.textContent =
            results.filter(function (result) {
                return result.public_email;
            }).length;


        resultStatus.textContent =
            `Showing ${results.length} potential buyers`;


        resultsContainer.innerHTML = "";


        if (results.length === 0) {

            resultsContainer.innerHTML = `
                <p style="padding: 20px;">
                    No buyers found.
                    Try another search keyword.
                </p>
            `;

            return;
        }


        // ===============================
        // CREATE BUYER CARDS
        // ===============================

        results.forEach(function (result) {

            const card =
                document.createElement("div");

            card.className =
                "lead-card";


            const title =
                result.title ||
                "Unknown Business";


            // Keep original URL for button
            const originalWebsite =
                result.link || "";


            // Clean domain only for display
            const displayWebsite =
                getCleanWebsite(
                    originalWebsite
                );


            const snippet =
                result.snippet ||
                "No description available.";


            const publicEmail =
                result.public_email ||
                "";


            card.innerHTML = `

                <div class="lead-top">

                    <div class="lead-avatar">
                        ${title.charAt(0).toUpperCase()}
                    </div>

                    <div>

                        <h3>${title}</h3>

                        <p>
                            🇺🇸 United States
                        </p>

                    </div>

                </div>


                <div class="lead-details">

                    <div>

                        <span>
                            Website
                        </span>

                        <strong>
                            ${
                                displayWebsite ||
                                "Not available"
                            }
                        </strong>

                    </div>


                    <div>

                        <span>
                            About
                        </span>

                        <strong>
                            ${snippet}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Public Email
                        </span>

                        <strong>
                            ${
                                publicEmail ||
                                "Not found"
                            }
                        </strong>

                    </div>

                </div>


                <div class="lead-actions">

                    <button
                        class="website-btn"
                    >
                        View Website
                    </button>


                    <button
                        class="select-lead-btn"
                    >
                        Select Lead →
                    </button>

                </div>
            `;


            // ===============================
            // VIEW WEBSITE
            // ===============================

            const websiteButton =
                card.querySelector(
                    ".website-btn"
                );


            websiteButton.addEventListener(
                "click",
                function () {

                    if (originalWebsite) {

                        window.open(
                            originalWebsite,
                            "_blank"
                        );

                    }

                }
            );


            // ===============================
            // SELECT LEAD
            // ===============================

            const selectLeadButton =
                card.querySelector(
                    ".select-lead-btn"
                );


            selectLeadButton.addEventListener(
                "click",
                function () {

                    localStorage.setItem(
                        "selectedLead",
                        JSON.stringify({

                            name:
                                title,

                            website:
                                originalWebsite,

                            displayWebsite:
                                displayWebsite,

                            snippet:
                                snippet,

                            public_email:
                                publicEmail

                        })
                    );


                    showSection(
                        emailLeadsSection
                    );

                }
            );


            resultsContainer.appendChild(
                card
            );

        });


    } catch (error) {

        console.error(error);


        resultStatus.textContent =
            "Something went wrong.";


        resultsContainer.innerHTML = `

            <p style="padding: 20px;">

                Unable to fetch buyers.
                Please make sure the backend
                server is running.

            </p>

        `;

    } finally {

        searchBtn.disabled = false;

        searchBtn.textContent =
            "Find Buyers";

    }

});


// ===============================
// LOAD SELECTED LEAD
// ===============================

function loadSelectedLead() {

    const selectedLead =
        JSON.parse(
            localStorage.getItem(
                "selectedLead"
            )
        );


    const container =
        document.getElementById(
            "selectedLeadContainer"
        );


    if (
        !selectedLead ||
        !container
    ) {
        return;
    }


    const displayWebsite =
        selectedLead.displayWebsite ||
        getCleanWebsite(
            selectedLead.website
        );


    container.innerHTML = `

        <div class="lead-card selected-lead-card">

            <div class="lead-top">

                <div class="lead-avatar">

                    ${selectedLead.name
                        .charAt(0)
                        .toUpperCase()}

                </div>


                <div>

                    <h3>
                        ${selectedLead.name}
                    </h3>

                    <p>
                        🇺🇸 United States
                    </p>

                </div>

            </div>


            <div class="lead-details">

                <div>

                    <span>
                        Website
                    </span>

                    <strong>
                        ${
                            displayWebsite ||
                            "Not available"
                        }
                    </strong>

                </div>


                <div>

                    <span>
                        About
                    </span>

                    <strong>
                        ${
                            selectedLead.snippet ||
                            "No description available."
                        }
                    </strong>

                </div>


                <div>

                    <span>
                        Public Email
                    </span>

                    <strong>
                        ${
                            selectedLead.public_email ||
                            "Not found"
                        }
                    </strong>

                </div>

            </div>


            <div class="lead-actions">

                <button
                    class="website-btn"
                    id="selectedWebsiteBtn"
                >
                    View Website
                </button>


                <button
                    class="select-lead-btn"
                    id="prepareEmailBtn"
                >
                    Prepare Email →
                </button>

            </div>

        </div>

    `;


    // ===============================
    // SELECTED LEAD WEBSITE
    // ===============================

    const websiteButton =
        document.getElementById(
            "selectedWebsiteBtn"
        );


    websiteButton.addEventListener(
        "click",
        function () {

            if (selectedLead.website) {

                window.open(
                    selectedLead.website,
                    "_blank"
                );

            }

        }
    );


    // ===============================
    // PREPARE EMAIL
    // ===============================

    const prepareEmailButton =
        document.getElementById(
            "prepareEmailBtn"
        );


    prepareEmailButton.addEventListener(
        "click",
        function () {

            const composer =
                document.getElementById(
                    "emailComposer"
                );


            const recipientEmail =
                document.getElementById(
                    "recipientEmail"
                );


            const emailSubject =
                document.getElementById(
                    "emailSubject"
                );


            const emailMessage =
                document.getElementById(
                    "emailMessage"
                );


            composer.style.display =
                "block";


            if (
                selectedLead.public_email
            ) {

                recipientEmail.value =
                    selectedLead.public_email;

            } else {

                recipientEmail.value = "";

            }


            emailSubject.value =
                "Wholesale Inquiry – Handcrafted Home Décor & Giftware";


            emailMessage.value =
`Hello,

I hope you’re doing well.

I’m reaching out on behalf of OM Enterprise, where we specialize in handcrafted home décor and gifting products, including decorative lanterns, candle holders, and decorative jars.

We would love to explore the possibility of working with your business and would be happy to share our product collection for your review.

Would you be interested in exploring potential wholesale opportunities with us?

Looking forward to hearing from you.

Best regards,
Shreekant Pathak
OM Enterprise`;


            composer.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


            recipientEmail.focus();

        }
    );

}


// ===============================
// NAVIGATION
// ===============================

const dashboardLink =
    document.getElementById(
        "dashboardLink"
    );


const findBuyersLink =
    document.getElementById(
        "findBuyersLink"
    );


const emailLeadsLink =
    document.getElementById(
        "emailLeadsLink"
    );


const dashboardSection =
    document.getElementById(
        "dashboardSection"
    );


const findBuyersSection =
    document.getElementById(
        "findBuyersSection"
    );


const emailLeadsSection =
    document.getElementById(
        "emailLeadsSection"
    );


// ===============================
// SHOW SECTION
// ===============================

function showSection(section) {

    dashboardSection.classList.remove(
        "active"
    );

    findBuyersSection.classList.remove(
        "active"
    );

    emailLeadsSection.classList.remove(
        "active"
    );


    section.classList.add(
        "active"
    );


    if (
        section === emailLeadsSection
    ) {

        loadSelectedLead();

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// ===============================
// SIDEBAR NAVIGATION
// ===============================

dashboardLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        showSection(
            dashboardSection
        );

    }
);


findBuyersLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        showSection(
            findBuyersSection
        );

    }
);


emailLeadsLink.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        showSection(
            emailLeadsSection
        );

    }
);


// ===============================
// OPEN EMAIL
// ===============================

const openEmailBtn =
    document.getElementById(
        "openEmailBtn"
    );


openEmailBtn.addEventListener(
    "click",
    function () {

        const recipient =
            document.getElementById(
                "recipientEmail"
            ).value.trim();


        const subject =
            document.getElementById(
                "emailSubject"
            ).value;


        const message =
            document.getElementById(
                "emailMessage"
            ).value;


        if (!recipient) {

            alert(
                "Please enter a publicly available business email first."
            );

            return;

        }


        const mailtoLink =
            `mailto:${recipient}` +
            `?subject=${encodeURIComponent(
                subject
            )}` +
            `&body=${encodeURIComponent(
                message
            )}`;


        window.location.href =
            mailtoLink;

    }
);


// ===============================
// INITIAL SECTION
// ===============================

showSection(
    dashboardSection
);