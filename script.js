/*
   Author: Maxwell Wilke
   Title: The Fly Box

   The purpose of this app is to document fly tying patterns (recipes) used in 
   fly fishing. The user views a catalog of recipes and can add new patterns 
   to the page.
   
   This app utilizes Bootstrap and features scroll animation, card 
   display dependent on viewport size, form processing, and array processing.
*/

/**
 * Initializes the page.
 * - Adds a click event listener to the "Add Pattern" form button.
 * - Displays all fly tying recipes in cards dependent on vieport size.
 * - Starts a resize event listener to toggle between card display on a small and large screen.
 */
const init = () => {
    let allRecipes = getAllRecipes();
    let outputArea = document.getElementById("outputArea");
    let currentWindow = new CurrentWindow();

    // Click event listener on form submission button
    document.querySelector("#addPattern").addEventListener("click", function(event) {
        // Prevent default form submission behavior
        event.preventDefault();
        addNewRecipe(outputArea, currentWindow, allRecipes);
    });
    
    outputCards(outputArea, currentWindow, allRecipes);

    // The "resize" event listener
    window.addEventListener('resize', function() {
        reviewRows(outputArea, currentWindow, allRecipes)
    });
}

/**
 * Adds a "show" class to hidden elements when they enter the viewport. 
 * Also removes "show" when the element leaves the viewport.
 * 
 * Source: https://www.youtube.com/watch?v=T33NN_pPeNI
 */
const startObserver = () => {
    // Object becomes visible if it's in the viewport (intersecting) and is removed when not in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } else {
                entry.target.classList.remove('show');
            }
        });
    });

    // Observe all hidden elements
    const hiddenElements = document.querySelectorAll('.hide');
    hiddenElements.forEach((element) => observer.observe(element)); 
}

/**
 * Class that represents a Window object in order to interact with 
 * the screen size for card display.
 */
class CurrentWindow {
    constructor() {
        this.width = window.innerWidth; // width is in pixels
        if (this.width < 768) {
            this.size = "small";
        } else {
            this.size = "large";
        }
    }
}

/**
 * Calculates the id of a new recipe.
 */
const calculateId = (recipes) => {
    let newId = 1;

    if (recipes.length > 0) {
        let lastRecipe = recipes[recipes.length - 1];
        newId = lastRecipe.id + 1;
    }
    return newId;
}

/**
 * Collapses the form using Bootstrap.
 * 
 * Source: https://getbootstrap.com/docs/5.0/components/collapse/
 */
const collapseForm = () => {
    let myCollapse = document.getElementById('collapseForm');
    new bootstrap.Collapse(myCollapse, {
        toggle: true
    })
}

/**
 * Adds a new recipe to the recipe list.
 * 
 * In a future version:
 * - This can POST data to the server.
 * - Instead of calling outputCards(), make a function to append the one new card.
 */
const addNewRecipe = (outputArea, currentWindow, allRecipes) => {
    // Get the recipe info from the input fields
    let titleInputBox = document.querySelector("#title");
    let recipeTitle = titleInputBox.value;
    let srcInputBox = document.querySelector("#src");
    let recipeImgSrc = srcInputBox.value;
    let descriptionInputBox = document.querySelector("#description");
    let recipeDescription = descriptionInputBox.value;
    let ingredientsInputBox = document.querySelector("#ingredients");
    let recipeIngredients = ingredientsInputBox.value;
    let instructionsInputBox = document.querySelector("#instructions");
    let recipeInstructions = instructionsInputBox.value;
    let linkInputBox = document.querySelector("#link");
    let recipeLink = linkInputBox.value;
    let recipeId;
    let newRecipe;

    // Trim whitespace
    recipeTitle = recipeTitle.trim();
    recipeImgSrc = recipeImgSrc.trim();
    recipeDescription = recipeDescription.trim();
    recipeIngredients = recipeIngredients.trim();
    recipeInstructions = recipeInstructions.trim();
    recipeLink = recipeLink.trim();

    // Check if the values are empty
    if (!recipeTitle) {
        alert("Title cannot be empty.");
        return;
    } else if (!recipeImgSrc) {
        alert("Image URL cannot be empty.");
        return;
    } else if (!recipeDescription) {
        alert("Description cannot be empty.");
        return;
    } else if (!recipeIngredients) {
        alert("Ingredients cannot be empty.");
        return;
    } else if (!recipeInstructions) {
        alert("Instructions cannot be empty.");
        return;
    } else if (!recipeLink) {
        alert("Link cannot be empty.");
        return;
    }

    // Calculate the ID for the new recipe
    recipeId = calculateId(allRecipes);

    // Create JS object
    newRecipe = {
        'id': recipeId,
        'title': recipeTitle,
        'imgSrc': recipeImgSrc,
        'description': recipeDescription,
        'ingredients': recipeIngredients,
        'instructions': recipeInstructions,
        'link': recipeLink
    }

    // Append object to the list
    allRecipes.push(newRecipe);
        
    // Add the new recipe to the page
    outputCards(outputArea, currentWindow, allRecipes);

    // Clear input boxes
    titleInputBox.value = "";
    srcInputBox.value = "";
    descriptionInputBox.value = "";
    ingredientsInputBox.value = "";
    instructionsInputBox.value = "";
    linkInputBox.value = "";

    collapseForm();
}

/**
 * Populates test data for fly tying recipe cards.
 * 
 * In a future version, this can be a GET request to JSON stored on a server.
 */
const getAllRecipes = () => {
    let allRecipes = [
            {id: 1,
                title: "Hippie Stomper",
                imgSrc: "images/hippieStomper.jpg",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt " 
                        + "ut labore et dolore magna aliqua. Amet cursus sit amet dictum sit amet justo donec. Id porta " 
                        + "nibh venenatis cras sed felis eget.",
                ingredients: "Adipiscing, elit, sed",
                instructions: "Porttitor lacus luctus accumsan tortor posuere ac ut consequat semper. Commodo odio aenean " 
                        + "sed adipiscing diam donec adipiscing. Justo eget magna fermentum iaculis eu non diam. Ac tincidunt " 
                        + "vitae semper quis lectus nulla at volutpat diam.",
                link: "www.linktoanotherwebsite.com"},
            {id: 2,
                title: "Pink Squirrel",
                imgSrc: "images/pinkSquirrel.jpg",
                description: "Justo eget magna fermentum",
                ingredients: "Odio, morbi, quis",
                instructions: "Luctus accumsan tortor posuere ac ut consequat semper. Justo eget magna.",
                link: "www.linktoanotherwebsite.com"},
            {id: 3,
                title: "Breadcrust",
                imgSrc: "images/breadcrust.jpg",
                description: "Elementum eu facilisis sed odio morbi quis. In fermentum posuere urna nec.",
                ingredients: "Condimentum mattis",
                instructions: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
                link: "www.linktoanotherwebsite.com"},
            {id: 4,
                title: "Humpy",
                imgSrc: "images/humpy.jpg",
                description: "Malesuada bibendum arcu vitae elementum curabitur vitae.",
                ingredients: "Porttitor lacus, luctus, accumsan tortor, posuere, ac ut consequat semper",
                instructions: "Commodo odio aenean sed adipiscing diam donec adipiscing. Justo eget magna fermentum iaculis eu non diam. ",
                link: "www.linktoanotherwebsite.com"},
            {id: 5,
                title: "Parachute PMD",
                imgSrc: "images/parachutePmd.jpg",
                description: "Consequat semper. Justo eget magna",
                ingredients: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt!",
                instructions: "At tellus at urna condimentum mattis pellentesque.",
                link: "www.linktoanotherwebsite.com"},
            {id: 6,
                title: "Prince Nymph",
                imgSrc: "images/princeNymph.jpg",
                description: "Justo eget magna fermentum",
                ingredients: "Adipiscing, elit, sed",
                instructions: "Felis eget nunc lobortis mattis aliquam faucibus purus. Malesuada bibendum arcu vitae " 
                        + "elementum curabitur vitae. Nulla aliquet porttitor lacus luctus accumsan tortor posuere.",
                link: "www.linktoanotherwebsite.com"},
            {id: 7,
                title: "Missing Link Caddis",
                imgSrc: "images/missingLinkCaddis.jpg",
                description: "Elementum eu facilisis sed odio morbi quis. In fermentum posuere urna nec.",
                ingredients: "Porttitor lacus, luctus, accumsan tortor, posuere, ac ut consequat semper",
                instructions: "Commodo odio aenean sed adipiscing diam donec adipiscing. Justo eget magna fermentum "
                        + "iaculis eu non diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod "
                        + "tempor incididunt! Commodo odio aenean sed adipiscing diam donec adipiscing. Justo eget magna " 
                        + "fermentum iaculis eu non diam. ",
                link: "www.linktoanotherwebsite.com"},
            {id: 8,
                title: "Hippie Stomper",
                imgSrc: "images/hippieStomper.jpg",
                description: "Malesuada bibendum arcu vitae elementum curabitur vitae.",
                ingredients: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt!",
                instructions: "At tellus at urna condimentum mattis pellentesque.",
                link: "www.linktoanotherwebsite.com"},
            {id: 9,
                title: "Pink Squirrel",
                imgSrc: "images/pinkSquirrel.jpg",
                description: "Justo eget magna fermentum",
                ingredients: "Odio, morbi, quis",
                instructions: "Felis eget nunc lobortis mattis aliquam faucibus purus. Malesuada bibendum arcu vitae " 
                        + "elementum curabitur vitae. Nulla aliquet porttitor lacus luctus accumsan tortor posuere.",
                link: "www.linktoanotherwebsite.com"},
            {id: 10,
                title: "Breadcrust",
                imgSrc: "images/breadcrust.jpg",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt " 
                        + "ut labore et dolore magna aliqua. Amet cursus sit amet dictum sit amet justo donec. Id porta " 
                        + "nibh venenatis cras sed felis eget.",
                ingredients: "Adipiscing, elit, sed",
                instructions: "Porttitor lacus luctus accumsan tortor posuere ac ut consequat semper. Justo eget magna " 
                        + "fermentum iaculis eu non diam. Ac tincidunt vitae semper quis lectus nulla at volutpat diam.",
                link: "www.linktoanotherwebsite.com"},
            {id: 11,
                title: "Humpy",
                imgSrc: "images/humpy.jpg",
                description: "Malesuada bibendum arcu vitae elementum curabitur vitae.",
                ingredients: "Condimentum mattis",
                instructions: "Commodo odio aenean sed adipiscing diam donec adipiscing. ",
                link: "www.linktoanotherwebsite.com"},
            {id: 12,
                title: "Parachute PMD",
                imgSrc: "images/parachutePmd.jpg",
                description: "Elementum eu facilisis sed odio morbi quis. In fermentum posuere urna nec. Elementum eu " 
                        + "facilisis sed odio morbi quis. In fermentum posuere urna nec.",
                ingredients: "The best ingredients",
                instructions: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt",
                link: "www.linktoanotherwebsite.com"},
            {id: 13,
                title: "Prince Nymph",
                imgSrc: "images/princeNymph.jpg",
                description: "Justo eget magna fermentum eu facilisis sed odio morbi quis. In fermentum posuere urna nec.",
                ingredients: "Porttitor lacus, luctus, accumsan tortor, posuere, ac ut consequat semper",
                instructions: "ommodo odio aenean sed adipiscing diam donec adipiscing. Justo eget magna fermentum iaculis eu non diam. ",
                link: "www.linktoanotherwebsite.com"},
            {id: 14,
                title: "Missing Link Caddis",
                imgSrc: "images/missingLinkCaddis.jpg",
                description: "Adipiscing, elit, sed",
                ingredients: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt!",
                instructions: "At tellus at urna condimentum mattis pellentesque. Lacus luctus accumsan tortor posuere ac. " + 
                        "Etiam tempor orci eu lobortis elementum nibh. Diam in arcu cursus euismod. Euismod lacinia at quis risus sed.",
                link: "www.linktoanotherwebsite.com"},
            {id: 15,
                title: "Hippie Stomper",
                imgSrc: "images/hippieStomper.jpg",
                description: "Malesuada bibendum arcu vitae elementum curabitur vitae.",
                ingredients: "Odio, morbi, quis, odio, morbi, quis",
                instructions: "Felis eget nunc lobortis mattis aliquam faucibus purus. Malesuada bibendum arcu vitae " 
                        + "elementum curabitur vitae. Nulla aliquet porttitor lacus luctus accumsan tortor posuere.",
                link: "www.linktoanotherwebsite.com"},
                
    ];
    
    return allRecipes;
}

/**
 * Assembles a bootstrap card and populates it with fly tying recipe data. 
 * Applies a display delay class depending on the index in a row.
 */
const buildCard = (cardInfo, cardIndex) => {
    let divCard = document.createElement('div');
    let img = document.createElement('img');
    let divCardBody = document.createElement('div');
    let h2 = document.createElement('h2');
    let pDescription = document.createElement('p');
    let pIngredients = document.createElement('p');
    let pInstructions = document.createElement('p');
    let link = document.createElement('a');
    let imgAlt = "A " + cardInfo.title + " fly fishing fly";

    // Add a display delay class depending on the index in a row
    if (cardIndex == 0) {
        divCard.setAttribute("class", "card mx-auto hide");
    } else if (cardIndex == 1) {
        divCard.setAttribute("class", "card mx-auto hide card2");
    } else if (cardIndex == 2) {
        divCard.setAttribute("class", "card mx-auto hide card3");
    }

    // Add attributes
    img.setAttribute("class", "card-img-top");
    img.setAttribute("src", cardInfo.imgSrc);
    img.setAttribute("alt", imgAlt);
    divCardBody.setAttribute("class", "card-body");
    h2.setAttribute("class", "card-title");
    pDescription.setAttribute("class", "card-text");
    pIngredients.setAttribute("class", "card-text");
    pInstructions.setAttribute("class", "card-text");
    link.setAttribute("href", cardInfo.link);
    link.setAttribute("class", "card-link");

    // Populate with recipe info
    h2.innerHTML = cardInfo.title;
    pDescription.innerHTML = "Description: " + cardInfo.description;
    pIngredients.innerHTML = "Ingredients: " + cardInfo.ingredients;
    pInstructions.innerHTML = "Tying Instructions: " + cardInfo.instructions;
    link.innerHTML = cardInfo.link;

    // Append elements together
    divCardBody.appendChild(h2);
    divCardBody.appendChild(pDescription);
    divCardBody.appendChild(pIngredients);
    divCardBody.appendChild(pInstructions);
    divCardBody.appendChild(link);

    divCard.appendChild(img);
    divCard.appendChild(divCardBody);

    return divCard;
}

/**
 * Outputs cards on a small screen.
 * A small screen has one card per row.
 */
const outputSmallCards = (outputArea, allRecipes) => {
    let outputDiv = document.createElement('div');

    allRecipes.forEach((recipe) => {
        let divContainer = document.createElement('div');
        let divRow = document.createElement('div');
        let divCol = document.createElement('div');
        let card = buildCard(recipe, 0);

        // Add attributes
        divContainer.setAttribute("class", "flex-container");
        divRow.setAttribute("class", "row g-5 mb-5");
        divCol.setAttribute("class", "col");

        // Append elements together
        divCol.appendChild(card);
        divRow.appendChild(divCol);
        divContainer.appendChild(divRow);
        outputDiv.appendChild(divContainer);
    });

    // Append everything to the page at once in order to increase performance
    outputArea.appendChild(outputDiv);
}

/**
 * Creates an empty card used to make correct spacing on a large screen
 * where there is only one or two cards in a three card row. Result is that
 * the last one or two cards aligns left.
 * 
 * Source: 
 * https://accessibilityinsights.io/info-examples/web/aria-hidden-focus/
 */
const buildEmptyCard = () => {
    let divCard = document.createElement('div');

    divCard.setAttribute("class", "card mx-auto invisible");
    divCard.setAttribute("aria-hidden", "true");
    divCard.setAttribute("tabindex", "-1");
    return divCard;
}

/**
 * Creates a row with three cards in it for large screens.
 */
const buildLargeRow = (recipes) => {
    let divContainer = document.createElement('div');
    let divRow = document.createElement('div');
    let divCol1 = document.createElement('div');
    let divCol2 = document.createElement('div');
    let divCol3 = document.createElement('div');

    // Add attributes
    divContainer.setAttribute("class", "flex-container");
    divRow.setAttribute("class", "row g-5 mb-5");
    divCol1.setAttribute("class", "col");
    divCol2.setAttribute("class", "col");
    divCol3.setAttribute("class", "col");

    // Append elements together
    divCol1.appendChild(buildCard(recipes[0], 0));

    // Handle a row with 1, 2, or 3 cards
    if (recipes.length == 3) {
        divCol2.appendChild(buildCard(recipes[1], 1));
        divCol3.appendChild(buildCard(recipes[2], 2));
    } else if (recipes.length == 2) {
        // Append 1 empty card
        divCol2.appendChild(buildCard(recipes[1], 1));
        divCol3.appendChild(buildEmptyCard());

    } else if (recipes.length == 1) {
        // Append 2 empty cards
        divCol2.appendChild(buildEmptyCard());
        divCol3.appendChild(buildEmptyCard());
    }

    divRow.appendChild(divCol1);
    divRow.appendChild(divCol2);
    divRow.appendChild(divCol3);
    divContainer.appendChild(divRow);

    return divContainer;
}

/**
 * Outputs cards on a large screen.
 * A large screen has three cards per row.
 * 
 * Sources: 
 * https://stackoverflow.com/questions/8495687/split-array-into-chunks
 */
const outputLargeCards = (outputArea, allRecipes) => {
    const rowLength = 3;
    let outputDiv = document.createElement('div');

    // Iterate over three recipes at once
    for (let i = 0; i < allRecipes.length; i += rowLength) {

        const recipeRow = allRecipes.slice(i, i + rowLength); // A slice of three recipes

        // Build a row with the three recipes
        outputDiv.appendChild(buildLargeRow(recipeRow));
    }

    // Append everything at once in order to increase performance
    outputArea.appendChild(outputDiv);
}

/**
 * Controller to output cards to the screen.
 * 
 * Clears the output area, determines if output should be for a 
 * small or large screen, outputs the fly recipe cards, and starts
 * the interaction observer (for scroll animation).
 */
const outputCards = (outputArea, currentWindow, allRecipes) => {

    // Clear output area
    outputArea.innerHTML = "";

    if ((currentWindow.size == "small") && (allRecipes.length > 0)) {
        outputSmallCards(outputArea, allRecipes);
        startObserver();

    } else if ((currentWindow.size == "large") && (allRecipes.length > 0)){
        outputLargeCards(outputArea, allRecipes);
        startObserver();
    }
}

/**
 * Monitors if the window size changes between small and large breakpoints.
 */
const reviewRows = (outputArea, currentWindow, allRecipes) => {
    newWindow = new CurrentWindow(); 

    if (newWindow.size != currentWindow.size) {

        // Reassign currentWindow
        currentWindow.width = newWindow.width;
        currentWindow.size = newWindow.size;

        outputCards(outputArea, currentWindow, allRecipes);
    }
}

// Initialize the page when the window loads
window.onload = init;
