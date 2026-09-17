if (window.location.protocol === 'file:') {
    window.location.replace(`http://localhost/responsive-watches-website-main/index.html${window.location.hash}`)
}

/*=============== SHOW & CLOSE MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/* Show menu */
if(navToggle){
   navToggle.addEventListener('click', () =>{
      navMenu.classList.add('show-menu')
   })
}

/* Hide menu */
if(navClose){
   navClose.addEventListener('click', () =>{
      navMenu.classList.remove('show-menu')
   })
}

/*=============== REMOVE MOBILE MENU ===============*/
const navLink = document.querySelectorAll('.nav__link')
const revealItems = document.querySelectorAll('.featured__card, .products__card, .new__card, .section__title, .story__container, .newsletter__bg, .tracker__result')

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return
            entry.target.classList.add('is-visible')
            revealObserver.unobserve(entry.target)
        })
    }, { threshold: .12 })
    revealItems.forEach(item => revealObserver.observe(item))
} else {
    revealItems.forEach(item => item.classList.add('is-visible'))
}

const linkAction = () =>{
   const navMenu = document.getElementById('nav-menu')
   // When we click on each nav__link, we remove the show-menu class
   navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== CHANGE HEADER STYLES ===============*/
const scrollHeader = () =>{
   const header = document.getElementById('header')
    window.scrollY >= 50 ? header.classList.add('scroll-header') 
                                 : header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*=============== TESTIMONIAL SWIPER ===============*/
let testimonialSwiper = new Swiper(".testimonial-swiper", {
    spaceBetween: 30,
    loop: 'true',

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

/*=============== NEW SWIPER ===============*/
let newSwiper = new Swiper(".new-swiper", {
    spaceBetween: 24,
    loop: 'true',

    breakpoints: {
        576: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
    },
});

/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () =>{
	const scrollUp = document.getElementById('scroll-up')
   // Add the .scroll-header class if the bottom scroll of the viewport is greater than 350
    window.scrollY >= 350 ? scrollUp.classList.add('show-scroll')
                               : scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

// Link the ID of each section (section id="home") to each link (a href="#home") 
// and activate the link with the class .active-link
const scrollActive = () => {
   // We get the position by scrolling down
   const scrollY = window.scrollY

   sections.forEach(section => {
      const id = section.id, // id of each section
            top = section.offsetTop - 50, // Distance from the top edge
            height = section.offsetHeight, // Element height
            link = document.querySelector('.nav__menu a[href*=' + id + ']') // id nav link

      if(!link) return

      link.classList.toggle('active-link', scrollY > top && scrollY <= top + height)
   })
}
window.addEventListener('scroll', scrollActive)

/*=============== SHOW CART ===============*/
const cart = document.getElementById('cart'),
      cartShop = document.getElementById('cart-shop'),
      cartClose = document.getElementById('cart-close')
const wishlist = document.getElementById('wishlist')
const wishlistShop = document.getElementById('wishlist-shop')
const wishlistClose = document.getElementById('wishlist-close')
const wishlistContainer = document.getElementById('wishlist-container')
const wishlistCount = document.getElementById('wishlist-count')
const storeToast = document.getElementById('store-toast')
let toastTimer

const showToast = (message, isError = false) => {
    clearTimeout(toastTimer)
    storeToast.textContent = message
    storeToast.classList.toggle('is-error', isError)
    storeToast.classList.add('is-visible')
    toastTimer = setTimeout(() => storeToast.classList.remove('is-visible'), 2600)
}

/*===== CART SHOW =====*/
/* Validate if constant exists */
if(cartShop){
    cartShop.addEventListener('click', () =>{
        cart.classList.add('show-cart')
    })
}

/*===== CART HIDDEN =====*/
/* Validate if constant exists */
if(cartClose){
    cartClose.addEventListener('click', () =>{
        cart.classList.remove('show-cart')
    })
}

const showWishlist = visible => {
    wishlist.classList.toggle('show-wishlist', visible)
    wishlist.setAttribute('aria-hidden', String(!visible))
}

if (wishlistShop) wishlistShop.addEventListener('click', () => showWishlist(true))
if (wishlistClose) wishlistClose.addEventListener('click', () => showWishlist(false))

/*=============== PRODUCTS AND CART ===============*/
const cartContainer = document.querySelector('.cart__container')
const cartItemCount = document.querySelector('.cart__prices-item')
const cartTotal = document.querySelector('.cart__prices-total')
const cartMessage = document.getElementById('cart-message')
const checkoutForm = document.getElementById('checkout-form')
const authModal = document.getElementById('auth-modal')
const authMessage = document.getElementById('auth-message')
const authForms = document.getElementById('auth-forms')
const authSignedIn = document.getElementById('auth-signed-in')
const authUserName = document.getElementById('auth-user-name')
const accountLabel = document.getElementById('account-label')
const authTitle = document.getElementById('auth-title')
const authIntro = document.getElementById('auth-intro')
const purchases = document.getElementById('purchases')
const purchasesMessage = document.getElementById('purchases-message')
const purchasesOrders = document.getElementById('purchases-orders')
const purchasesTracker = document.getElementById('purchases-tracker')
const purchasesSelected = document.getElementById('purchases-selected')
const purchaseTrackerResult = document.getElementById('purchase-tracker-result')
const purchaseTrackingMap = document.getElementById('purchase-tracking-map')
let customerPurchases = []
let selectedPurchaseTab = 'all'
let purchaseTrackingRefresh
let purchaseTrackingMapInstance
let orderBeingCancelled = null
const cancelModal = document.getElementById('cancel-modal')
const cancelForm = document.getElementById('cancel-form')
const cancelMessage = document.getElementById('cancel-message')
const cancelNoteLabel = document.getElementById('cancel-note-label')
let currentCustomer = null
const useLocationButton = document.getElementById('use-location')
const locationStatus = document.getElementById('location-status')
let customerCoordinates = { latitude: null, longitude: null }
const addressCountry = document.getElementById('address-country')
const addressRegion = document.getElementById('address-region')
const addressCity = document.getElementById('address-city')
const cartStorageKey = 'watch-store-cart'
const wishlistStorageKey = 'watch-store-wishlist'

const setAuthState = user => {
    currentCustomer = user
    const signedIn = Boolean(user)
    accountLabel.textContent = signedIn ? user.name.split(' ')[0] : 'Account'
    authForms.hidden = signedIn
    authSignedIn.hidden = !signedIn
    authUserName.textContent = signedIn ? user.name : ''

    const nameInput = checkoutForm.elements.namedItem('name')
    const emailInput = checkoutForm.elements.namedItem('email')
    if (signedIn) {
        nameInput.value = user.name
        emailInput.value = user.email
        renderCart()
    } else {
        if (purchaseTrackingRefresh) clearInterval(purchaseTrackingRefresh)
        showPurchases(false)
    }
}

const openAuthModal = (forCheckout = false) => {
    authTitle.textContent = forCheckout ? 'Sign in to order' : 'Your account'
    authIntro.textContent = forCheckout
        ? 'Please sign in or create an account before placing your order.'
        : 'Browse freely. Sign in when you are ready to place an order.'
    authModal.classList.add('is-visible')
    authModal.setAttribute('aria-hidden', 'false')
}

const closeAuthModal = () => {
    authModal.classList.remove('is-visible')
    authModal.setAttribute('aria-hidden', 'true')
    authMessage.textContent = ''
}

const showPurchases = visible => {
    purchases.classList.toggle('show-purchases', visible)
    purchases.setAttribute('aria-hidden', String(!visible))
    if (visible) loadPurchases()
}

const getPurchaseCategory = order => {
    if (order.status === 'cancelled') return 'cancelled'
    if (order.status === 'delivered') return 'completed'
    if (order.status === 'pending') return 'to-pay'
    if (order.status === 'shipped' || order.hasCourier) return 'to-receive'
    return 'to-ship'
}

const purchaseCategoryLabel = category => ({
    'to-pay': 'To Pay',
    'to-ship': 'To Ship',
    'to-receive': 'To Receive',
    completed: 'Completed',
    'return-refund': 'Return/Refund',
    cancelled: 'Cancelled'
}[category] || 'All')

const renderPurchases = () => {
    const filtered = selectedPurchaseTab === 'all'
        ? customerPurchases
        : customerPurchases.filter(order => getPurchaseCategory(order) === selectedPurchaseTab)
    purchasesOrders.innerHTML = ''
    if (!filtered.length) {
        purchasesOrders.innerHTML = '<div class="purchases__empty"><i class="bx bx-package"></i><strong>No purchases here yet</strong><span>Your orders will appear in this tab after checkout.</span></div>'
        return
    }
    filtered.forEach(order => {
        const category = getPurchaseCategory(order)
        const items = order.items.map(item => {
            const product = findProduct(item.productId)
            return `<div class="purchase__item"><img src="${product?.image || 'assets/img/home.png'}" alt="${item.name}"><span>${item.name}</span><small>x${item.quantity}</small><strong>${formatPrice(item.price)}</strong></div>`
        }).join('')
        const canCancel = ['pending', 'paid', 'processing'].includes(order.status)
        purchasesOrders.insertAdjacentHTML('beforeend', `<article class="purchase__order" data-purchase-order="${order.id}">
            <div class="purchase__order-head"><strong>Order #${order.id}</strong><span>${purchaseCategoryLabel(category)}</span></div>
            <div class="purchase__items">${items}</div>
            <div class="purchase__order-foot"><small>${new Date(order.createdAt).toLocaleDateString()} · ${order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)</small><strong>Total ${formatPrice(order.total)}</strong></div>
            ${canCancel ? `<button class="purchase__cancel" type="button" data-cancel-order="${order.id}">CANCEL ORDER</button>` : ''}
        </article>`)
    })
}

const loadPurchases = () => {
    purchasesMessage.textContent = 'Loading your purchases...'
    fetch('api/purchases.php')
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) throw new Error(data.error || 'Purchases could not be loaded.')
            customerPurchases = data.orders || []
            purchasesMessage.textContent = customerPurchases.length ? '' : 'Your purchase history is empty.'
            renderPurchases()
        })
        .catch(error => {
            customerPurchases = []
            purchasesMessage.textContent = error.message
            purchasesOrders.innerHTML = ''
            if (error.message === 'Sign in to view your purchases.') {
                setAuthState(null)
                showPurchases(false)
                openAuthModal(true)
            }
        })
}

const submitAuth = (form, action) => {
    const formData = new FormData(form)
    authMessage.textContent = 'Please wait...'
    fetch('api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action,
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password')
        })
    })
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) throw new Error(data.error || 'Authentication failed.')
            setAuthState(data.user)
            authMessage.textContent = 'You are signed in.'
            form.reset()
            setTimeout(closeAuthModal, 700)
        })
        .catch(error => { authMessage.textContent = error.message })
}

document.getElementById('account-button').addEventListener('click', () => openAuthModal())
document.getElementById('auth-close').addEventListener('click', closeAuthModal)
document.getElementById('auth-panel-close').addEventListener('click', closeAuthModal)
document.getElementById('purchases-button').addEventListener('click', () => {
    if (!currentCustomer) {
        closeAuthModal()
        openAuthModal(true)
        return
    }
    closeAuthModal()
    showPurchases(true)
})
document.getElementById('tracker-open-purchases').addEventListener('click', () => {
    if (currentCustomer) showPurchases(true)
    else openAuthModal(true)
})
document.getElementById('purchases-close').addEventListener('click', () => showPurchases(false))
document.getElementById('purchases-back').addEventListener('click', () => {
    if (purchaseTrackingRefresh) clearInterval(purchaseTrackingRefresh)
    purchasesTracker.hidden = true
    purchasesOrders.hidden = false
})
document.querySelectorAll('[data-purchase-tab]').forEach(tab => tab.addEventListener('click', () => {
    selectedPurchaseTab = tab.dataset.purchaseTab
    document.querySelectorAll('[data-purchase-tab]').forEach(item => item.classList.toggle('is-active', item === tab))
    purchasesTracker.hidden = true
    purchasesOrders.hidden = false
    renderPurchases()
}))
document.getElementById('purchases-orders').addEventListener('click', event => {
    const cancelButton = event.target.closest('[data-cancel-order]')
    if (cancelButton) {
        event.stopPropagation()
        orderBeingCancelled = customerPurchases.find(item => item.id === Number(cancelButton.dataset.cancelOrder))
        cancelMessage.textContent = ''
        cancelForm.reset()
        cancelNoteLabel.hidden = true
        cancelModal.classList.add('is-visible')
        cancelModal.setAttribute('aria-hidden', 'false')
        return
    }
    const orderCard = event.target.closest('[data-purchase-order]')
    if (!orderCard) return
    const order = customerPurchases.find(item => item.id === Number(orderCard.dataset.purchaseOrder))
    if (order) openPurchaseTracker(order)
})
const closeCancelModal = () => {
    cancelModal.classList.remove('is-visible')
    cancelModal.setAttribute('aria-hidden', 'true')
    orderBeingCancelled = null
}
document.getElementById('cancel-close').addEventListener('click', closeCancelModal)
document.getElementById('cancel-panel-close').addEventListener('click', closeCancelModal)
cancelForm.elements.reason.addEventListener('change', event => {
    cancelNoteLabel.hidden = event.target.value !== 'Other'
    cancelForm.elements.note.required = event.target.value === 'Other'
})
cancelForm.addEventListener('submit', event => {
    event.preventDefault()
    if (!orderBeingCancelled) return
    const formData = new FormData(cancelForm)
    const submitButton = cancelForm.querySelector('button[type="submit"]')
    submitButton.disabled = true
    cancelMessage.textContent = 'Cancelling order...'
    fetch('api/cancel-order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            orderId: orderBeingCancelled.id,
            reason: formData.get('reason'),
            note: formData.get('note')
        })
    })
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) throw new Error(data.error || 'Order could not be cancelled.')
            closeCancelModal()
            showToast('Order cancelled successfully.')
            loadPurchases()
        })
        .catch(error => { cancelMessage.textContent = error.message })
        .finally(() => { submitButton.disabled = false })
})
document.getElementById('login-form').addEventListener('submit', event => {
    event.preventDefault()
    submitAuth(event.currentTarget, 'login')
})
document.getElementById('register-form').addEventListener('submit', event => {
    event.preventDefault()
    submitAuth(event.currentTarget, 'register')
})
document.getElementById('logout-button').addEventListener('click', () => {
    saveCart()
    fetch('api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' })
    }).then(() => {
        setAuthState(null)
        closeAuthModal()
    })
})

fetch('api/auth.php')
    .then(response => response.json())
    .then(data => setAuthState(data.user || null))
    .catch(() => setAuthState(null))

const fillSelect = (select, values, placeholder) => {
    select.innerHTML = `<option value="">${placeholder}</option>`
    values.forEach(value => select.insertAdjacentHTML('beforeend', `<option value="${value}">${value}</option>`))
    select.disabled = values.length === 0
}

let worldwideLocations = []
let countryCities = {}

const loadWorldwideLocations = () => Promise.all([
    fetch('https://countriesnow.space/api/v0.1/countries/positions').then(response => response.json()),
    fetch('https://countriesnow.space/api/v0.1/countries').then(response => response.json())
])
    .then(([positionData, cityData]) => {
        worldwideLocations = positionData.data || []
        ;(cityData.data || []).forEach(country => { countryCities[country.country] = country.cities || [] })
        fillSelect(addressCountry, worldwideLocations.map(location => location.name).sort(), 'Select country')
    })
    .catch(() => { cartMessage.textContent = 'Locations could not be loaded. Check your internet connection.' })

addressCountry.addEventListener('change', () => {
    fillSelect(addressRegion, [], 'Loading regions...')
    fillSelect(addressCity, [], 'Select city')
    if (!addressCountry.value) return

    fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: addressCountry.value })
    })
        .then(response => response.json())
        .then(data => {
            const regions = (data.data && data.data.states || []).map(state => state.name)
            fillSelect(addressRegion, regions, regions.length ? 'Select state or region' : 'No regions available')
            if (!regions.length) fillSelect(addressCity, countryCities[addressCountry.value] || [], 'Select city')
        })
        .catch(() => { fillSelect(addressRegion, [], 'Regions unavailable') })
})

const loadCities = (country, state) => {
    fillSelect(addressCity, [], 'Loading cities...')
    return fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ country, state })
})
    .then(response => response.json())
        .then(data => {
            const cities = data.error ? [] : data.data || []
            fillSelect(addressCity, cities.length ? cities : countryCities[country] || [], 'Select city')
        })
        .catch(() => { fillSelect(addressCity, countryCities[country] || [], 'Select city') })
}

addressRegion.addEventListener('change', () => loadCities(addressCountry.value, addressRegion.value))

loadWorldwideLocations()

useLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        locationStatus.textContent = 'GPS is not supported by this browser.'
        return
    }
    locationStatus.textContent = 'Requesting your location...'
    navigator.geolocation.getCurrentPosition(
        position => {
            customerCoordinates = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
            locationStatus.textContent = 'GPS location captured for this order.'
        },
        () => { locationStatus.textContent = 'Location permission was not granted. The address will be used instead.' },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
})

const fallbackProducts = [
    { id: 1, name: 'Jazzmaster', price: 1050, image: 'assets/img/featured1.png' },
    { id: 2, name: 'Ingersoll', price: 250, image: 'assets/img/featured2.png' },
    { id: 3, name: 'Rose gold', price: 890, image: 'assets/img/featured3.png' },
    { id: 4, name: 'Spirit rose', price: 1500, image: 'assets/img/product1.png' },
    { id: 5, name: 'Khaki pilot', price: 1350, image: 'assets/img/product2.png' },
    { id: 6, name: 'Jubilee black', price: 870, image: 'assets/img/product3.png' },
    { id: 7, name: 'Fosil me3', price: 650, image: 'assets/img/product4.png' },
    { id: 8, name: 'Duchen', price: 950, image: 'assets/img/product5.png' },
    { id: 9, name: 'Longines rose', price: 980, image: 'assets/img/new1.png' },
    { id: 10, name: 'Jazzmaster new', price: 1150, image: 'assets/img/new2.png' },
    { id: 11, name: 'Dreyfuss gold', price: 750, image: 'assets/img/new3.png' },
    { id: 12, name: 'Portuguese rose', price: 1590, image: 'assets/img/new4.png' }
]
let products = fallbackProducts
let shoppingCart = []
let wishlistItems = []

try {
    const storedCart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]')
    shoppingCart = Array.isArray(storedCart) ? storedCart : []
} catch (error) {
    localStorage.removeItem(cartStorageKey)
}

try {
    const storedWishlist = JSON.parse(localStorage.getItem(wishlistStorageKey) || '[]')
    wishlistItems = Array.isArray(storedWishlist) ? storedWishlist : []
} catch (error) {
    localStorage.removeItem(wishlistStorageKey)
}

const productKey = value => value.toLowerCase().replace(/\s+/g, ' ').trim()
const usdToPhp = 58
const formatPrice = value => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
}).format(Number(value) * usdToPhp)

const advisorPanel = document.getElementById('advisor-panel')
const advisorForm = document.getElementById('advisor-form')
const advisorResults = document.getElementById('advisor-results')
const advisorMessage = document.getElementById('advisor-message')

const showAdvisor = visible => {
    advisorPanel.classList.toggle('is-visible', visible)
    advisorPanel.setAttribute('aria-hidden', String(!visible))
}

document.getElementById('advisor-open').addEventListener('click', () => showAdvisor(true))
document.getElementById('advisor-close').addEventListener('click', () => showAdvisor(false))

advisorForm.addEventListener('submit', event => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(advisorForm))
    advisorMessage.textContent = 'Curating your matches...'
    advisorResults.innerHTML = ''

    fetch('api/recommend.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
    })
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) throw new Error(data.error || 'Recommendations could not be loaded.')
            advisorMessage.textContent = data.products.length
                ? 'These pieces suit your brief.'
                : 'No close matches found. Try a higher budget.'
            advisorResults.innerHTML = data.products.map(product => `
                <article class="advisor-result">
                    <img src="${product.image}" alt="${product.name}">
                    <div>
                        <h3>${product.name}</h3>
                        <strong>${formatPrice(product.price)}</strong>
                        <p>${product.reason}</p>
                        <button class="button button--small advisor-result__button" type="button" data-advisor-product="${product.id}">ADD TO CART</button>
                    </div>
                </article>`).join('')
        })
        .catch(error => { advisorMessage.textContent = error.message })
})

advisorResults.addEventListener('click', event => {
    const button = event.target.closest('[data-advisor-product]')
    if (!button) return
    addToCart(Number(button.dataset.advisorProduct))
    button.textContent = 'ADDED'
})

const saveCart = () => {
    localStorage.setItem(cartStorageKey, JSON.stringify(shoppingCart))
}

const saveWishlist = () => {
    localStorage.setItem(wishlistStorageKey, JSON.stringify(wishlistItems))
}

const findProduct = id => products.find(product => product.id === id)

const renderWishlist = () => {
    wishlistContainer.innerHTML = ''
    const savedProducts = wishlistItems.map(findProduct).filter(Boolean)
    wishlistCount.textContent = savedProducts.length

    if (!savedProducts.length) {
        wishlistContainer.innerHTML = '<p>Your wishlist is empty.</p>'
        return
    }

    savedProducts.forEach(product => wishlistContainer.insertAdjacentHTML('beforeend', `
        <article class="wishlist__card">
            <div class="wishlist__box"><img src="${product.image}" alt="${product.name}" class="wishlist__img"></div>
            <div class="wishlist__details">
                <h3 class="cart__title">${product.name}</h3>
                <span class="cart__price">${formatPrice(product.price)}</span>
                <div class="wishlist__actions">
                    <button class="button button--small wishlist__cart-button" type="button" data-wishlist-cart="${product.id}">ADD TO CART</button>
                    <button class="wishlist__remove" type="button" data-wishlist-remove="${product.id}" aria-label="Remove ${product.name} from wishlist"><i class='bx bx-trash'></i></button>
                </div>
            </div>
        </article>`))
}

const toggleWishlist = id => {
    wishlistItems = wishlistItems.includes(id)
        ? wishlistItems.filter(itemId => itemId !== id)
        : [...wishlistItems, id]
    saveWishlist()
    renderWishlist()
    document.querySelectorAll(`[data-wishlist="${id}"]`).forEach(button => {
        const saved = wishlistItems.includes(id)
        button.classList.toggle('is-saved', saved)
        button.setAttribute('aria-label', saved ? 'Remove from wishlist' : 'Save to wishlist')
        button.innerHTML = `<i class='bx ${saved ? 'bxs-heart' : 'bx-heart'}'></i>`
    })
    if (wishlistItems.includes(id)) showToast('Saved to your wishlist.')
}

wishlistContainer.addEventListener('click', event => {
    const cartButton = event.target.closest('[data-wishlist-cart]')
    const removeButton = event.target.closest('[data-wishlist-remove]')
    if (cartButton) addToCart(Number(cartButton.dataset.wishlistCart))
    if (removeButton) toggleWishlist(Number(removeButton.dataset.wishlistRemove))
})

const addToCart = id => {
    const existing = shoppingCart.find(item => item.id === id)
    if (existing) existing.quantity += 1
    else shoppingCart.push({ id, quantity: 1 })
    saveCart()
    renderCart()
    cart.classList.add('show-cart')
    cart.classList.remove('cart--pulse')
    requestAnimationFrame(() => cart.classList.add('cart--pulse'))
    const cartIcon = document.getElementById('cart-shop')
    cartIcon.classList.remove('is-popping')
    requestAnimationFrame(() => cartIcon.classList.add('is-popping'))
    showToast('Added to your cart.')
}

const changeQuantity = (id, amount) => {
    const item = shoppingCart.find(cartItem => cartItem.id === id)
    if (!item) return
    item.quantity += amount
    shoppingCart = shoppingCart.filter(cartItem => cartItem.quantity > 0)
    saveCart()
    renderCart()
}

const renderCart = () => {
    let total = 0
    let count = 0
    cartContainer.innerHTML = ''

    shoppingCart.forEach(item => {
        const product = findProduct(item.id)
        if (!product) return
        total += product.price * item.quantity
        count += item.quantity
        cartContainer.insertAdjacentHTML('beforeend', `
            <article class="cart__card">
                <div class="cart__box"><img src="${product.image}" alt="${product.name}" class="cart__img"></div>
                <div class="cart__details">
                    <h3 class="cart__title">${product.name}</h3>
                    <span class="cart__price">${formatPrice(product.price)}</span>
                    <div class="cart__amount">
                        <div class="cart__amount-content">
                            <button class="cart__amount-box" data-action="decrease" data-id="${product.id}" aria-label="Decrease quantity">-</button>
                            <span class="cart__amount-number">${item.quantity}</span>
                            <button class="cart__amount-box" data-action="increase" data-id="${product.id}" aria-label="Increase quantity">+</button>
                        </div>
                        <button class="cart__amount-trash" data-action="remove" data-id="${product.id}" aria-label="Remove ${product.name}">Remove</button>
                    </div>
                </div>
            </article>`)
    })

    if (!count) cartContainer.innerHTML = '<p>Your cart is empty.</p>'
    cartItemCount.textContent = `${count} item${count === 1 ? '' : 's'}`
    cartTotal.textContent = formatPrice(total)
}

cartContainer.addEventListener('click', event => {
    const control = event.target.closest('[data-action]')
    if (!control) return
    const id = Number(control.dataset.id)
    if (control.dataset.action === 'increase') changeQuantity(id, 1)
    if (control.dataset.action === 'decrease') changeQuantity(id, -1)
    if (control.dataset.action === 'remove') {
        shoppingCart = shoppingCart.filter(item => item.id !== id)
        saveCart()
        renderCart()
        showToast('Item removed from your cart.')
    }
})

const connectProductButtons = () => {
    document.querySelectorAll('.featured__card, .products__card, .new__card').forEach(card => {
        const title = card.querySelector('.featured__title, .products__title, .new__title')
        const button = card.querySelector('button')
        if (!title || !button) return
        const product = products.find(item => productKey(item.name) === productKey(title.textContent))
        if (!product) return
        if (!card.querySelector('[data-wishlist]')) {
            const wishlistButton = document.createElement('button')
            wishlistButton.className = 'wishlist-toggle'
            wishlistButton.dataset.wishlist = product.id
            wishlistButton.type = 'button'
            wishlistButton.setAttribute('aria-label', 'Save to wishlist')
            card.append(wishlistButton)
            wishlistButton.addEventListener('click', () => toggleWishlist(product.id))
        }
        const wishlistButton = card.querySelector('[data-wishlist]')
        wishlistButton.classList.toggle('is-saved', wishlistItems.includes(product.id))
        wishlistButton.setAttribute('aria-label', wishlistItems.includes(product.id) ? 'Remove from wishlist' : 'Save to wishlist')
        wishlistButton.innerHTML = `<i class='bx ${wishlistItems.includes(product.id) ? 'bxs-heart' : 'bx-heart'}'></i>`
        if (button.dataset.cartConnected) return
        button.dataset.cartConnected = 'true'
        button.addEventListener('click', () => addToCart(product.id))
    })

    const homeButton = document.querySelector('.home__button')
    const homeProduct = products.find(item => item.name === 'Jazzmaster')
    if (homeButton && homeProduct) homeButton.addEventListener('click', () => addToCart(homeProduct.id))
}

connectProductButtons()
renderWishlist()

fetch('api/products.php')
    .then(response => response.json())
    .then(data => {
        if (data.error) throw new Error(data.error)
        products = data.products
        renderCart()
        renderWishlist()
        connectProductButtons()
    })
    .catch(error => { cartMessage.textContent = error.message })

checkoutForm.addEventListener('submit', event => {
    event.preventDefault()
    if (!shoppingCart.length) {
        cartMessage.textContent = 'Add a product before checking out.'
        return
    }
    if (!currentCustomer) {
        cartMessage.textContent = 'Sign in before placing your order.'
        openAuthModal(true)
        return
    }
    const formData = new FormData(checkoutForm)
    const address = [
        formData.get('street'),
        formData.get('barangay'),
        formData.get('city'),
        formData.get('region'),
        formData.get('country')
    ].filter(Boolean).join(', ')
    cartMessage.textContent = 'Placing your order...'
    const checkoutButton = checkoutForm.querySelector('.cart__submit')
    checkoutButton.disabled = true
    checkoutButton.classList.add('is-loading')
    checkoutButton.textContent = 'PLACING ORDER...'
    fetch('api/orders.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            address,
            latitude: customerCoordinates.latitude,
            longitude: customerCoordinates.longitude,
            items: shoppingCart
        })
    })
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) throw new Error(data.error || 'Order could not be created.')
            shoppingCart = []
            saveCart()
            renderCart()
            checkoutForm.reset()
            customerCoordinates = { latitude: null, longitude: null }
            locationStatus.textContent = 'Location is optional. Allow GPS for the most accurate map.'
            cartMessage.textContent = `Order #${data.orderId} placed successfully.`
            checkoutButton.classList.remove('is-loading')
            checkoutButton.classList.add('is-success')
            checkoutButton.textContent = 'ORDER PLACED'
            showToast('Your order was placed successfully.')
            setTimeout(() => {
                checkoutButton.disabled = false
                checkoutButton.classList.remove('is-success')
                checkoutButton.textContent = 'PLACE ORDER'
            }, 1800)
        })
        .catch(error => {
            cartMessage.textContent = error.message
            checkoutButton.disabled = false
            checkoutButton.classList.remove('is-loading')
            checkoutButton.textContent = 'PLACE ORDER'
            showToast(error.message, true)
        })
})

/*=============== ORDER TRACKER ===============*/
const trackerForm = document.getElementById('tracker-form')
const trackerResult = document.getElementById('tracker-result')
const trackingMapElement = document.getElementById('tracking-map')
const trackerLiveStatus = document.getElementById('tracker-live-status')
let trackingMap
let trackingRefresh

const drawTrackingMap = (latitude, longitude, courier, targetElement = trackingMapElement, existingMap = trackingMap) => {
    if (!targetElement || typeof L === 'undefined' || latitude === null || longitude === null) return existingMap
    if (existingMap) existingMap.remove()

    targetElement.classList.add('is-visible')
    const position = courier?.position
    const currentLocation = position && Number.isFinite(Number(position.lat)) && Number.isFinite(Number(position.lng))
        ? [Number(position.lat), Number(position.lng)]
        : null
    const route = courier?.routeInfo?.waypoints?.flatMap(waypoint => waypoint.coordinates || [])
        .filter(coordinate => Array.isArray(coordinate) && coordinate.length >= 2)
        .map(coordinate => [coordinate[1], coordinate[0]]) || []
    const destination = [latitude, longitude]
    const mapPoints = [...route, ...(currentLocation ? [currentLocation] : []), destination]
    const map = L.map(targetElement).setView(currentLocation || destination, currentLocation ? 14 : 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    if (route.length > 1) {
        L.polyline(route, { color: '#b99052', weight: 5, opacity: .7 }).addTo(map)
    }
    if (currentLocation) {
        L.marker(currentLocation).addTo(map).bindPopup(`Courier: ${courier.name || 'Assigned courier'}`).openPopup()
    }
    L.marker(destination).addTo(map).bindPopup('Delivery destination')
    if (mapPoints.length > 1) map.fitBounds(mapPoints, { padding: [24, 24] })
    return map
}

const getTrackingStatus = (orderStatus, courier) => {
    if (orderStatus === 'cancelled' || orderStatus === 'delivered') return orderStatus
    if (!courier) return orderStatus === 'paid' ? 'processing' : orderStatus

    const progress = Number(courier.position?.progress || 0)
    if (courier.status === 'completed' || progress >= 100) return 'delivered'
    if (courier.status === 'in_progress' && progress > 0) return 'shipped'
    return 'processing'
}

const getTrackingStatusLabel = status => ({
    pending: 'Order placed',
    paid: 'Order placed',
    processing: 'Preparing order',
    shipped: 'On the way',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
}[status] || 'Order placed')

const renderTrackingTimeline = status => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered']
    const labels = ['Order placed', 'Preparing order', 'On the way', 'Delivered']
    const currentStatus = status === 'paid' ? 'processing' : status
    const currentIndex = currentStatus === 'cancelled' ? -1 : Math.max(statuses.indexOf(currentStatus), 0)
    return `<div class="tracker__timeline ${status === 'cancelled' ? 'is-cancelled' : ''}">
        ${statuses.map((item, index) => `
            <div class="tracker__step ${index <= currentIndex ? 'is-complete' : ''} ${index === currentIndex ? 'is-current' : ''}">
                <span class="tracker__step-dot">${index < currentIndex ? '✓' : index + 1}</span>
                <span class="tracker__step-label">${labels[index]}</span>
            </div>`).join('')}
    </div>`
}

const loadTrackingOrder = query => {
    fetch(`api/track-order.php?${query}`)
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) throw new Error(data.error || 'Order status could not be loaded.')
            const order = data.order
            const date = new Date(order.createdAt).toLocaleDateString()
            const trackingStatus = getTrackingStatus(order.status, order.courier)
            trackerLiveStatus.classList.toggle('is-active', Boolean(order.courier))
            trackerLiveStatus.classList.toggle('is-offline', !order.courier)
            trackerLiveStatus.lastChild.textContent = order.courier
                ? `Live courier connected · ${order.courier.position.progress}% complete`
                : 'Courier simulation unavailable · destination tracking only'
            trackerResult.innerHTML = `
                <strong>Order #${order.id}</strong>
                <span>Status: ${getTrackingStatusLabel(trackingStatus)}</span>
                <span>Total: ${formatPrice(order.total)}</span>
                <span>Placed: ${date}</span>
                ${order.courier ? `<span>Courier: ${order.courier.name} (${order.courier.status})</span>
                <span>Progress: ${order.courier.position.progress}% · ETA: ${order.courier.position.timeLeft}</span>` : ''}
                ${renderTrackingTimeline(trackingStatus)}`
            if (order.latitude === null || order.longitude === null) {
                trackerResult.insertAdjacentHTML('beforeend', '<span>Map location is unavailable for this address.</span>')
            } else {
                trackerResult.insertAdjacentHTML('beforeend', order.courier
                    ? '<span class="tracker__map-note">Courier position is simulated from the active street route.</span>'
                    : '<span class="tracker__map-note">Map shows the confirmed delivery destination. Courier simulation is offline.</span>')
            }
            trackingMap = drawTrackingMap(order.latitude, order.longitude, order.courier)
        })
        .catch(error => {
            trackerLiveStatus.classList.remove('is-active')
            trackerLiveStatus.classList.add('is-offline')
            trackerLiveStatus.lastChild.textContent = 'Tracking service could not be reached'
            trackerResult.textContent = error.message
        })
}

if (trackerForm) trackerForm.addEventListener('submit', event => {
    event.preventDefault()
    if (trackingRefresh) clearInterval(trackingRefresh)
    const formData = new FormData(trackerForm)
    const query = new URLSearchParams({
        order: formData.get('order'),
        email: formData.get('email')
    })
    trackerResult.textContent = 'Loading order status...'
    loadTrackingOrder(query)
    trackingRefresh = setInterval(() => loadTrackingOrder(query), 10000)
})

const loadPurchaseTracking = order => {
    const query = new URLSearchParams({ order: order.id, email: currentCustomer.email })
    fetch(`api/track-order.php?${query}`)
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) throw new Error(data.error || 'Order tracking could not be loaded.')
            const liveOrder = data.order
            const trackingStatus = getTrackingStatus(liveOrder.status, liveOrder.courier)
            purchaseTrackerResult.innerHTML = `
                <strong>Order #${liveOrder.id}</strong>
                <span>Status: ${getTrackingStatusLabel(trackingStatus)}</span>
                ${liveOrder.courier ? `<span>Courier: ${liveOrder.courier.name} · Progress: ${liveOrder.courier.position.progress}% · ETA: ${liveOrder.courier.position.timeLeft}</span>` : ''}
                ${renderTrackingTimeline(trackingStatus)}`
            purchaseTrackerResult.insertAdjacentHTML('beforeend', liveOrder.courier
                ? '<span class="tracker__map-note">Live courier position and route are updating automatically.</span>'
                : '<span class="tracker__map-note">Courier simulation is unavailable; showing the delivery destination.</span>')
            purchaseTrackingMapInstance = drawTrackingMap(liveOrder.latitude, liveOrder.longitude, liveOrder.courier, purchaseTrackingMap, purchaseTrackingMapInstance)
        })
        .catch(error => { purchaseTrackerResult.textContent = error.message })
}

const openPurchaseTracker = order => {
    if (!currentCustomer) {
        openAuthModal(true)
        return
    }
    if (purchaseTrackingRefresh) clearInterval(purchaseTrackingRefresh)
    purchasesOrders.hidden = true
    purchasesTracker.hidden = false
    purchasesSelected.innerHTML = `<strong>Order #${order.id}</strong><span>${order.items.map(item => `${item.name} x${item.quantity}`).join(' · ')}</span>`
    purchaseTrackerResult.textContent = 'Loading live tracking...'
    loadPurchaseTracking(order)
    purchaseTrackingRefresh = setInterval(() => loadPurchaseTracking(order), 10000)
}

/*=============== DARK LIGHT THEME ===============*/ 
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx bx-moon' : 'bx bx-sun'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'bx bx-moon' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
if (themeButton) themeButton.addEventListener('click', () => {
    // Add or remove the dark / icon theme
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})
