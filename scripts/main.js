import { card } from "../components/card.js";
import { tableRow } from "../components/table.js";
import { referenceList } from "../data/reference.js";
import { renderToDom } from "../utils/renderToDom.js";

// Reusable function to get the cards on the DOM
// .forEach()
const renderCards = (array) => {
  let refStuff = "";
  
  array.forEach((item)=>{
    refStuff += card(item);
  });
  renderToDom("#cards", refStuff)
}

// UPDATE/ADD ITEMS TO CART
// .findIndex() & (.includes() - string method)
const toggleCart = (event) => {
  if (event.target.id.includes("fav-btn")) {
  //  console.log('Clicked Fav btn')
    const [, id] = event.target.id.split("--");

    const index= referenceList.findIndex(taco => taco.id === Number(id))
    referenceList[index].inCart = !referenceList[index].inCart
    cartTotal();
    renderCards(referenceList);
  }
}

// SEARCH
// .filter()
const search = (event) => {
  const userInput = event.target.value.toLowerCase();
  console.log(userInput)
  const searchResult = referenceList.filter(taco => 
    taco.title.toLowerCase().includes(userInput) ||
    taco.author.toLowerCase().includes(userInput) ||
    taco.description.toLowerCase().includes(userInput) 
  )
  renderCards(searchResult);
}

// BUTTON FILTER
// .filter() & .reduce() &.sort() - chaining
const buttonFilter = (event) => {
  if(event.target.id.includes('free')) {
    console.log('FREE')
    // this needs to be set to a variable so that you can call in when you render it to dom. we are then setting it to refrenceList which is the name of the main array. then filter it based on the item when the item's price is less than or equal to 0 which makes it free. Lastly you need to use renderCards(the name of your new filtered array)
    const freeArray = referenceList.filter(item => item.price <= 0);
    renderCards(freeArray)
  }
  if(event.target.id.includes('cartFilter')) {
    const wishlistArray = referenceList.filter(item => item.inCart);
    renderCards(wishlistArray);
    console.log(wishlist)
  }
  if(event.target.id.includes('books')) {
    const booksArray = referenceList.filter(item => item.type.toLocaleLowerCase === "book");
    renderCards(booksArray)
    console.log('books!')
  }
  if(event.target.id.includes('clearFilter')) {
    // const clearFilterArray = referenceList.filter(item => item.)
    renderCards(referenceList)
    console.log('clearFilter')
  }
  if(event.target.id.includes('productList')) {
    let table = `<table class="table table-dark table-striped" style="width: 600px">
    <thead>
      <tr>
        <th scope="col">Title</th>
        <th scope="col">Type</th>
        <th scope="col">Price</th>
      </tr>
    </thead>
    <tbody>
    `;
    
    productList().sort((a,b)=> a.type.localeCompare(b.type)).forEach(item => {
      table += tableRow(item);
    });

    table += `</tbody></table>`

    renderToDom('#cards', table);
  }
  
}

// CALCULATE CART TOTAL
// .reduce() & .some()
const cartTotal = () => {
  const cart = referenceList.filter(taco => taco.inCart);
  const total = cart.reduce((value1,value2) => value1+value2.price ,0);
  const free = cart.some(taco => taco.price <= 0 );
  document.querySelector("#cartTotal").innerHTML = total.toFixed(2);

  if (free){
    document.querySelector("#includes-free").innerHTML = 'INCLUDES FREE ITEMS'
  } else {
    document.querySelector("#includes-free").innerHTML =''
    }
  
}

// RESHAPE DATA TO RENDER TO DOM
// .map()
const productList = () => {
  return referenceList.map(item => ({
    title: item.title, 
    price: item.price,
    type: item.type
  }))
}


const startApp = () => {
  // PUT ALL CARDS ON THE DOM
  renderCards(referenceList)

  // PUT CART TOTAL ON DOM
  cartTotal();

  // SELECT THE CARD DIV
  document.querySelector('#cards').addEventListener('click', toggleCart);

  // SELECT THE SEARCH INPUT
  document.querySelector('#searchInput').addEventListener('keyup', search)

  // SELECT BUTTON ROW DIV
  document.querySelector('#btnRow').addEventListener('click', buttonFilter);
}
startApp();
