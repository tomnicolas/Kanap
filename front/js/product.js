const str = window.location.href
const url = new URL(str);
const id = url.searchParams.get("id");

fetch(`http://localhost:3000/api/products/${id}`)
    .then(response => response.json())
    .then(kanap => displayKanap(kanap))
    .catch(error => alert('Erreur!',error))


function displayKanap(kanap) {
    const img = document.querySelector('.item__img').innerHTML = `<img src="${kanap.imageUrl}" alt="${kanap.altTxt}"></img>`
    const title = document.querySelector('#title').textContent = `${kanap.name}`
    const price = document.querySelector('#price').textContent = `${kanap.price}`
    const description = document.querySelector('#description').textContent = `${kanap.description}`
    for (clr of kanap.colors) {
        const colors = document.querySelector('#colors').innerHTML += `<option value="${clr}">${clr}</option>`
    } 
}

function saveCart(cart){
    localStorage.setItem("cart", JSON.stringify(cart))
    alert('Produit ajouté au panier')
}
function addKanap(){
    let kanap = {
        _id : id,
        _quantity : +document.querySelector('#quantity').value,
        _color : document.querySelector('#colors').value,
    }
    return kanap
}

function getCart(){
    let cart = localStorage.getItem('cart')
    if (cart == null){
        return []
    } else {
        return JSON.parse(cart)
    }
}

function checkKanapInCart(){
    let cart = getCart()
    let foundkanap = cart.find(k => k._id == id && k._color == document.querySelector('#colors').value)
    if (foundkanap != undefined){
        foundkanap._quantity = +foundkanap._quantity + +document.querySelector('#quantity').value
    } else {
        let kanap = {
            _id : id,
            _quantity : document.querySelector('#quantity').value,
            _color : document.querySelector('#colors').value,
        }
        cart.push(kanap)
    }
     saveCart(cart)
}

function addInCart(){
    if ((document.querySelector('#quantity').value != 0) && (document.querySelector('#colors').value != '')){
        checkKanapInCart()
    }else {
        alert('Veuillez selectionner une couleur et une quantité')
    }
} 

document.querySelector('#addToCart').addEventListener('click', addInCart) 