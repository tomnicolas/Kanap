fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .then(kanaps => displayKanaps(kanaps))
    .catch(error => alert('Erreur!',error))

function displayKanaps(kanaps) {
        kanaps.forEach((kanap) => {
            document.querySelector('#items').innerHTML +=    
                `<a href="./product.html?id=${kanap._id}">
                <article>
                    <img src="${kanap.imageUrl}" alt="${kanap.altTxt}">
                    <h3 class="productName">${kanap.name}</h3>
                    <p class="productDescription">${kanap.description}</p>
                </article>
                </a>`;            
        })
    }