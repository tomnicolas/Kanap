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

function addInCart(){
    let cart = {
        _id : id,
        _quantity : document.querySelector('#quantity').value,
        _color : document.querySelector('#colors').value,
    }
    localStorage.setItem("cart", JSON.stringify(cart))
}
document.querySelector('#addToCart').addEventListener('click', addInCart)

/* }
if (quantity != 0) {
    return quantity
} else {
    alert('Veuillez selectionner une quantité')
}
if (color != ''){
    return color
} else {
    alert('Veuillez selectionner une couleur')
}
const quantity = 0
document.querySelector('#quantity').addEventListener('change', (e) => {
    const quantity = e.target.value
    return quantity
    console.log(quantity)
})
const color = ''
document.querySelector('#colors').addEventListener('change', (e) => {
    const color = e.target.value
    return color'#quantity'
    console.log(color)
})


document.querySelector('#addToCart').addEventListener('click', addProductToCart) 
    function addProductToCart(){
        const addProduct = {
            _id : id,
            _quantity : quantity,
            _color : color,
        }
        console.log(addProduct)
    }
 */
/* const addInCart = JSON.stringify(addProduct);
localStorage.setItem("obj",addInCart);
console.log(addInCart) */

