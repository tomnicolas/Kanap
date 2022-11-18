const str = window.location.href
var url = new URL(str);
const id = url.searchParams.get("id");
let color = ''
console.log(id);

fetch(`http://localhost:3000/api/products/${id}`)
    .then(response => response.json())
    .then(product => displayProduct(product))
    .catch(error => alert('Erreur!',error))


function displayProduct(product) {
    const img = document.querySelector('.item__img').innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}"></img>`
    const title = document.querySelector('#title').textContent = `${product.name}`
    const price = document.querySelector('#price').textContent = `${product.price}`
    const description = document.querySelector('#description').textContent = `${product.description}`
    for (clr of product.colors) {
        const colors = document.querySelector('#colors').innerHTML += `<option value="${clr}">${clr}</option>`
    } 

}

/* document.querySelector('#quantity').addEventListener('change', (e) => {
    const quantity = e.target.value
})
console.log(quantity) */


/* function getQuantity() {
    const quantity = document.querySelector('#quantity').value;
    return quantity
} */

/* function getColor() {
    const color = document.querySelector('#colors').value;
    return color
}

const addProduct = {
    _id : id,
    _quantity : quantity,
    _color : color,
}

console.log(addProduct) */
/* const addInCart = JSON.stringify(addProduct);
localStorage.setItem("obj",addInCart);
console.log(addInCart) */

