const telescope = document.getElementById('telescope');
const lateral_bar = document.querySelector('.lateral-bar');
const span = document.querySelectorAll('span');
const home = document.getElementById('home');
const search_bar = document.querySelector('input');
const exoplanet_button = document.getElementById('planet');
const subMenu = document.querySelector('.sub-menu');
const exo_list_buttom=document.getElementById('location');
const exo_sub_menu=document.querySelector('.exo-sub-menu');
const sign = document.querySelector('.sign');
const search_fun = document.querySelector('.search-input');
const infoScreen = document.querySelector('.info_screen');
const screenLeft = document.querySelector('.screen-left');
const exit = document.getElementById('close');

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

async function fetchPlanetData(planetName) {
    try {
        const response = await fetch(`http://localhost:5000/api/planet-data/${planetName}`);

        if (!response.ok) {
            throw new Error("Planet not found");
        }
        const data = await response.json(); 
        console.log("Fetched Data:", data);

        const keyMapping = {
            'pl_name': 'Planet Name',
            'hostname': 'Host Star Name',
            'sy_snum': 'Number of Stars in the System',
            'sy_pnum': 'Number of Planets in the System',
            'discoverymethod': 'Discovery Method',
            'disc_year': 'Year of Discovery',
            'pl_orbsmax': 'Orbital Semi-Major Axis',
            'pl_orbper': 'Orbital Period',
            'pl_rade': 'Planet Radius',
            'pl_bmasse': 'Planet Mass',
            'pl_orbeccen': 'Orbital Eccentricity',
            'pl_eqt': 'Equilibrium Temperature',
            'st_teff': 'Stellar Effective Temperature',
            'st_mass': 'Stellar Mass',
            'st_rad': 'Stellar Radius',
            'sy_dist': 'Distance to the System'
        };

        const orderedKeys = [
            'pl_name', 
            'hostname', 
            'sy_snum', 
            'sy_pnum', 
            'discoverymethod', 
            'disc_year', 
            'pl_orbsmax', 
            'pl_orbper', 
            'pl_rade', 
            'pl_bmasse', 
            'pl_orbeccen', 
            'pl_eqt', 
            'st_teff', 
            'st_mass', 
            'st_rad', 
            'sy_dist'
        ];

        populateInfoScreen(data, keyMapping, orderedKeys);

    } catch (error) {
        console.error("Error fetching planet data:", error); 
    }
}

async function fetchSolarSystemData(hostname) {
    try {
        const response = await fetch(`http://localhost:5000/api/solar-system/${hostname}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const solarSystemData = await response.json();
        
        updateExoSubMenu(solarSystemData);

        return solarSystemData; 
    } catch (error) {
        console.error('Error fetching solar system data:', error);
        return null;
    }
}

function updateExoSubMenu(solarSystemData) {
    exo_sub_menu.innerHTML = ''; 

    solarSystemData.forEach(system => {
        const item = document.createElement('div');
        item.className = 'exo-sub-menu-item';
        item.textContent = system.pl_name; 

        item.addEventListener('click', () => {
            infoScreen.classList.toggle('show');
            exo_sub_menu.classList.toggle('show');
            fetchPlanetData(system.pl_name);
        });

        exo_sub_menu.appendChild(item); 
    });
}

function populateInfoScreen(data, keyMapping, orderedKeys) {
    const screenLeft = document.querySelector('.screen-left'); 
    screenLeft.innerHTML = ''; 

    for (const key of orderedKeys) {
        const value = data[0][key]; 
        const item = document.createElement('div');
        item.className = 'info-screen-item';
        const commentary = keyMapping[key] || key; 
        item.textContent = `${commentary}: ${value !== undefined ? value : "data not found"}`; // Handle undefined values
        screenLeft.appendChild(item); 
    }
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
                subMenu.classList.remove('show'); 
            } else {
                alert('No data found for this solar system.');
            }
        });

        subMenu.appendChild(item);
    });
}

async function updateSignText(hostname) {

    sign.style.opacity = '0'; 
    sign.style.transition = 'opacity 0.5s ease'; 

    setTimeout(() => {

        sign.textContent = `${hostname} system is selected.`;

        sign.style.opacity = '1'; 

    }, 500); 
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

exo_list_buttom.addEventListener('click', () => {  
    exo_sub_menu.classList.toggle('show'); 
});

exit.addEventListener('click', () => {  
    infoScreen.classList.toggle('show'); 
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