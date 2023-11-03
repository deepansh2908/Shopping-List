const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
	const itemsFromStorage = getItemsFromStorage();
	itemsFromStorage.forEach((item) => addItemToDOM(item));
	checkUI();
}

function onAddItemSubmit(e) {
	e.preventDefault();

	const newItem = itemInput.value;

	// Validating the Input
	if (newItem === '') {
		alert('Please add an item');
		return;
    }
    
    //check if we are in edit mode
    if (isEditMode) {
        //get the item we are editing
        const itemToEdit = itemList.querySelector('.edit-mode');

		removeItemFromLocalStorage(itemToEdit.textContent);
		itemToEdit.classList.remove('edit-mode');
		itemToEdit.remove();
		isEditMode = false;
    }
    else {
        if (checkIfItemExists(newItem)){
            alert('The item already exists')
            return
        }
    }

	// Create item DOM element
	addItemToDOM(newItem);

	// Add item to local storage
	addItemToStorage(newItem);

	checkUI();

	itemInput.value = '';
}

function addItemToDOM(item) {
	// Create list item
	const li = document.createElement('li');
	li.appendChild(document.createTextNode(item));

	const button = createButton('remove-item btn-link text-red');
	li.appendChild(button);

	// Add li to the DOM
	itemList.appendChild(li);
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();

	// Add new item to array
	itemsFromStorage.push(item);

	// Convert to JSON string and set to local storage
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
    //will store the items in local storage (values)
    let itemsFromStorage;

	//items is the key and itemsFromStorage is the array of items
	if (localStorage.getItem('items') === null) {
		itemsFromStorage = [];
	} else {
		//since we get values from local storage in the form of a string, we are parsing it into JSON here
		itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

function createButton(classes) {
    //every button has an icon within it
	const button = document.createElement('button');
	button.className = classes;
	const icon = createIcon('fa-solid fa-xmark');
	button.appendChild(icon);
	return button;
}

function createIcon(classes) {
	const icon = document.createElement('i');
	icon.className = classes;
	return icon;
}

function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    }
    else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
	const itemsFromStorage = getItemsFromStorage();
	return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
    isEditMode = true;
    itemList.querySelectorAll('li').forEach((i) => i.classList.remove('edit-mode'));
    
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Item';
	formBtn.style.backgroundColor = '#228B22';
	itemInput.value = item.textContent;
}

function removeItem(item) {
    if (confirm("Are you sure you want to remove this item?")) { 
        //this will remove item from the DOM
        item.remove();

        //remove item from localstorage
        removeItemFromLocalStorage(item.textContent);

        checkUI();
    }
}

function removeItemFromLocalStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

	// Filter out item to be removed, this will return a new array
	itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

	// Re-set to localstorage
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
	while (itemList.firstChild) {
		itemList.removeChild(itemList.firstChild);
    }
    //clear from local storage
    localStorage.removeItem('items');

	checkUI();
}

function checkUI() {
	const items = itemList.querySelectorAll('li');
	if (items.length === 0) {
		clearBtn.style.display = 'none';
		itemFilter.style.display = 'none';
	} else {
		clearBtn.style.display = 'block';
		itemFilter.style.display = 'block';
    }

    itemInput.value = '';
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
	formBtn.style.backgroundColor = '#333';

	isEditMode = false;
}

function filterItems(e) {
    console.log(e.target.value);
    var filterText = e.target.value.toLowerCase();
    const items = itemList.querySelectorAll('li');
    //now just loop through the ul and see what matches the filterText
    //since items is a NodeList, we can use forEach over here (not in the case of an HTMLCollection)
    items.forEach((item) => {
        //look at the li tag. The text is the first node here. So firstChild will give the actual text of that list item
        const itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.indexOf(filterText) != -1) {
			item.style.display = 'flex';
		} else {
			item.style.display = 'none';
		}
    })
}

//to initialize the app and avoid putting listeners in the global scope
function init() {
    // Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    //since we want to attach event listeners to every cross button, we attach it to the parent (ul) (event delegation)
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    //we want the items from localStorage to display when the page is loaded
    document.addEventListener('DOMContentLoaded', displayItems);
    
    checkUI(); 
}

init();

