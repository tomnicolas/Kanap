let cart = JSON.parse(localStorage.getItem('cart'))
let productdt

async function getProductsData(cart){
	for (let product of cart){
		await fetch(`http://localhost:3000/api/products/${product._id}`)
			.then(res => res.json())
			.then(res => productdt = res)
			.catch(error => alert('Erreur!',error));
		if (!productdt){
			continue	
		}
		productdt.color = product._color;
		productdt.quantity = product._quantity;
		displayProductsInCart(productdt)
	}
	}

getProductsData(cart)


function displayProductsInCart(product){
	document.querySelector('#cart__items').innerHTML +=   
	`<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
		<div class="cart__item__img">
			<img src="${product.imageUrl}" alt="${product.altTxt}">
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
}