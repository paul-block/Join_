let users = [{}];
let currentUser;

/**
 * Initializes the page by choosing the appropriate animation, fetching users, 
 * checking for stored login information, and displaying account creation messages.
 */
async function init() {
    chooseAnimation();
    await getUsers();
    checkRememberMe();
    checkIfCreatedAccount();
    checkRenderSignUp();
}

/**
 * Fetches the users from the server and sets the 'users' variable.
 */
async function getUsers() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
}

/**
 * Checks if the login credentials are saved in the local storage, and if so, 
 * sets them in the login form fields.
 */
function checkRememberMe() {
    let email = getLocalStorageEmail();
    let password = getLocalStoragePassword();
    if (getLocalStorageEmail() && getLocalStoragePassword())
        setLoginFromLocalStorage(email, password);
}

/**
 * Sets the login form fields with the given email and password.
 * @param {string} email The email to set in the login form.
 * @param {string} password The password to set in the login form.
 */
function setLoginFromLocalStorage(email, password) {
    document.getElementById('email').value = email;
    document.getElementById('password').value = password;
    document.getElementById('rememberMe').checked = true;
}

/**
 * Checks if an account was recently created by inspecting the URL parameters.
 * If a message parameter is found, it renders a success message.
 */
function checkIfCreatedAccount() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if (msg)
        renderSuccessfullyCreatedAccountMsg(msg);
}

/**
 * Renders a message indicating the successful creation of an account.
 * @param {string} msg The message to display to the user.
 */
function renderSuccessfullyCreatedAccountMsg(msg) {
    let msgBox = document.getElementById("msgBox");
    msgBox.classList.remove('d-none');
    msgBox.innerHTML = `<p id="msg">${msg}</p>`;
}

/**
 * Chooses the appropriate animation based on the screen width.
 */
function chooseAnimation() {
    if (window.innerWidth <= 650) {
        mobileAnimation();
    } else desktopAnimation();
}

/**
 * Fetches the user data from the sign-up form.
 * @returns {Object} An object containing the user's name, email, password, and password confirmation.
 */
function getUserDataFromSignUpForm() {
    return {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        passwordConfirmation: document.getElementById("passwordConfirmation").value
    };
}

/**
 * Validates the user data fetched from the sign-up form.
 * @returns {boolean} Returns true if all user data is valid, otherwise false.
 */
function validateUserDataFromSignUpForm() {
    const { name, email, password, passwordConfirmation } = getUserDataFromSignUpForm();
    return validateUsername(name) &&
        validateEmail(email) &&
        validatePassword(password) &&
        validatePassword(passwordConfirmation);
}

/**
 * Checks the user's sign-up form data and, if valid, adds the user to the database.
 * If the passwords do not match or are invalid, it displays an error message.
 * @param {Event} event The form submission event.
 */
async function checkSignUpForm(event) {
    event.preventDefault();
    const userData = getUserDataFromSignUpForm();
    if (validateUserDataFromSignUpForm() && arePasswordsMatching(userData.password, userData.passwordConfirmation)) {
        await addUserToDatabank(userData);
        clearForm();
        redirectToIndexAfterCreatedAcc();
    } else checkPassword(userData);
}

/**
 * Validates the provided user password and displays the appropriate error message.
 * @param {Object} userData An object containing user data.
 */
function checkPassword(userData) {
    document.getElementById('passwordError').classList.remove('d-none');
    if (!arePasswordsMatching(userData.password, userData.passwordConfirmation))
        document.getElementById('passwordError').innerText = "Die Passwörter stimmen nicht überein.";
    else document.getElementById('passwordError').innerText = "Das Passwort muss aus mindestens 8 Zeichen bestehen, einschließlich einem Sonderzeichen und einem klein- und Großbuchstaben";
}

/**
 * Redirects the user to the index page with a success message after successful account creation.
 */
function redirectToIndexAfterCreatedAcc() {
    window.location.href = 'index.html?msg=You signed up successfully';
}

/**
 * Adds the provided user data, along with a randomly generated color, to the database.
 * @param {Object} userData An object containing user data.
 */
async function addUserToDatabank(userData) {
    const userDataPlusRandomColor = {
        ...userData,
        color: getRandomColor()
    };
    users.push(userDataPlusRandomColor);
    await backend.setItem('users', JSON.stringify(users));
}

/**
 * Clears all the fields of the sign-up form.
 */
function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}

/**
 * Fetches the email and password values from the login form.
 * @returns {Object} An object containing the email and password.
 */
function getEmailAndPassword() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    return {
        email: email,
        password: password
    };
}

/**
 * Authenticates the user's login credentials.
 * If the credentials are valid, the user's gets redirected to the summary page. 
 * Additionally, the login data is stored locally if the "remember me" option is checked.
 * If the credentials are invalid, an error message is displayed.
 */
async function login() {
    const loginData = getEmailAndPassword();
    let user = users.find(user => user.email == loginData.email && user.password == loginData.password);
    if (user) {
        await generateCurrentUser(user);
        redirectToSummary();
        setRememberMeIfChecked();
    }
    else showLoginError();
}

/**
 * Displays a login error message when the user provides incorrect credentials.
 */
function showLoginError() {
    document.getElementById('wrongLogin').classList.remove('d-none');
    document.getElementById('wrongLogin').innerHTML = 'Email oder Passwort ungültig';
}

/**
 * Creates the current user object with all necessary properties.
 * @param {Object} user The user object that has matched the login credentials.
 */
async function generateCurrentUser(user) {
    const loginData = getEmailAndPassword();
    let initials = getInitialsFromUsername(user.name);
    currentUser = {
        name: user.name,
        email: loginData.email,
        password: loginData.password,
        initials: initials,
        color: user.color,
        contacts: contactList
    };
    await backend.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('greetingLoaded', 'false');
}

/**
 * Returns the initials from a given username.
 * @param {string} name The full name from which the initials are to be extracted.
 * @returns {string} The initials of the user's name.
 */
function getInitialsFromUsername(name) {
    let stringToSplit = name.split(" ");
    let seperatedLetters = stringToSplit.map(word => word[0]);
    let combinedLetters = seperatedLetters.join("");
    return combinedLetters;
}

/**
 * Performs login operations for a guest user.
 */
async function guestLogin() {
    await setGuestAccount();
    redirectToSummary();
}

/**
 * Sets the properties for a guest account.
 */
async function setGuestAccount() {
    let initials = getInitialsFromUsername('Guest Account');
    currentUser = {
        name: 'Guest Account',
        email: "guest@guest.com",
        password: "Guest123!",
        initials: initials,
        color: '#2AAAE2',
        contacts: contactList
    };
    localStorage.setItem('greetingLoaded', 'false');
    await backend.setItem('currentUser', JSON.stringify(currentUser));
}

/**
 * Redirects the user to the summary page.
 */
function redirectToSummary() {
    window.location.href = '../summary/summary.html';
}

/**
 * Redirects the user to the index page.
 */
function redirectToIndex() {
    window.location.href = './index.html';
}

/**
 * Checks if two password strings match.
 * @param {string} password The main password.
 * @param {string} confirmPassword The password to compare against the main password.
 * @returns {boolean} True if the passwords match, false otherwise.
 */
function arePasswordsMatching(password, confirmPassword) {
    return password === confirmPassword;
}

/**
 * Saves the user's email and password in local storage if the "remember me" checkbox is checked.
 */
function setRememberMeIfChecked() {
    if (document.getElementById('rememberMe').checked) {
        localStorage.setItem('currentUser-email', currentUser.email);
        localStorage.setItem('currentUser-password', currentUser.password);
    }
}

/**
 * Retrieves the user's email from local storage.
 * @returns {string|null} The stored email, or null if not present.
 */
function getLocalStorageEmail() {
    return localStorage.getItem('currentUser-email');
}

/**
 * Retrieves the user's password from local storage.
 * @returns {string|null} The stored password, or null if not present.
 */
function getLocalStoragePassword() {
    return localStorage.getItem('currentUser-password');
}

/**
 * Validates the given username based on a regular expression.
 * @param {string} username The username to validate.
 * @returns {boolean} True if the username matches the pattern, false otherwise.
 */
function validateUsername(username) {
    const regex = /^[a-zA-Z]+(\s[a-zA-Z]+)?$/;
    return regex.test(username);
}

/**
 * Validates the given email based on a regular expression.
 * @param {string} email The email to validate.
 * @returns {boolean} True if the email matches the pattern, false otherwise.
 */
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

/**
 * Validates the given password based on a regular expression.
 * @param {string} password The password to validate.
 * @returns {boolean} True if the password matches the pattern, false otherwise.
 */
function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return passwordRegex.test(password);
}