async function mostrarInfo(){
    const id=Math.floor(Math.random()*1025)+1
    const response= await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    const data= await response.json()
    console.log("Funciona por consola ")
    return data
}

document.getElementById("btn").addEventListener("click", async ()=>{
    const pokemones=[]
    for(let i=0;i<5;i++){
        pokemones.push(mostrarInfo()) // voy usar una promise
    }
    const resultado=await Promise.all(pokemones)
    mostrarPoke(resultado)
})
function mostrarPoke(resultado){
    const container=document.getElementById("container")
    container.innerHTML="" //para limpiar una sola vez
    // si lo hubiese puesto en el foreach me hubiese mostrado el ultimo
resultado.forEach(p => {
    container.innerHTML+=`
    <p><strong> ID: </strong> ${p.id} </p>
    <p><strong> Name: </strong> ${p.name} </p>
    <p>Stats: ${p.stats.map(s=>`${s.stat.name}:${s.base_stat}`).join("<br>")} </p>
    <img src= "${p.sprites.front_default}">
    `
});
}
