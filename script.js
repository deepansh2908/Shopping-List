const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');

//or it could be an arrow function
// const addItem = (e) => {
// 	// Your code to handle the form submission goes here
// };
function addItem(e) {
    e.preventDefault();
    //get the input value
    const newItem = itemInput.value;

    //validate if there's text or not
    if (!newItem) {
        alert('Please add an item ');
        return;
    }

    //create a new list item and insert the text into it
    const li = document.createElement('li');
    const textNode = document.createTextNode(newItem);
    li.appendChild(textNode);

    //create a new button as every list item has a button (and an icon within it)
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);
    itemList.appendChild(li);

    //now make the input field empty
    itemInput.value = '';
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    //every button has an icon
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

//attaching the submit event listener to the form 
itemForm.addEventListener('submit', addItem);
