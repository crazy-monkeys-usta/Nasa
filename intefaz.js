const telescope = document.getElementById('telescope');
const lateral_bar = document.querySelector('.lateral-bar');
const span = document.querySelectorAll('span');
const home = document.getElementById('home');
const search_bar = document.querySelector('input');
const exoplanet_button = document.getElementById('planet');
const subMenu = document.querySelector('.sub-menu');


async function fetchHostnames() {
    try {
        const response = await fetch('http://localhost:5000/api/hostnames'); 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const hostnames = await response.json();
        populateSubMenu(hostnames);
    } catch (error) {
        console.error('Error fetching hostnames:', error);
    }
}


function populateSubMenu(hostnames) {
    subMenu.innerHTML = ''; 
    hostnames.forEach(hostname => {
        const item = document.createElement('div');
        item.className = 'sub-menu-item';
        item.textContent = hostname;
        subMenu.appendChild(item);
    });
}

fetchHostnames();

telescope.addEventListener('click', () => {
    lateral_bar.classList.toggle('min-lateral-bar');  
    span.forEach((span) => {
        span.classList.toggle('hide');
    }); 
    search_bar.classList.toggle('hide');
    subMenu.classList.toggle('min_sub-menu') 
});

home.addEventListener('click', () => {
    alert('work in progres xd');
});

exoplanet_button.addEventListener('click', () => {  
    subMenu.classList.toggle('show'); 
});
