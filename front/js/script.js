//Get products data from API
//return {promise} in JS {object}
//send it to displayKanap()
//if failed, display an alert 'error'
fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(products => displayKanaps(products))
    .catch(error => alert('Erreur!',error))


// Generate HTML code displaying all the informations, for each product in API
function displayKanaps(products) {
        products.forEach((product) => {
            document.querySelector('#items').innerHTML +=    
                `<a href="./product.html?id=${product._id}">
                <article>
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                </article>
                </a>`;            
        })
}