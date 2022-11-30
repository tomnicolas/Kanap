// Get the orderID of the product from URL of the page
const url = new URL(window.location.href);
const id = url.searchParams.get("id");

// Dislay the orderID 
document.getElementById("orderId").innerText = id