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
let currentCustomer = null
const useLocationButton = document.getElementById('use-location')
const locationStatus = document.getElementById('location-status')
let customerCoordinates = { latitude: null, longitude: null }
const addressCountry = document.getElementById('address-country')
const addressRegion = document.getElementById('address-region')
const addressCity = document.getElementById('address-city')
const cartStorageKey = 'watch-store-cart'

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
document.getElementById('login-form').addEventListener('submit', event => {
    event.preventDefault()
    submitAuth(event.currentTarget, 'login')
})
document.getElementById('register-form').addEventListener('submit', event => {
    event.preventDefault()
    submitAuth(event.currentTarget, 'register')
})
document.getElementById('logout-button').addEventListener('click', () => {
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

try {
    const storedCart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]')
    shoppingCart = Array.isArray(storedCart) ? storedCart : []
} catch (error) {
    localStorage.removeItem(cartStorageKey)
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

const findProduct = id => products.find(product => product.id === id)

const addToCart = id => {
    const existing = shoppingCart.find(item => item.id === id)
    if (existing) existing.quantity += 1
    else shoppingCart.push({ id, quantity: 1 })
    saveCart()
    renderCart()
    cart.classList.add('show-cart')
    cart.classList.remove('cart--pulse')
    requestAnimationFrame(() => cart.classList.add('cart--pulse'))
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
    }
})

const connectProductButtons = () => {
    document.querySelectorAll('.featured__card, .products__card, .new__card').forEach(card => {
        const title = card.querySelector('.featured__title, .products__title, .new__title')
        const button = card.querySelector('button')
        if (!title || !button) return
        const product = products.find(item => productKey(item.name) === productKey(title.textContent))
        if (!product) return
        if (button.dataset.cartConnected) return
        button.dataset.cartConnected = 'true'
        button.addEventListener('click', () => addToCart(product.id))
    })

    const homeButton = document.querySelector('.home__button')
    const homeProduct = products.find(item => item.name === 'Jazzmaster')
    if (homeButton && homeProduct) homeButton.addEventListener('click', () => addToCart(homeProduct.id))
}

connectProductButtons()

fetch('api/products.php')
    .then(response => response.json())
    .then(data => {
        if (data.error) throw new Error(data.error)
        products = data.products
        renderCart()
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
        })
        .catch(error => { cartMessage.textContent = error.message })
})

/*=============== ORDER TRACKER ===============*/
const trackerForm = document.getElementById('tracker-form')
const trackerResult = document.getElementById('tracker-result')
const trackingMapElement = document.getElementById('tracking-map')
let trackingMap

const drawTrackingMap = (status, latitude, longitude) => {
    if (!trackingMapElement || typeof L === 'undefined' || latitude === null || longitude === null) return
    if (trackingMap) trackingMap.remove()

    trackingMapElement.classList.add('is-visible')
    trackingMap = L.map(trackingMapElement).setView([20, 0], 2)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(trackingMap)

    const route = [[-12.0464, -77.0428], [latitude, longitude]]
    const progressByStatus = {
        pending: 0,
        paid: 0,
        processing: 0,
        shipped: 1,
        cancelled: 0
    }
    const progressIndex = progressByStatus[status] ?? 0
    const activeRoute = route.slice(0, progressIndex + 1)

    L.polyline(route, { color: '#c88745', weight: 4, dashArray: '8 8' }).addTo(trackingMap)
    L.polyline(activeRoute, { color: '#222', weight: 5 }).addTo(trackingMap)
    L.marker(route[0]).addTo(trackingMap).bindPopup('Store warehouse')
    L.marker(route[1]).addTo(trackingMap).bindPopup('Customer delivery address')
    trackingMap.fitBounds(route, { padding: [24, 24] })
}

const renderTrackingTimeline = status => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered']
    const labels = ['Order placed', 'Preparing order', 'On the way', 'Delivered']
    const currentIndex = status === 'cancelled' ? -1 : Math.max(statuses.indexOf(status), 0)
    return `<div class="tracker__timeline ${status === 'cancelled' ? 'is-cancelled' : ''}">
        ${statuses.map((item, index) => `
            <div class="tracker__step ${index <= currentIndex ? 'is-complete' : ''} ${index === currentIndex ? 'is-current' : ''}">
                <span class="tracker__step-dot">${index < currentIndex ? '✓' : index + 1}</span>
                <span class="tracker__step-label">${labels[index]}</span>
            </div>`).join('')}
    </div>`
}

trackerForm.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(trackerForm)
    const query = new URLSearchParams({
        order: formData.get('order'),
        email: formData.get('email')
    })
    trackerResult.textContent = 'Loading order status...'

    fetch(`api/track-order.php?${query}`)
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) throw new Error(data.error || 'Order status could not be loaded.')
            const order = data.order
            const date = new Date(order.createdAt).toLocaleDateString()
            trackerResult.innerHTML = `
                <strong>Order #${order.id}</strong>
                <span>Status: ${order.status}</span>
                <span>Total: ${formatPrice(order.total)}</span>
                <span>Placed: ${date}</span>
                ${renderTrackingTimeline(order.status)}`
            if (order.latitude === null || order.longitude === null) {
                trackerResult.insertAdjacentHTML('beforeend', '<span>Map location is unavailable for this address.</span>')
            }
            drawTrackingMap(order.status, order.latitude, order.longitude)
        })
        .catch(error => { trackerResult.textContent = error.message })
})

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
