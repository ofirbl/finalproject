// variables

let cartBtn = document.querySelector(".cart-btn");
let closeCartBtn = document.querySelector(".close-cart");
let clearCartBtn = document.querySelector(".clear-cart");
let cartDOM = document.querySelector(".cart");
let cartOverlay = document.querySelector(".cart-overlay");
let cartItems = document.querySelector(".cart-items");
let cartTotal = document.querySelector(".cart-total");
let cartContent = document.querySelector(".cart-content");
let productsDOM = document.querySelector(".products-content");





let cart = [];
let buttonsDOM = [];





// get products
class Products {
    async getProducts(){
        try {
            let result = await fetch("products.json");
            let data = await result.json();
            let products = data.items;
            return products;
        } catch(error){
            console.log(error);
        }
    }
}

// display products
class UI {


    

    displayProducts(products){
        
        let result = '';
        let reusltMen = '';
        let resultWomen = '';

        products.forEach(product => {
            if(product.gender == "men")
            {
                
                reusltMen += `
            <div class="product">
                <div class="img-container">
                    <img src=${product.image}
                    alt="product"
                    class="product-img"/>
                    
                </div>
                <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        Add to cart
                    </button>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </div>
            `;
            }

            if(product.gender == "women")
            {
                
                resultWomen += `
            <div class="product">
                <div class="img-container">
                    <img src=${product.image}
                    alt="product"
                    class="product-img"/> 
                    
                </div>
                <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        Add to cart
                    </button>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </div>
            `;
            }

            


            result += `
            <div class="product">
                <div class="img-container">
                    <img src=${product.image}
                    alt="product"
                    class="product-img"/>
                    
                </div>
                <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        Add to cart
                    </button>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </div>
            `;
            
        });
        
        
        
        
        if ( document.URL.includes("products-men.html") ) 
        {         
            productsDOM.innerHTML = reusltMen;
        }
        if ( document.URL.includes("products-women.html") ) 
        {        
            productsDOM.innerHTML = resultWomen;
        }
        if ( document.URL.includes("products.html") ) 
        {        
            productsDOM.innerHTML = result;
        }
        
        
        
        
        
    }
    getBagButtons(){
        let buttons = [...document.querySelectorAll(".bag-btn")]; 
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if(inCart){
                button.innerText = "In Cart";
                button.disabled = true;
            }          
            button.addEventListener('click',(event)=>{
                event.target.innerText = "In Cart";
                event.target.disabled = true;
                
                //get item from products
                let cartItem = {...Storage.getProduct(id),amount:1};
                // add to cart
                cart = [...cart, cartItem];
                // save cart in local storage
                Storage.saveCart(cart);
                // set cart value
                this.setCartValues(cart);
                //display item in cart
                this.addCartItem(cartItem);      
                //show cart
                this.showCart();
                
            });
            
        })
    }

    setCartValues(cart){
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
        
    }

    addCartItem(item){
        let div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `      
                    <img src=${item.image}>
                    <div>
                        <h4>${item.title}</h4>
                        <h5>$${item.price}</h5>
                        <span class="remove-item" data-id=${item.id}>remove</span>
                    </div>
                    <div>
                        <i class="fas fa-chevron-up" data-id=${item.id}></i>
                        <p class="item-amount">${item.amount}</p>
                        <i class="fas fa-chevron-down" data-id=${item.id}></i>
                    </div>
                </div>`;
        cartContent.appendChild(div); 
    }
    
    showCart(){
        cartOverlay.classList.add('transparentOverlay');
        cartDOM.classList.add('showCart');
    }

    hideCart(){
        cartOverlay.classList.remove('transparentOverlay');
        cartDOM.classList.remove('showCart');
    }

    setupApp(){
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }

    populateCart(cart){
        cart.forEach(item => this.addCartItem(item));
    }

    cartLogic(){
        // clear cart
        clearCartBtn.addEventListener('click',() => {
            this.clearCart();
        });
        // cart logic
        cartContent.addEventListener('click', event =>{
            if(event.target.classList.contains('remove-item')){
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            }
            else if(event.target.classList.contains("fa-chevron-up")){
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }
            else if(event.target.classList.contains("fa-chevron-down")){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                if(tempItem.amount > 0){
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else{
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        })
    }

    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length > 0){
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }

    removeItem(id){
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
    }

    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
    }

    
    
}

// local storage
class Storage {
    static saveProducts(products){
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }

    static saveCart(){
        localStorage.setItem('cart',JSON.stringify(cart));
    }

    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[];
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    
    const ui = new UI();
    const products = new Products();
    // setup app
    ui.setupApp();

    // get all the products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
        

        
        
        
}).then(()=>{
    ui.getBagButtons();
    ui.cartLogic();
    }).then(() => {
        
        
    });
    

})




