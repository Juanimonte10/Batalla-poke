async function mostrarInfo(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const data = await response.json()
    return data
}

// ── Generar inputs ──────────────────────────────────────────────
function generadorInputs(numJugador) {
    document.getElementById(`generar${numJugador}`).addEventListener("click", () => {
        const cantidad = parseInt(document.getElementById(`cantidad${numJugador}`).value)
        const contenedor = document.getElementById(`inputs${numJugador}`)

        if (isNaN(cantidad) || cantidad < 1 || cantidad > 6) {
            alert("Elegí entre 1 y 6 Pokémon")
            return
        }

        contenedor.innerHTML = ""

        for (let i = 1; i <= cantidad; i++) {
            const input = document.createElement("input")
            input.type = "number"
            input.id = `poke${numJugador}-${i}`
            input.placeholder = `Pokemon ${i}`
            contenedor.appendChild(input)

            // Delay escalonado: cada input aparece 80ms después del anterior
            const delay = i * 80
            setTimeout(() => {
                input.classList.add("input-animado")
            }, delay)
        }
    })
}

generadorInputs(1)
generadorInputs(2)

// ── Cargar equipo ───────────────────────────────────────────────
function cargarEquipo(numJugador) {
    document.getElementById(`btn${numJugador}`).addEventListener("click", async () => {
        const cantidad = parseInt(document.getElementById(`cantidad${numJugador}`).value)
        const equipo = []

        for (let i = 1; i <= cantidad; i++) {
            const index = parseInt(document.getElementById(`poke${numJugador}-${i}`).value)
            if (!isNaN(index)) {
                equipo.push(index)
            }
        }

        const promesas = equipo.map(id => mostrarInfo(id))
        const dataequi = await Promise.all(promesas)

        mostrarEquipo(dataequi, numJugador)
    })
}

cargarEquipo(1)
cargarEquipo(2)

// ── Mostrar equipo ──────────────────────────────────────────────
function mostrarEquipo(dataequi, numJugador) {
    const container = document.getElementById(`container${numJugador}`)
    container.innerHTML = ""

    let totalHP = 0
    let totalAttack = 0
    let totalDefense = 0

    dataequi.forEach((p, index) => {
        const hp      = p.stats.find(s => s.stat.name === "hp").base_stat
        const attack  = p.stats.find(s => s.stat.name === "attack").base_stat
        const defense = p.stats.find(s => s.stat.name === "defense").base_stat

        totalHP      += hp
        totalAttack  += attack
        totalDefense += defense

        // Creamos la card como elemento para poder animarla con delay
        const card = document.createElement("div")
        card.className = "poke-card"
        card.innerHTML = `
            <p><strong>ID:</strong> ${p.id}</p>
            <p><strong>Name:</strong> ${p.name}</p>
            <p><strong>HP:</strong> ${hp} | <strong>ATK:</strong> ${attack} | <strong>DEF:</strong> ${defense}</p>
            <img src="${p.sprites.front_default}" alt="${p.name}">
        `
        container.appendChild(card)

        // Delay escalonado: cada card aparece 120ms después de la anterior
        const delay = index * 120
        setTimeout(() => {
            card.classList.add("card-animada")
        }, delay)
    })

    // Totales aparecen después de todas las cards
    const delayTotales = dataequi.length * 120 + 100
    const totalesDiv = document.createElement("div")
    totalesDiv.className = "totales"
    totalesDiv.innerHTML = `
        <h2>Totales del equipo</h2>
        <p><strong>HP:</strong> ${totalHP}</p>
        <p><strong>Ataque:</strong> ${totalAttack}</p>
        <p><strong>Defensa:</strong> ${totalDefense}</p>
    `
    container.appendChild(totalesDiv)

    setTimeout(() => {
        totalesDiv.classList.add("totales-animado")
    }, delayTotales)
}

// ── Resultado ───────────────────────────────────────────────────
document.getElementById("resultado").addEventListener("click", () => {
    const results  = document.getElementById("results")
    const totales1 = document.querySelector("#container1 .totales")
    const totales2 = document.querySelector("#container2 .totales")

    if (!totales1 || !totales2) {
        results.innerHTML = "<p> Primero cargar los dos equipos</p>"
        return
    }

    // Flash blanco de batalla
    const flash = document.getElementById("flash-overlay")
    flash.classList.remove("flash-activo")
    void flash.offsetWidth // fuerza reflow para reiniciar la animación
    flash.classList.add("flash-activo")

    // Mostramos el resultado después del flash
    setTimeout(() => {
        const leerStats = (totalesDiv) => {
            const parrafos = totalesDiv.querySelectorAll("p")
            return {
                hp:      parseInt(parrafos[0].textContent.split(":")[1]),
                ataque:  parseInt(parrafos[1].textContent.split(":")[1]),
                defensa: parseInt(parrafos[2].textContent.split(":")[1])
            }
        }

        const t1 = leerStats(totales1)
        const t2 = leerStats(totales2)

        let victorias1 = 0
        let victorias2 = 0

        if (t1.hp      > t2.hp)      { victorias1++ } else if (t2.hp      > t1.hp)      { victorias2++ }
        if (t1.ataque  > t2.ataque)  { victorias1++ } else if (t2.ataque  > t1.ataque)  { victorias2++ }
        if (t1.defensa > t2.defensa) { victorias1++ } else if (t2.defensa > t1.defensa) { victorias2++ }

        let ganador
        if (victorias1 > victorias2)
            { ganador = " ¡Gana el Jugador 1!" }
        else if (victorias2 > victorias1) 
            { ganador = " ¡Gana el Jugador 2!" }
        else{ ganador = " ¡Empate!" }

        results.innerHTML = `
            <h2>${ganador}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Stat</th>
                        <th>Jugador 1</th>
                        <th>Jugador 2</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>HP</td>
                        <td>${t1.hp}</td>
                        <td>${t2.hp}</td>
                    </tr>
                    <tr>
                        <td>Ataque</td>
                        <td>${t1.ataque}</td>
                        <td>${t2.ataque}</td>
                    </tr>
                    <tr>
                        <td>Defensa</td>
                        <td>${t1.defensa}</td>
                        <td>${t2.defensa}</td>
                    </tr>
                </tbody>
            </table>
        `

        // Scroll suave hasta los resultados
        results.scrollIntoView({ behavior: "smooth", block: "start" })

    }, 300)
})

// ── Limpiar ─────────────────────────────────────────────────────
document.getElementById("clear").addEventListener("click", () => {
    document.getElementById("container1").innerHTML = ""
    document.getElementById("container2").innerHTML = ""
    document.getElementById("inputs1").innerHTML    = ""
    document.getElementById("inputs2").innerHTML    = ""
    document.getElementById("cantidad1").value      = ""
    document.getElementById("cantidad2").value      = ""
    document.getElementById("results").innerHTML    = ""
})