// Get the ID of the product from URL of the page
const url = new URL(window.location.href);
const id = url.searchParams.get("id");

document.getElementById("orderId").innerText = id