let currentPageName = document.location.pathname.replace(/.*\/|\..+/g, "")
let nextPageUrl = ''
let prevPageUrl = ''
const modal = document.getElementById('modal')

const urlRoutesAPI = {
    index: 'https://swapi.dev/api/people/',
    '': 'https://swapi.dev/api/people/',
    planets: 'https://swapi.dev/api/planets',
    species: 'https://swapi.dev/api/species'
}

let currentPageUrl = urlRoutesAPI[currentPageName]
//urlRoutesAPI[currentPageName] ? currentPageUrl = urlRoutesAPI[currentPageName] : currentPageUrl = urlRoutesAPI['index']

const loadRoutesAPI = {
    index: async (url) => {
        await loadCharacters(url)
    },
    '': async (url) => {
        await loadCharacters(url)
    },
    planets: async (url) => {
        await loadPlanets(url)
    },
    species: async (url) => {
        await loadSpecies(url)
    }
}

function loading() {
    const content = document.getElementById('main-content')
    content.innerHTML = '' // limpa os resultados anteriores

    const loadElement = document.createElement("div")
    loadElement.className = "loading"

    content.appendChild(loadElement)
}

window.onload = async () => {
    try {
        await loadRoutesAPI[currentPageName](currentPageUrl)
    } catch (error) {
        console.log(error)
    }

    const nextButton = document.getElementById('next-button')
    const prevButton = document.getElementById('prev-button')

    nextButton.addEventListener('click', async () => {
        if (!currentPageUrl) return
        await loadRoutesAPI[currentPageName](nextPageUrl)
    })
    prevButton.addEventListener('click', async () => {
        if (!currentPageUrl) return
        await loadRoutesAPI[currentPageName](prevPageUrl)
    })
}

async function loadCharacters(url) {
    const mainContent = document.getElementById('main-content')
    loading()

    try {

        const response = await fetch(url)
        const responseJson = await response.json()

        mainContent.innerHTML = '' // limpa os resultados anteriores

        responseJson.results.forEach((character) => {
            const card = document.createElement("div")
            card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
            card.className = "card"

            const characterNameBG = document.createElement("div")
            characterNameBG.className = "character-name-bg"

            const characterName = document.createElement("span")
            characterName.className = "character-name"
            characterName.innerText = `${character.name}`

            characterNameBG.appendChild(characterName)
            card.appendChild(characterNameBG)

            card.onclick = () => {
                modal.style.visibility = 'visible'

                const modalContent = document.getElementById('modal-content')
                modalContent.innerHTML = ''

                const characterImage = document.createElement("div")
                characterImage.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/characters/${character.url.replace(/\D/g, "")}.jpg')`
                characterImage.className = "character-image"

                const name = document.createElement("span")
                name.className = "character-details"
                name.innerText = `Nome: ${notUnknown(character.name)}`

                const characterHeight = document.createElement("span")
                characterHeight.className = "character-details"
                characterHeight.innerText = `Altura: ${convertHeight(character.height)}`

                const massa = document.createElement("span")
                massa.className = "character-details"
                massa.innerText = `Peso: ${convertMass(character.mass)}`

                const eyeColor = document.createElement("span")
                eyeColor.className = "character-details"
                eyeColor.innerText = `Cor dos olhos: ${convertValues(cores, character.eye_color)}`

                const birthYear = document.createElement("span")
                birthYear.className = "character-details"
                birthYear.innerText = `Nascimento: ${notUnknown(character.birth_year)}`

                modalContent.appendChild(characterImage)
                modalContent.appendChild(name)
                modalContent.appendChild(characterHeight)
                modalContent.appendChild(massa)
                modalContent.appendChild(eyeColor)
                modalContent.appendChild(birthYear)
            }

            mainContent.appendChild(card)
        })

        const nextButton = document.getElementById('next-button')
        const prevButton = document.getElementById('prev-button')

        nextPageUrl = responseJson.next
        prevPageUrl = responseJson.previous

        nextButton.disabled = !responseJson.next
        nextButton.style.visibility = responseJson.next ? 'visible' : 'hidden'

        prevButton.disabled = !responseJson.previous
        prevButton.style.visibility = responseJson.previous ? 'visible' : 'hidden'

        currentPageUrl = url

    } catch (error) {
        console.log('Erro ao carregar os personagens', error)
    }
}

modal.addEventListener('click', (e) => {
    if (e.target.id == 'modal') modal.style.visibility = 'hidden'
})

function convertEyeColor(eyeColor) {
    const cores = {
        "black": 'preto',
        "blue": 'azul',
        "blue-gray": 'cinza azulado',
        "brown": 'castanho',
        "gold": 'ouro',
        "green": 'verde',
        "hazel": 'avela',
        "orange": 'laranja',
        "pink": 'rosa',
        "red": 'vermelho',
        "unknown": 'desconhecida',
        "white": 'branco',
        "yellow": 'amarelo'
    }
    return cores[eyeColor.toLowerCase()] || eyeColor
}

function convertHeight(height) {
    if (height == 'unknown') return 'desconhecida'
    return (height / 100).toFixed(2)
}

function convertMass(mass) {
    if (mass == 'unknown') return 'desconhecido'
    return mass + ' kg'
}

function notUnknown(value) {
    if (value == 'unknown') return 'desconhecido'
    return value
}

const logo = document.getElementById('logo')
const iconToggle = document.getElementById('icon-toggle')

logo.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault()
    const body = document.getElementsByTagName('body')[0].clientWidth
    if (body <= 550) {
        if (logo.className == 'logo') {
            logo.className += ' active'
            iconToggle.style.marginTop = '15px'
            iconToggle.querySelector('i').className = 'fa-solid fa-sort-up'
        } else {
            logo.className = 'logo'
            iconToggle.querySelector('i').className = 'fa-solid fa-sort-down'
            iconToggle.style.marginTop = '0px'
        }
    } else {
        return document.location.reload();
    }
})

const footerLogo = document.getElementById('footer-logo')
footerLogo.onclick = () => document.location.reload()

async function loadPlanets(url) {
    const mainContent = document.getElementById('main-content')
    loading()

    try {

        const response = await fetch(url)
        const responseJson = await response.json()

        mainContent.innerHTML = '' // limpa os resultados anteriores

        responseJson.results.forEach((planets) => {
            const card = document.createElement("div")

            try {
                fetch(`https://starwars-visualguide.com/assets/img/planets/${planets.url.replace(/\D/g, "")}.jpg`).then((data) => {
                    if (data.ok) {
                        card.style.backgroundImage = `url(${data.url})`
                    } else {
                        card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/big-placeholder.jpg')`
                    }
                })
            } catch (error) {
                console.log('erro ao carregar imagem do planeta: ', planets.url.replace(/\D/g, ""), error)
            }

            card.className = "card"

            const planetsNameBG = document.createElement("div")
            planetsNameBG.className = "character-name-bg"

            const planetsName = document.createElement("span")
            planetsName.className = "character-name"
            planetsName.innerText = `${planets.name}`

            planetsNameBG.appendChild(planetsName)
            card.appendChild(planetsNameBG)

            // MODAL

            card.onclick = () => {
                modal.style.visibility = 'visible'

                const modalContent = document.getElementById('modal-content')
                modalContent.innerHTML = ''

                modalContent.style.height = 'auto'

                const name = document.createElement("span")
                name.className = "character-details"
                name.innerText = `${planets.name}`

                const planetsImage = document.createElement("div")

                planetsImage.style.backgroundImage = card.style.backgroundImage

                planetsImage.className = "character-image"

                const periodRotation = document.createElement("span")
                periodRotation.className = "character-details"
                periodRotation.innerText = `Periodo de Rotacao: ${notUnknown(planets.rotation_period)} dias`

                const orbitalPeriod = document.createElement("span")
                orbitalPeriod.className = "character-details"
                orbitalPeriod.innerText = `Periodo de orbita: ${notUnknown(planets.orbital_period)} dias`

                const diameter = document.createElement("span")
                diameter.className = "character-details"
                diameter.innerText = `Diametro: ${convertPopulation(planets.diameter)} km`

                const climate = document.createElement("span")
                climate.className = "character-details"
                climate.innerText = `Clima: ${convertValues(climates, planets.climate)}`

                const gravity = document.createElement("span")
                gravity.className = "character-details"
                gravity.innerText = `Gravidade: ${notUnknown(planets.gravity)}`

                const terrain = document.createElement("span")
                terrain.className = "character-details"
                terrain.innerText = `Terreno: ${convertValues(terrains, planets.terrain)}`

                const surface_water = document.createElement("span")
                surface_water.className = "character-details"
                surface_water.innerText = `Superficie da agua: ${notUnknown(planets.surface_water)}%`

                const population = document.createElement("span")
                population.className = "character-details"
                population.innerText = `Populacao: ${convertPopulation(planets.population)}`

                modalContent.appendChild(name)
                modalContent.appendChild(planetsImage)
                modalContent.appendChild(periodRotation)
                modalContent.appendChild(orbitalPeriod)
                modalContent.appendChild(diameter)
                modalContent.appendChild(climate)
                modalContent.appendChild(gravity)
                modalContent.appendChild(terrain)
                modalContent.appendChild(surface_water)
                modalContent.appendChild(population)
            }

            mainContent.appendChild(card)
        })

        const nextButton = document.getElementById('next-button')
        const prevButton = document.getElementById('prev-button')

        nextPageUrl = responseJson.next
        prevPageUrl = responseJson.previous

        nextButton.disabled = !responseJson.next
        nextButton.style.visibility = responseJson.next ? 'visible' : 'hidden'

        prevButton.disabled = !responseJson.previous
        prevButton.style.visibility = responseJson.previous ? 'visible' : 'hidden'

        currentPageUrl = url

    } catch (error) {
        console.log('Erro ao carregar os planetas', error)
    }
}

function convertClimate(climate) {
    if (!climate || climate.length == 0) return ''

    let firstClimate
    let climateARRAY = []

    if (Array.isArray(climate)) {
        let [a, ...b] = climate
        firstClimate = a
        climateARRAY = b
    } else {
        climate = climate.replace(/,\s|\s,/g, ",")
        climate = climate.split(",")
        let [a, ...b] = climate
        firstClimate = a
        climateARRAY = b
    }

    const climates = {
        "arid": 'arido',
        "artic": 'artico',
        "artificial temperate": 'artificialmente moderado',
        "frigid": 'frio',
        "frozen": 'congelado',
        "hot": 'quente',
        "humid": 'umido',
        "moist": 'chuvoso',
        "murky": 'sombrio',
        "polluted": 'poluido',
        "rocky": 'rochoso',
        "subartic": 'subartico',
        "superheated": 'superaquecido',
        "temperate": 'moderado',
        "tropical": 'tropical',
        "windy": 'ventoso',
        "unknown": 'desconhecido'
    }
    return ((climates[firstClimate.toLowerCase()] || firstClimate) + ", " + convertClimate(climateARRAY)).replace(/,\s+$/, "")
}

function convertTerrain(terrain) {
    if (!terrain || terrain.length == 0) return ''

    let firstTerrain
    let terrainARRAY = []

    if (Array.isArray(terrain)) {
        let [a, ...b] = terrain
        firstTerrain = a
        terrainARRAY = b
    } else {
        terrain = terrain.replace(/,\s|\s,/g, ",")
        terrain = terrain.split(",")
        let [a, ...b] = terrain
        firstTerrain = a
        terrainARRAY = b
    }

    const terrains = {
        "acid pools": 'piscinas de acido',
        "airless asteroid": 'asteroide sem ar',
        "ash": 'cinzas',
        "barren": 'esteril',
        "bogs": 'pantanos',
        "canyons": 'desfiladeiros',
        "caves": 'cavernas',
        "cities": 'cidades',
        "cityscape": 'paisagem urbana',
        "cliffs": 'falesias',
        "desert": 'deserto',
        "deserts": 'desertos',
        "fields": 'campos',
        "forests": 'florestas',
        "fungus forests": 'florestas de fungos',
        "gas giant": 'gasoso',
        "glaciers": 'geleiras',
        "grass": 'grama',
        "grasslands": 'pastagens',
        "grassy hills": 'colinas gramadas',
        "hills": 'colinas',
        "ice canyons": 'desfiladeiros de gelo',
        "ice caves": 'cavernas de gelo',
        "islands": 'ilhas',
        "jungle": 'selva',
        "jungles": 'selvas',
        "lakes": 'lago',
        "lava rivers": 'rios de lava',
        "mesas": 'planalto escarpado',
        "mountain": 'montanha',
        "mountain ranges": 'cordilheiras',
        "mountains": 'montanhas',
        "ocean": 'oceano',
        "oceans": 'oceanos',
        "plains": 'planicies',
        "plateaus": 'planaltos',
        "rainforests": 'florestas tropicais',
        "reefs": 'recifes',
        "rivers": 'rios',
        "rock": 'rochoso',
        "rock arches": 'arcos de pedra',
        "rocky": 'rochoso',
        "rocky canyons": 'desfiladeiros rochosos',
        "rocky deserts": 'desertos rochosos',
        "rocky islands": 'ilhas rochosas',
        "savanna": 'savana',
        "savannahs": 'savanas',
        "savannas": 'savanas',
        "scrublands": 'cerrado',
        "seas": 'mares',
        "sinkholes": 'dolinas',
        "swamp": 'pantano',
        "swamps": 'pantanos',
        "toxic cloudsea": 'mar nublado toxico',
        "tundra": 'tundra',
        "unknown": 'desconhecido',
        "urban": 'urbano',
        "valleys": 'vales',
        "verdant": 'verdejante',
        "vines": 'videiras',
        "volcanoes": 'vulcoes'
    }
    return ((terrains[firstTerrain.toLowerCase()] || firstTerrain) + ", " + convertTerrain(terrainARRAY)).replace(/,\s+$/, "")
}

function convertValues(json, value) {
    if (!value || value.length == 0) return ''

    let firstValue
    let valuesArray = []

    if (Array.isArray(value)) {
        let [a, ...b] = value
        firstValue = a
        valuesArray = b
    } else {
        value = value.replace(/,\s|\s,/g, ",")
        value = value.split(",")
        let [a, ...b] = value
        firstValue = a
        valuesArray = b
    }
    return ((json[firstValue.toLowerCase()] || firstValue) + ", " + convertValues(json, valuesArray)).replace(/,\s+$/, "")
}

function convertPopulation(population) {
    if (population == 'unknown') return 'desconhecido'
    let temp = population.split('')
    population = []
    let cont = 0
    for (let i = temp.length - 1; i >= 0; i--) {
        if (cont % 3 == 0 && cont != 0) {
            population.unshift('.')
            cont = 0
            i++
            continue
        }
        population.unshift(temp[i])
        cont++
    }
    return population.join('')
}

async function loadSpecies(url) {
    const mainContent = document.getElementById('main-content')
    loading()

    try {

        const response = await fetch(url)
        const responseJson = await response.json()

        mainContent.innerHTML = '' // limpa os resultados anteriores

        responseJson.results.forEach((species) => {
            const card = document.createElement("div")

            try {
                fetch(`https://starwars-visualguide.com/assets/img/species/${species.url.replace(/\D/g, "")}.jpg`).then((data) => {
                    if (data.ok) {
                        card.style.backgroundImage = `url(${data.url})`
                    } else {
                        card.style.backgroundImage = `url('https://starwars-visualguide.com/assets/img/big-placeholder.jpg')`
                    }
                })
            } catch (error) {
                console.log('erro ao carregar imagem do planeta: ', species.url.replace(/\D/g, ""), error)
            }

            card.className = "card"

            const speciesNameBG = document.createElement("div")
            speciesNameBG.className = "character-name-bg"

            const speciesName = document.createElement("span")
            speciesName.className = "character-name"
            speciesName.innerText = `${species.name}`

            speciesNameBG.appendChild(speciesName)
            card.appendChild(speciesNameBG)

            // MODAL

            card.onclick = () => {
                modal.style.visibility = 'visible'

                const modalContent = document.getElementById('modal-content')
                modalContent.innerHTML = ''

                modalContent.style.height = 'auto'

                const name = document.createElement("span")
                name.className = "character-details"
                name.innerText = `${species.name}`

                const speciesImage = document.createElement("div")
                speciesImage.style.backgroundImage = card.style.backgroundImage
                speciesImage.className = "character-image"

                const classification = document.createElement("span")
                classification.className = "character-details"
                classification.innerText = `classe: ${convertValues(classifications, species.classification)}`

                const designation = document.createElement("span")
                designation.className = "character-details"
                designation.innerText = `ordem: ${convertValues(designations, species.designation)}`

                const average_height = document.createElement("span")
                average_height.className = "character-details"
                average_height.innerText = `altura media: ${notUnknown(species.average_height)} cm`

                const average_lifespan = document.createElement("span")
                average_lifespan.className = "character-details"
                average_lifespan.innerText = `tempo de vida: ${notUnknown(species.average_lifespan)} anos`

                const language = document.createElement("span")
                language.className = "character-details"
                language.innerText = `idioma: ${notUnknown(species.language)}`

                const eyeColor = document.createElement("span")
                eyeColor.className = "character-details"
                eyeColor.innerText = `cor dos olhos: ${convertValues(cores, species.eye_colors)}`

                modalContent.appendChild(name)
                modalContent.appendChild(speciesImage)
                modalContent.appendChild(classification)
                modalContent.appendChild(designation)
                modalContent.appendChild(average_height)
                modalContent.appendChild(average_lifespan)
                modalContent.appendChild(language)
                modalContent.appendChild(eyeColor)
            }

            mainContent.appendChild(card)
        })

        const nextButton = document.getElementById('next-button')
        const prevButton = document.getElementById('prev-button')

        nextPageUrl = responseJson.next
        prevPageUrl = responseJson.previous

        nextButton.disabled = !responseJson.next
        nextButton.style.visibility = responseJson.next ? 'visible' : 'hidden'

        prevButton.disabled = !responseJson.previous
        prevButton.style.visibility = responseJson.previous ? 'visible' : 'hidden'

        currentPageUrl = url

    } catch (error) {
        console.log('Erro ao carregar as especies', error)
    }
}

const cores = {
    "black": 'preto',
    "blue": 'azul',
    "blue-gray": 'cinza azulado',
    "brown": 'castanho',
    "gold": 'ouro',
    "green": 'verde',
    "hazel": 'avela',
    "orange": 'laranja',
    "pink": 'rosa',
    "red": 'vermelho',
    "unknown": 'desconhecida',
    "white": 'branco',
    "yellow": 'amarelo'
}

const climates = {
    "arid": 'arido',
    "artic": 'artico',
    "artificial temperate": 'artificialmente moderado',
    "frigid": 'frio',
    "frozen": 'congelado',
    "hot": 'quente',
    "humid": 'umido',
    "moist": 'chuvoso',
    "murky": 'sombrio',
    "polluted": 'poluido',
    "rocky": 'rochoso',
    "subartic": 'subartico',
    "superheated": 'superaquecido',
    "temperate": 'moderado',
    "tropical": 'tropical',
    "windy": 'ventoso',
    "unknown": 'desconhecido'
}

const terrains = {
    "acid pools": 'piscinas de acido',
    "airless asteroid": 'asteroide sem ar',
    "ash": 'cinzas',
    "barren": 'esteril',
    "bogs": 'pantanos',
    "canyons": 'desfiladeiros',
    "caves": 'cavernas',
    "cities": 'cidades',
    "cityscape": 'paisagem urbana',
    "cliffs": 'falesias',
    "desert": 'deserto',
    "deserts": 'desertos',
    "fields": 'campos',
    "forests": 'florestas',
    "fungus forests": 'florestas de fungos',
    "gas giant": 'gasoso',
    "glaciers": 'geleiras',
    "grass": 'grama',
    "grasslands": 'pastagens',
    "grassy hills": 'colinas gramadas',
    "hills": 'colinas',
    "ice canyons": 'desfiladeiros de gelo',
    "ice caves": 'cavernas de gelo',
    "islands": 'ilhas',
    "jungle": 'selva',
    "jungles": 'selvas',
    "lakes": 'lago',
    "lava rivers": 'rios de lava',
    "mesas": 'planalto escarpado',
    "mountain": 'montanha',
    "mountain ranges": 'cordilheiras',
    "mountains": 'montanhas',
    "ocean": 'oceano',
    "oceans": 'oceanos',
    "plains": 'planicies',
    "plateaus": 'planaltos',
    "rainforests": 'florestas tropicais',
    "reefs": 'recifes',
    "rivers": 'rios',
    "rock": 'rochoso',
    "rock arches": 'arcos de pedra',
    "rocky": 'rochoso',
    "rocky canyons": 'desfiladeiros rochosos',
    "rocky deserts": 'desertos rochosos',
    "rocky islands": 'ilhas rochosas',
    "savanna": 'savana',
    "savannahs": 'savanas',
    "savannas": 'savanas',
    "scrublands": 'cerrado',
    "seas": 'mares',
    "sinkholes": 'dolinas',
    "swamp": 'pantano',
    "swamps": 'pantanos',
    "toxic cloudsea": 'mar nublado toxico',
    "tundra": 'tundra',
    "unknown": 'desconhecido',
    "urban": 'urbano',
    "valleys": 'vales',
    "verdant": 'verdejante',
    "vines": 'videiras',
    "volcanoes": 'vulcoes'
}

const classifications = {
    "amphibian": 'anfibio',
    "artificial": 'artificial',
    "gastropod": 'gastropode',
    "insectoid": 'insetoide',
    "mammal": 'mamifero',
    "mammals": 'mamiferos',
    "reptile": 'reptil',
    "reptilian": 'reptiliano',
    "sentient": 'senciente',
    "unknown": 'desconhecida'
}

const designations = {
    "reptilian": 'reptiliano',
    "sentient": 'senciente'
}
