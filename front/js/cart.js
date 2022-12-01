// Variable declaration
let prices = []
let totalPrice
let quantities = []
let totalProducts

// Get cart data from localstorage
//      if no data, return empty [array]
//      else, return array[] of {objects}
function getCart(){
    let cart = localStorage.getItem('cart')
    if (cart == null){
		document.querySelector('#cart__items').innerHTML += 
		`<p>Votre panier est vide</p>`
        return []
    } else {
        return JSON.parse(cart)
    }
}

// Get the products in the cart to change its quantity
// 		search for the product matching color and id
//		when found, change the quantity
//		send the cart back to LS
//		relaod the page
function changeQuantity(id, color, quantity) {
	let cart = getCart();
	let foundproduct = cart.find((p) => p._color == color && p._id == id);
	foundproduct._quantity = quantity;
	localStorage.setItem("cart", JSON.stringify(cart))
	window.location.reload()
}

// Get the products in the cart to delete it
//		filter the cart to only keep products with different id and color
//		send the cart back to LS
//		display alert 
//		relaod the page
function deleteProduct(id, color) {
	let cart = getCart();
	cart = cart.filter((p) => p._color !== color || p._id !== id);
	localStorage.setItem("cart", JSON.stringify(cart))
	alert('Produit supprimer!')
	window.location.reload()
}

// Complete the products datas in the cart from the API
//		fetch the datas from the API
//		add it to productDt with current datas of cart
//		push the price of the product in array "prices"
//		send the sum of the array "prices" in totalPrices
//		push the qauntity of the product in array "quantities"
//		send the sum of the array "quantities" in totalProducts
// 		call the displayProductInCart with the datas of product in param
//		call addEvents function
async function getProductsData(product) {
	let datas = await fetch(`http://localhost:3000/api/products/${product._id}`)
	.then(res => res.json())
	.then(datas => {return datas})
	
	const productdt = {
		id: product._id,
		color: product._color,
		quantity: product._quantity,
		price: datas.price,
		image: datas.imageUrl,
		altTxt: datas.altTxt,
	  	name: datas.name	  
	}

	prices.push(parseInt(productdt.quantity) * parseInt(productdt.price))
	totalPrice = prices.reduce((a, b)=> a + b)
	quantities.push(parseInt(productdt.quantity))
	totalProducts = quantities.reduce((a, b)=> a + b)

	displayProductInCart(productdt)
	addEvents()
}

// Generate HTML code displaying all the informations of the product and total price and total quantity of products
function displayProductInCart(product){	
	document.querySelector('#cart__items').innerHTML +=   
	`<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
		<div class="cart__item__img">
			<img src="${product.image}" alt="${product.altTxt}">
		</div>
		<div class="cart__item__content">
			<div class="cart__item__content__description">
				<h2>${product.name}</h2>
				<p>${product.color}</p>
				<p>${product.price}</p>
			</div>
			<div class="cart__item__content__settings">
				<div class="cart__item__content__settings__quantity">
					<p>Qté : </p>
					<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
				</div>
				<div class="cart__item__content__settings__delete">
					<p class="deleteItem">Supprimer</p>
				</div>
			</div>
		</div>
 	</article>`;
	document.getElementById("totalPrice").innerHTML = totalPrice
	document.getElementById("totalQuantity").innerHTML = totalProducts;
}

// Set eventlistener on delete and quantity buttons and get the id and color datas of the product 
function addEvents() {
	const delButtons = document.querySelectorAll(".deleteItem")
	delButtons.forEach((btn) => {
		btn.addEventListener("click", () => {
			deleteProduct(
				btn.closest("article").getAttribute("data-id"),
				btn.closest("article").getAttribute("data-color"))
		})
	})  
	const quantityButton = document.querySelectorAll(".itemQuantity")
	quantityButton.forEach((quantity) => {
	  	quantity.addEventListener("change", () => {
			changeQuantity(
				quantity.closest("article").getAttribute("data-id"),
				quantity.closest("article").getAttribute("data-color"),
				quantity.value);
	  	})
	})
}

// On page load, get the datas from the cart and call getProductsData for each product in the cart
window.addEventListener("load", (e) => {
	let cart = getCart()
	cart.forEach(product => getProductsData(product))
})

// ------------------- ORDER -------------------

// Variables declaration
let regex = {
	Name: /^[A-Za-zÀ-ÿ]+$/,
	Address: /^[0-9A-Za-zÀ-ÿ-.,' ]+$/,
	City: /^[A-Za-zÀ-ÿ-',.]+$/,
	Email: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
}
let contactInfos = {}

// Validate the field with associated regex
// 		if error display message and push false field in contactInfos
// 		if valide entry push entry in contactInfos
//		return contacInfos
function fieldValidation(field, regex, text, evt){
	if (!regex.test(document.getElementById(field).value)) {
		document.getElementById(`${field}ErrorMsg`).innerText = `Veuillez entrer ${text} valide`
		contactInfos[`${field}`] = false
	}
	else {
		document.getElementById(`${field}ErrorMsg`).innerText = ''
		contactInfos[`${field}`] = document.getElementById(field).value
	} 
	return contactInfos
}

// Set the eventlistener for form fields on change
document.getElementById("firstName").addEventListener('change', (evt) => fieldValidation('firstName',regex.Name, 'un nom', evt))
document.getElementById("lastName").addEventListener('change', (evt) => fieldValidation('lastName',regex.Name, 'un nom', evt))
document.getElementById("address").addEventListener('change', (evt) => fieldValidation('address',regex.Address, 'une adresse', evt))
document.getElementById("city").addEventListener('change', (evt) => fieldValidation('city',regex.City, 'une ville', evt))
document.getElementById("email").addEventListener('change', (evt) => fieldValidation('email',regex.Email, 'une adresse email', evt))

// Check if the form is complete and valide and the cart is not empty
// 		return boolean
function validationForm(){
	let res = false
	if ((Object.keys(contactInfos).length == 5) && (localStorage.getItem('cart') !== null) && (!Object.values(contactInfos).includes(false))){
			res = true
	}return res
}

// Set order infos (contact, cart)
function setOrder(){
	let order = {
		contact: contactInfos,
		products: getProductsId()
	}
	return order
}

// Get the IDs of every product in cart and push it in productId
function getProductsId() {
	let productsId = []
	let cart = getCart()
	cart.forEach((product) => {
	  	productsId.push(product._id);
	})
	return productsId
  }
  
// Send order infos to API if form is valide
// 		if valide go to confirmation page
// 		if not and empty cart , alert empty cart
//		if not valide and cart not empty, alert complete the form
function submitOrder() {
	if (validationForm()) {
		setOrder()
		fetch("http://localhost:3000/api/products/order", {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify(setOrder()),
			})
      		.then((res) => res.json())
      		.then((data) =>{
				const orderId = data.orderId
        		window.location.href ='./confirmation.html?id='+ orderId;			
      		})
			.catch(error => alert('Erreur!',error))
		alert('Commande validée')
	} else {
		if (localStorage.getItem('cart') == null){
			alert('Votre panier est vide')
		} else {
			alert('Veuillez renseigner les informations demandées')
		}
	} 
}

// Set eventlistener on click call submitOrder
document.getElementById("order").addEventListener('click', submitOrder)

