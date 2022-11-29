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
			deleteProduct(btn.closest("article").getAttribute("data-id"),
			btn.closest("article").getAttribute("data-color"))
	})
})  
	const quantityButton = document.querySelectorAll(".itemQuantity")
	quantityButton.forEach((quantity) => {
	  	quantity.addEventListener("change", () => {
			changeQuantity(quantity.closest("article").getAttribute("data-id"),
			quantity.closest("article").getAttribute("data-color"),
			quantity.value);
	  })
	})
}

function completeCart() {
	let cart = getCart()
	cart.forEach(product => getProductsData(product))
}  

window.addEventListener("load", (e) => {
	completeCart();
})