// --- API functions ---
const fetchWithCache = async(kind,path) => {
    let data, url;
    const stored = localStorage.getItem(kind);
    if (!stored) {
        let res;
        if (typeof window.axios != 'undefined' && window.axios) {
            res = await axios.get(path, {});
            data = (res.data instanceof Array) ? res.data : res.data.data;
            url = (typeof res.url === "string") ? res.url : res.data.url;
        } else {
            res = await (await fetch(path, {})).json();
            data = (res.data instanceof Array) ? res.data : res.data.data;
            url = (typeof res.url === "string") ? res.url : res.data.url;
        }
        localStorage.setItem(kind, JSON.stringify({ data, url }));
    } else {
        const parsed = JSON.parse(stored);
        data = parsed.data;
        url = parsed.url;
    }
    if(path !== '/comments'){display(url, data);}
}

const display = (url,res) =>{
    const main = document.getElementById('main')
    main.className = 'info'
    if(url !== '/welcome'){
        main.innerHTML = ''}
    if(url === '/contacts'){
        for(const obj of res){
            const capsule = document.createElement('div')
            capsule.className = "div contact-card"
            capsule.innerHTML = `
                <div class="contact-card-inner">
                    <img class="contact-photo" src="${obj.photo || '/static_files/default-profile.png'}" alt="Profile picture">
                    <h3 class="contact-name">${obj.name}</h3>
                    <p class="contact-address">${obj.address}</p>
                    <p class="contact-contact">${obj.contact}</p>
                </div>
            `;
            main.appendChild(capsule);
        }
        return;
    } if(url === '/about-us' ) {
        console.log('here')
        for (const obj of res) {
            const capsule = document.createElement('div');
            capsule.className = "div";
            capsule.innerHTML = `
                <h3>${obj.name}</h3>
                <p>${obj.description}</p>
            `;
            main.appendChild(capsule);
        }
        return;
    }if(url == '/welcome'){
        const notification = document.getElementById('modal-form');
        notification.innerHTML += `
        <p>WELCOME ${res.name}</p>
        <p>${res.message}</p>
        <p>Please enter your name above or close to skip</p>
        `;
        return;
    }else{
        for (const obj of res) {
            const capsule = document.createElement('div');
            capsule.className = "div";
            capsule.innerHTML = `
                <img src="${obj}" alt="Image from ${url}">
            `;
            main.appendChild(capsule);
        }
    }
};

// --- Hash-based Routing handler ---
const routes = {
    '#/home': () => fetchWithCache('home-res', '/home'),
    '#/services': () => fetchWithCache('services-res', '/services'),
    '#/contacts': () => fetchWithCache('contacts-res', '/contacts'),
    '#/about-us': () => fetchWithCache('about-res', '/about-us'),
    '': () => fetchWithCache('home-res', '/home')
};

const handleRoute = () => {
    const fn = routes[window.location.hash];
    fn();
}

const activate = (e) => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
            navLinks.forEach(l => l.classList.remove('active'));
            e.classList.add('active');
    });
}

const setActiveNav = () => {
    const hash = window.location.hash;
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === hash) {
            link.classList.add('active');
        }
    });
}

// --- Notification handlers ---
const showModal = () => {
    document.getElementById('custom-modal').style.display = 'flex';
    fetchWithCache('welcome-res','/welcome')
    document.querySelector('#modal-form input[name="info"]').focus();
}

const hideModal = () => {
    document.getElementById('custom-modal').style.display = 'none';
}

// --- Navigation event listeners ---
setTimeout(function(){
document.getElementById('nav-home').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.hash = '#/home';
    activate(this)
});
document.getElementById('nav-services').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.hash = '#/services';
    activate(this)
});
document.getElementById('nav-contacts').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.hash = '#/contacts';
    activate(this)
});
document.getElementById('nav-about').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.hash = '#/about-us';
    activate(this)
});
document.getElementById('modal-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const value = this.info.value;
    const res = await axios.get('/remarks',  { name: value } || { name: 'Guest' });
    let notification = document.getElementById('modal-form')
    notification.innerHTML = `
        <p>WELCOME ${value}, thanks for visiting...</p>
        `
    for (const obj of res.data.data) {
        notification.innerHTML += `
            <p>${obj.name}</p>
            <p>${obj.description}</p>
        `;
    }
    const timer = setTimeout(hideModal,2000);
    timer()
    clearTimeout(timer)
});
document.getElementById('modal-close').addEventListener('click', hideModal)
},2000)


window.addEventListener('DOMContentLoaded', function() {
    handleRoute(); // Load initial content based on hash
    setActiveNav(); // Set active nav on initial load
    if(window.location.hash == ''){
    showModal(); // Show modal on initial load
    }
});
window.addEventListener('hashchange', handleRoute);
