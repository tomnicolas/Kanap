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

// ORDER  -------------------------------------------------------

let regexName = /^[A-Za-zÀ-ÿ]+$/
let regexAddress = /^[0-9A-Za-zÀ-ÿ-.,' ]+$/
let regexCity = /^[A-Za-zÀ-ÿ-',.]+$/
let regexEmail = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
let contactInfos = {}

function fieldValidation(field, regex, text, evt){
	if (!regex.test(document.getElementById(field).value)) {
		document.getElementById(`${field}ErrorMsg`).innerText = `Veuillez entrer ${text} valide`
		contactInfos[`${field}`] = false
		return order
	}
	else {
		document.getElementById(`${field}ErrorMsg`).innerText = ''
		contactInfos[`${field}`] = document.getElementById(field).value
		return order
	}
}

document.getElementById("firstName").addEventListener('change', (evt) => fieldValidation('firstName',regexName, 'un nom', evt))
document.getElementById("lastName").addEventListener('change', (evt) => fieldValidation('lastName',regexName, 'un nom', evt))
document.getElementById("address").addEventListener('change', (evt) => fieldValidation('address',regexAddress, 'une adresse', evt))
document.getElementById("city").addEventListener('change', (evt) => fieldValidation('city',regexCity, 'une ville', evt))
document.getElementById("email").addEventListener('change', (evt) => fieldValidation('email',regexEmail, 'un email', evt))

function validationForm(){
	if ((Object.keys(contactInfos).length == 5) && (localStorage.getItem('cart') !== null)){			
		if (Object.values(contactInfos).includes(false)){
			return false	
		}else {
			return true
		}
	} else {
		return false
}
}
function setOrder(){
	let order = {
		contact: contactInfos,
		products: getProductsId()
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

document.getElementById("order").addEventListener('click', submitOrder)

