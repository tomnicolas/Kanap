fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(products => displayProducts(products))
    .catch(error => alert('Erreur!',error))

function displayProducts(products) {
        for (product of products) {
            let products = document.getElementById('items').innerHTML +=    
                `<a href="./product.html?id=${product._id}">
                <article>
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                </article>
                </a>`;
            }      
        }   