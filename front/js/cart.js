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

function changeQuantity(id, color, quantity) {
	let cart = getCart();
	let foundproduct = cart.find((p) => p._color == color && p._id == id);
	foundproduct._quantity = quantity;
	localStorage.setItem("cart", JSON.stringify(cart))
	window.location.reload()
}

function deleteProduct(id, color) {
	let cart = getCart();
	cart = cart.filter((p) => p._color !== color || p._id !== id);
	localStorage.setItem("cart", JSON.stringify(cart))
	alert('Produit supprimer!')
	window.location.reload()
}

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
	totalPrice = prices.reduce((a, b)=> a + b,0)
	quantities.push(parseInt(productdt.quantity))
	totalProducts = quantities.reduce((a, b)=> a + b,0)

	displayProductInCart(productdt)
	addEvents()
}

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

window.addEventListener("load", (e) => {
	let cart = getCart()
	cart.forEach(product => getProductsData(product))
})

// FORM  -------------------------------------------------------

let regexName = /^[A-Za-zÀ-ÿ]+$/
let regexAddress = /^[0-9A-Za-zÀ-ÿ-.,' ]+$/
let regexCity = /^[A-Za-zÀ-ÿ-',.]+$/
let regexEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

function firstNameValidation(){
	if (!regexName.test(document.getElementById("firstName").value)) {
		document.getElementById("firstNameErrorMsg").innerText = 'Ce champ ne doit contenir que des lettres'
		return false
	}
	else {
		document.getElementById("firstNameErrorMsg").innerText = ''
		return document.getElementById("firstName").value
	}
}
document.getElementById("firstName").addEventListener('change', firstNameValidation)

function lastNameValidation(){
	if (!regexName.test(document.getElementById("lastName").value)) {
		document.getElementById("lastNameErrorMsg").innerText = 'Ce champ ne doit contenir que des lettres'
		return false
	}
	else {
		document.getElementById("lastNameErrorMsg").innerText = ''
		return document.getElementById("lastName").value
	}
}
document.getElementById("lastName").addEventListener('change', lastNameValidation)

function addressValidation(){
	if (!regexAddress.test(document.getElementById("address").value)) {
		document.getElementById("addressErrorMsg").innerText = 'Veuillez entrer une adresse valide'
		return false
	}
	else {
		document.getElementById("addressErrorMsg").innerText = ''
		return document.getElementById("address").value
	}
}
document.getElementById("address").addEventListener('change', addressValidation)

function cityValidation(){
	if (!regexCity.test(document.getElementById("city").value)) {
		document.getElementById("cityErrorMsg").innerText = 'Veuillez entrer un nom de ville valide'
		return false
	}
	else {
		document.getElementById("cityErrorMsg").innerText = ''
		return document.getElementById("city").value
	}
}
document.getElementById("city").addEventListener('change', cityValidation)

function emailValidation(){
	if (!regexEmail.test(document.getElementById("email").value)) {
		document.getElementById("emailErrorMsg").innerText = 'Veuillez entrer un email valide'
		return false
	}
	else {
		document.getElementById("emailErrorMsg").innerText = ''
		return document.getElementById("email").value
	}
}
document.getElementById("email").addEventListener('change', emailValidation)

function validationForm(){
	if (firstNameValidation()!== false && 
	lastNameValidation()!== false && 
	addressValidation()!== false && 
	emailValidation()!== false && 
	cityValidation() !== false && 
	(localStorage.getItem('cart') !== null)){	
		return true	
	} else {
		return false
	}
}

function setOrder(){
	let order = {
		contact : {
			firstName : document.getElementById("firstName").value,
			lastName : document.getElementById("lastName").value,
			address : document.getElementById("address").value,
			city : document.getElementById("city").value,
			email : document.getElementById("email").value
		},
		products : getProductsId()
	}
	return order

}

function getProductsId() {
	let productsId = []
	let cart = getCart()
	cart.forEach((product) => {
	  	productsId.push(product._id);
	})
	return productsId
  }
  

function submitOrder() {
	if (validationForm()) {
		setOrder()
		localStorage.setItem("order", JSON.stringify(setOrder()))
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
		alert('Commande validée')
	} else {
		if (localStorage.getItem('cart') == null){
			alert('Votre panier est vide')
		} else {
			alert('Veuillez renseigner les informations demandées')
		}
	}
}

document.getElementById("order").addEventListener('click', submitOrder)

