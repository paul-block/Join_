/**
 * Replaces the current body content with the sign-up template.
 */
function renderSignUp() {
    document.body.innerHTML = signUpTemplate();
}

/**
 * Animates the mobile version of the website logo.
 * Initially, it hides the main logo and shows the mobile version.
 * After 1900ms, it hides the mobile logo and displays the fixed logo along with the main content.
 */
function mobileAnimation() {
    document.getElementById('logo').classList.add('d-none');
    document.getElementById('mobileLogoContainer').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('fixedLogo').classList.remove('d-none');
        document.getElementById('mobileLogoContainer').classList.add('d-none');
        document.getElementById('container').classList.remove('d-none');
    }, 1900);
}

/**
 * Animates the desktop version of the website content.
 * After a delay of 1000ms, it displays the main content.
 */
function desktopAnimation() {
    setTimeout(() => {
        document.getElementById('container').classList.remove('d-none');
    }, 1000);
}

/**
 * Checks the URL to determine if the user was redirected from the sign-up page.
 * If they were, the sign-up content is rendered.
 */
function checkRenderSignUp() {
    if (window.location.search.includes("redirected-from=signup")) renderSignUp();
}

/**
 * Returns the template string for the sign-up content.
 * @returns {string} The template for the sign-up content.
 */
function signUpTemplate() {
    return `
    <div id="container">
    <img id="fixedLogo" src="../img/join_logo.svg" alt="Logo">

    <section id="signUpSection">

        <a href="./index.html" id="backBtn"><img src="../img/arrow_back.png"
                alt="back to login page button" /></a>

        <div id="headline">
            <h1>Sign up</h1>
            <img src="../img/line.png" alt="blue-line">
        </div>

        <form onsubmit="checkSignUpForm(event);">
            <input required id="name" type="name" placeholder="Name" />
            <span id="nameError" class="d-none"></span>
            <input required id="email" type="email" placeholder="Email" />
            <span id="emailError" class="d-none"></span>
            <input required id="password" type="password" placeholder="Password" />
            <span id="passwordError" class="d-none"></span>
            <input required id="passwordConfirmation" type="password" placeholder="Confirm Password">


            <div class="privacyPolicyContainer" id="privacyContainer">
               <div class="checkmarkContainer">
                <input required type="checkbox" id="acceptPrivacyPolicyInput" />
                <span>I accept the <a onclick="openPrivacyPolicy()" class="textHighlight">Privacy Policy</a></span>
                </div>
                <span id="acceptPrivacyPolicyError" class="d-none"></span>
            </div>
            <button class="buttonGlobal1" type="submit">Sign up</button>
        </form>
    </section>
    <section id="legal">
        <a onclick="openPrivacyPolicy()">Privacy Policy</a>
        <a onclick="openLegalNotice()">Legal notice</a>
    </section>
    </div>
`;
}