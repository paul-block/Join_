/**
 * Populates the DOM elements with the 'w3-include-html' attribute with the content
 * of the file specified in the attribute's value.
 * After updating all the elements, it applies the dark background to menu links or modifies
 * the question mark's image. Then, it sets the user's initials.
 * @param {number} x - A number used to determine which elements to update in `bgDark` function.
 */
async function includeHTML(x) {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
  bgDark(x);
  setInitials();
}

/**
 * Applies a dark background to side menu links based on the value of x.
 * If x is less than 6, it adds a dark background to the side menu link with the corresponding number.
 * Otherwise, it updates the 'questionMark' image source.
 * @param {number} x - Determines which menu link to update or if to change the 'questionMark' image.
 */
function bgDark(x) {
  if (x < 6) {
    document.getElementById(`side-menu-link${x}`).classList.add('bg-dark');
  } else {
    document.getElementById('questionMark').src = '../img/questionMarkDark.svg';
  }
}

/**
 * Fetches the current user from the backend and updates the 'initials' element 
 * with the user's initials.
 */
async function setInitials() {
  await downloadFromServer();
  currentUser = JSON.parse(backend.getItem('currentUser')) || [];
  if (document.getElementById('initials')) {
    let profile = document.getElementById('initials');
    profile.innerHTML = currentUser.initials.toUpperCase();
  }
}


/**
 * Fetches the current user from the backend and displays their name 
 * in the 'profileName' element. After greeting the user, it renders the summary dates.
 */
async function greetUser() {
  await downloadFromServer();
  currentUser = JSON.parse(backend.getItem('currentUser')) || [];
  let profileName = document.getElementById('profileName');
  profileName.innerHTML = currentUser.name;
  renderSummaryDates();
}

/**
 * Toggles visibility of the logout button or the mobile dropdown 
 * based on the window's inner width.
 */
function openDropdown() {
  if (window.innerWidth > 1000) {
    let logout = document.getElementById('logout');
    if (logout.classList.contains('d-none')) logout.classList.remove('d-none');
    else logout.classList.add('d-none');
  }
  if (window.innerWidth < 1000) {
    let mobileDropDown = document.getElementById('mobileDropDown');
    if (mobileDropDown.classList.contains('d-none')) mobileDropDown.classList.remove('d-none');
    else mobileDropDown.classList.add('d-none');
  }
}

/**
 * Event listener for window resizing.
 * Automatically hides the logout button if window width is less than 1000px.
 * Hides the mobile dropdown if window width is greater than 1000px.
 */
window.onresize = function () {
  if (document.getElementById('logout') && window.innerWidth < 1000) document.getElementById('logout').classList.add('d-none');
  if (document.getElementById('mobileDropDown') && window.innerWidth > 1000) document.getElementById('mobileDropDown').classList.add('d-none');
};

/**
 * Logs out the user by clearing the currentUser variable and redirects 
 * to the index page.
 */
function logout() {
  currentUser = null;
  window.location.href = "../index/index.html";
}