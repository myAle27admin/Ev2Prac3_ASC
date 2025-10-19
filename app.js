const botonBuscar = document.getElementById("botonBuscar");
const inputNombre = document.getElementById("nombre")
const id = document.getElementById("id")
const nombre = document.getElementById("nombreP")
const descripcion = document.getElementById("descripcion");
const habitat = document.getElementById("habitat");
const altura = document.getElementById("altura")
const peso = document.getElementById("peso")
const tipo = document.getElementById("tipo")
const estadisticas = document.getElementById("estadisticas")
const listaHabilidades = document.getElementById("listaHabilidades")
const imagen = document.getElementById("imagen")
const spriteFrontal = document.getElementById("spritef")
const spriteTrasero = document.getElementById("spritet")
const sonido = document.getElementById("sonido")
const traduccionStats = {
    hp: "Puntos de Salud (PS)",
    attack: "Ataque",
    defense: "Defensa",
    "special-attack": "Ataque Especial",
    "special-defense": "Defensa Especial",
    speed: "Velocidad"
};

async function buscarPokemon(){
    const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/" + inputNombre.value);
    const infoPokemon = await respuesta.json();

    //Datos basicos
    nombre.innerText = infoPokemon.name.charAt(0).toUpperCase() + infoPokemon.name.slice(1);
    id.innerText = infoPokemon.id;
    altura.innerText = (infoPokemon.height / 10) + " m";
    peso.innerText = (infoPokemon.weight / 10) + " kg";

    // Obtener detalles adicionales (species)
    const respuestaSpecies = await fetch(infoPokemon.species.url);
    const dataSpecies = await respuestaSpecies.json();

    // Buscar una descripción en español
    let textoDescripcion = "Descripción no disponible.";

    for (let i = 0; i < dataSpecies.flavor_text_entries.length; i++) {
        const entrada = dataSpecies.flavor_text_entries[i];
        if (entrada.language.name === "es") {
            textoDescripcion = entrada.flavor_text.replace(/\n|\f/g, " ");
            break;
        }
    }

    // Mostrar descripción
    descripcion.innerText = textoDescripcion;

    // Mostrar hábitat
    if (!dataSpecies.habitat) {
        habitat.innerText = "Desconocido";
    } else if (dataSpecies.habitat.name === "rare") {
        habitat.innerText = "Raro";
    } else {
        habitat.innerText = dataSpecies.habitat.name;
    }

    //mostrar tipos
    tipo.innerHTML = "";
    infoPokemon.types.forEach(t => {
        const item = document.createElement("li");
        item.innerText = t.type.name;
        tipo.appendChild(item);
    })

    //mostrar estadisticas base
    estadisticas.innerHTML = "";
    infoPokemon.stats.forEach(est => {
        const li = document.createElement("li");
        const nombreStat = traduccionStats[est.stat.name] || est.stat.name;
        li.innerText = `${nombreStat}: ${est.base_stat}`;
            estadisticas.appendChild(li);
    });
    
    // HABILIDADES (en español con descripción)
    listaHabilidades.innerHTML = "";
    for (let hab of infoPokemon.abilities) {
    const respuesta = await fetch(hab.ability.url);
    const datos = await respuesta.json();

    let nombreES = "Nombre no disponible";
    let descripcionES = "Sin descripción disponible.";

    for (let n of datos.names) {
        if (n.language.name === "es") {
            nombreES = n.name;
            break;
        }
    }

    for (let f of datos.flavor_text_entries) {
        if (f.language.name === "es") {
            descripcionES = f.flavor_text.replace(/\n|\f/g, " ");
            break;
        }
    }

    const li = document.createElement("li");
    li.innerHTML = `<strong>${nombreES}</strong>: ${descripcionES}`;
    listaHabilidades.appendChild(li);
    }

    //imagenes
    imagen.src = infoPokemon.sprites.other['official-artwork'].front_default;
    spriteFrontal.src = infoPokemon.sprites.front_default;
    spriteTrasero.src = infoPokemon.sprites.back_default;

    //sonido
    sonido.src = infoPokemon.cries.latest;
}

botonBuscar.addEventListener("click", e =>{
    e.preventDefault();
    buscarPokemon();
});