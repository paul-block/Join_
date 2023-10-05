/**
 * Fetches the contact list from the backend and assigns it to the 'contactList' variable.
 */
async function setUserContacts() {
    await downloadFromServer();
    contactList = JSON.parse(backend.getItem('contactList')) || [];
}

/**
 * Converts the 'tasks' array into a string and stores it in the backend.
 */
async function setBackendTasks() {
    let arrayAsText = JSON.stringify(tasks);
    await backend.setItem('tasks', arrayAsText);
}

/**
 * Fetches the tasks from the backend and assigns them to the 'tasks' variable.
 */
async function getBackendTasks() {
    await downloadFromServer();
    let arrayAsText = backend.getItem('tasks');
    if (arrayAsText) {
        tasks = await JSON.parse(arrayAsText);
    }
}

/**
 * Clears the content of a DOM element with the specified ID.
 * @param {string} id - The ID of the element you want to clear.
 */
function empty(id) {
    document.getElementById(id).innerHTML = '';
}

/**
 * Selects and returns a random color from the predefined array of colors.
 * @returns {string} A randomly selected color from the 'userColors' array.
 */
function getRandomColor() {
    let userColors = ['#8aa4ff', '#ff0000', '#2ad300', '#ff8a00', '#e200be', '#0038ff'];
    return userColors[Math.round(Math.random() * userColors.length)];
}

/**
 * Displays a deletion confirmation popup for a specific contact.
 * @param {number} i - The index of the contact in the list.
 */
function deletePopUp(i) {
    document.getElementById('deleteBackground').classList.remove('d-none');
    setTimeout(() => {
        document.querySelector('.deletePopup').classList.add('show');
        contactClicked = i;
    }, 10);
}

/**
 * Closes and animates out the delete confirmation popup.
 */
function closeDeletePopUp() {
    document.querySelector('.deletePopup').classList.remove('show');
    setTimeout(() => {
        document.getElementById('deleteBackground').classList.add('d-none');
        contactClicked = null;
    }, 750);
}

/**
 * Redirects the user to the Privacy Policy page.
 */
function openPrivacyPolicy() {
    window.location.href = "../Datenschutz/policyPrivacyNoLogin.html?privacy-from=signup";
}

/**
 * Redirects the user to the Legal Notice page.
 */
function openLegalNotice() {
    window.location.href = "../Datenschutz/legalNoticeNoLogin.html?legal-from=signup";
}

/**
 * Checks for specific query parameters in the current page URL and redirects accordingly.
 */
function closePageRedirecting() {
    if (window.location.search.includes("privacy-from=signup") || window.location.search.includes("legal-from=signup")) {
        window.location.href = "/Join/index/index.html?redirected-from=signup";
    } else window.location.href = "/Join/index/index.html";
}