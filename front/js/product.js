// Get the ID of the product from URL of the page
const url = new URL(window.location.href);
const id = url.searchParams.get("id");


/** 
 * Get product data from API with ID
 * return {promise} in JS {object}
 * send it to displayKanap()
 * if failed, display an alert 'error'
 */
fetch(`http://localhost:3000/api/products/${id}`)
    .then(response => response.json())
    .then(kanap => displayKanap(kanap))
    .catch(error => alert('Erreur!',error))


// Generate HTML code displaying the informations of the product 
function displayKanap(kanap) {
    document.querySelector('.item__img').innerHTML = `<img src="${kanap.imageUrl}" alt="${kanap.altTxt}"></img>`
    document.querySelector('#title').textContent = `${kanap.name}`
    document.querySelector('#price').textContent = `${kanap.price}`
    document.querySelector('#description').textContent = `${kanap.description}`
    kanap.colors.forEach((clr) => {
        document.querySelector('#colors').innerHTML += `<option value="${clr}">${clr}</option>`
    })
}

// Get cart data in localstorage
function getCart(){
    let cart = localStorage.getItem('cart')
    if (cart == null){
    // if no data return empty [array]
        return []
    } else {
    // else, return array[] of {objects}
        return JSON.parse(cart)
    }
}

// Get data from getCart()
function checkKanapInCart(){
    let cart = getCart()
    // Check if product choosed by user (id, color) already exist in cart
    let foundkanap = cart.find(k => k._id == id && k._color == document.querySelector('#colors').value)
    if (foundkanap != undefined){
        // if so, add quantity selected to product in cart
        foundkanap._quantity = +foundkanap._quantity + +document.querySelector('#quantity').value
    } else {
        // create a product {object}
        //     param {id}
        //     param {quantity}
        //     param {color}
        let kanap = {
            _id : id,
            _quantity : document.querySelector('#quantity').value,
            _color : document.querySelector('#colors').value,
        }
        cart.push(kanap)
    }
    // reset the created product in cart and display an alert to validate product add to cart
    localStorage.setItem("cart", JSON.stringify(cart))
    alert('Produit ajouté au panier')
}


// Check if the quantity and color are selected by user
function addInCart(){
    if ((document.querySelector('#quantity').value != 0) && (document.querySelector('#colors').value != '')){
        // if quantity and color are different from default values, call checkKanapInCart()
        checkKanapInCart()
    }else {
        // if not, display alert message 
        alert('Veuillez selectionner une couleur et une quantité')
    }
} 
// Call addInCart() function when buton 'ajouter au panier ' is clicked
document.querySelector('#addToCart').addEventListener('click', addInCart) 