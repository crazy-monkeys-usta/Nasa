const telescope = document.getElementById('telescope');
const lateral_bar = document.querySelector('.lateral-bar');
const span = document.querySelectorAll('span');
const home = document.getElementById('home');
const search_bar = document.querySelector('input');
const exoplanet_button = document.getElementById('planet');
const subMenu = document.querySelector('.sub-menu');
const sign = document.querySelector('.sign');
const search_fun = document.querySelector('.search-input');

sign.textContent = "Our sun system is selected";

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

async function fetchSolarSystemData(hostname) {
    try {
        const response = await fetch(`http://localhost:5000/api/solar-system/${hostname}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const solarSystemData = await response.json();
        return solarSystemData; 
    } catch (error) {
        console.error('Error fetching solar system data:', error);
        return null;
    }
}

async function updateSignText(hostname) {

    sign.style.opacity = '0'; 
    sign.style.transition = 'opacity 0.5s ease'; 

    setTimeout(() => {

        sign.textContent = `${hostname} system is selected.`;

        sign.style.opacity = '1'; 

    }, 500); 
}

function populateSubMenu(hostnames) {
    subMenu.innerHTML = ''; 
    hostnames.forEach(hostname => {
        const item = document.createElement('div');
        item.className = 'sub-menu-item';
        item.textContent = hostname;

        item.addEventListener('click', async () => {
            const solarSystemData = await fetchSolarSystemData(hostname);
            if (solarSystemData && solarSystemData.length > 0) {
                plotSolarSystemFromData(solarSystemData);
                updateSignText(hostname); 
            } else {
                alert('No data found for this solar system.');
            }
        });

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
    loadDefaultSystem();
    updateSignText('Our sun')
});

exoplanet_button.addEventListener('click', () => {  
    subMenu.classList.toggle('show'); 
});

async function search_bar_look(key) {
    try {
        const hostnameResponse = await fetch(`http://localhost:5000/api/hostname-or-planet?hostname=${key}`);
        const planetResponse = await fetch(`http://localhost:5000/api/hostname-or-planet?plname=${key}`);

        if (!hostnameResponse.ok && !planetResponse.ok) {
            throw new Error('Network response was not ok');
        }

        let data = await hostnameResponse.json();

 
        if (!data.length) {
            data = await planetResponse.json();
        }

        return data; 
    } catch (error) {
        console.error('Error fetching solar system or planet data:', error);
        return null; 
    }
}



search_fun.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {  
        const key = search_fun.value.trim();  
        if (key) {  
            const result = await search_bar_look(key);
            if (result && result.length > 0) {
                plotSolarSystemFromData(result);
                search_fun.value = '';  
            } else {
                alert('System or planet not found.');
            }
        } else {
            alert('Please enter a hostname or planet name.');  
        }
    }
});