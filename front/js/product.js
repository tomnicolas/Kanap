// Get the ID of the product from URL of the page
const url = new URL(window.location.href);
const id = url.searchParams.get("id");

// Get product data from API with ID
// return {promise} in JS {object}
// call displayproduct() with product data
// if failed, display an alert 'error'
fetch(`http://localhost:3000/api/products/${id}`)
    .then(res => res.json())
    .then(product => displayproduct(product))
    .catch(error => alert('Erreur!',error))

// Generate HTML code displaying the informations of the product 
//  display image
//      --  name
//      --  price
//      --  description
//      --  every colors of product
function displayproduct(product) {
    document.querySelector('.item__img').innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`
    document.querySelector('#title').textContent = `${product.name}`
    document.querySelector('#price').textContent = `${product.price}`
    document.querySelector('#description').textContent = `${product.description}`
    product.colors.forEach((clr) => {
        document.querySelector('#colors').innerHTML += `<option value="${clr}">${clr}</option>`
    })
}

// Get cart data from localstorage
//      if no data, return empty [array]
//      else, return array[] of {objects}
function getCart(){
    let cart = localStorage.getItem('cart')
    if (cart == null){
        return []
    } else {
        return JSON.parse(cart)
    }
}

// Check if the product chosen by user (id, color) already exist in cart
//      if so, add quantity selected to product in cart
//      else create a product {object}
//           param {id}
//           param {quantity}
//           param {color}
// push the created product in cart
// reset the cart in localstorage and display an alert to validate product add to cart
function checkProductInCart(){
    let cart = getCart()    
    let foundproduct = cart.find(p => p._id == id && p._color == document.querySelector('#colors').value)
    if (foundproduct != undefined){
        foundproduct._quantity = +foundproduct._quantity + +document.querySelector('#quantity').value
    } else {
        let product = {
            _id : id,
            _quantity : document.querySelector('#quantity').value,
            _color : document.querySelector('#colors').value,
        }
        cart.push(product)
    }
    localStorage.setItem("cart", JSON.stringify(cart))
    alert('Produit ajouté au panier')
}


// Check if the quantity and color are selected by user
//      if quantity and color are different from default values, call checkpProductInCart()
//      if not, display alert message 
function addInCart(){
    if ((document.querySelector('#quantity').value != 0) && (document.querySelector('#colors').value != '')){
        checkProductInCart()
    }else {
        alert('Veuillez selectionner une couleur et une quantité')
    }
} 

// Call addInCart() function when button 'ajouter au panier ' is clicked
document.querySelector('#addToCart').addEventListener('click', addInCart) 