let links = [true, false, false, false];
let id;
let index;
let priorityClicked = 'unclicked';
let currentDrag;
let currentColor;
let currentCategory;
let currentAssigned = [];
let contactList = [
    {
        firstName: 'Klaus',
        lastName: 'Kleber',
        email: 'klaus@gmail.com',
        phone: '0638492340',
        userColor: getRandomColor(),
        user: ''
    }
];
let mediaQuery = window.matchMedia("(max-width: 1200px)");
let assignedContacts = [];
let dropClicked = false;
let subtasks = [];
let tasks = [];
let previouslySelectedContact;
let datesForSummary = [];
let greetingIsLoaded = 'false';
let colors = ['#F94144', '#F3722C', '#F8961E', '#F9844A', '#F9C74F', '#90BE6D', '#43AA8B', '#4D908E', '#277DA1', '#2A9D8F'];
let categories = [];
let newCat = 0;
let contactClicked;
let newTaskStatus = null;