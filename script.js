;(function(){
    'use strict'

    var palabras = [
        'AUTO',
        'PERRO',
        'AVION',
        'AUDIFONO',
        'COMPUTADORA',
        'ANIMAL'
    ]

    var juego = null
    var finalizado = false

    var $html = {
        muneco: document.getElementById('muneco'),
        acertaste: document.querySelector('.acertaste'),
        error: document.querySelector('.error')
    }

    function dibujar(juego) {
        
        var $elem
        $elem = $html.muneco

        var estado = juego.estado
        if(estado === 8) {
            estado = juego.previo
        }
        $elem.src = './img/state/0' + estado + '.png'

        
        var palabra = juego.palabra
        let acertaste = juego.acertaste
        $elem = $html.acertaste
        
        $elem.innerHTML = ""
        for (let letra of palabra) {
            let $span = document.createElement('span')
            let $txt = document.createTextNode('')
            if (acertaste.has(letra)) {
                $txt.nodeValue = letra
            }
            $span.setAttribute('class', 'letra adivinada')
            $span.appendChild($txt)
            $elem.appendChild($span)
        }
        
        var error = juego.error
        $elem = $html.error
        
        $elem.innerHTML = ""
        for (let letra of error) {
            let $span = document.createElement('span')
            let $txt = document.createTextNode(letra)
            $span.setAttribute('class', 'letra errada')
            $span.appendChild($txt)
            $elem.appendChild($span)
        }
    }

    function adivinar(juego, letra){
        var estado = juego.estado
        
        if (estado === 1 || estado === 8){
            return
        }

        var acertaste = juego.acertaste
        var error = juego.error
        if (acertaste.has(letra) || error.has(letra)) {
            return
        }

        var palabra = juego.palabra
        var letras = juego.letras
        
        if (letras.has(letra)) {
            
            acertaste.add(letra)
            
            juego.restante --

            
            if (juego.restante === 0) {
                juego.previo = juego.estado
                juego.estado = 8
            } 
        } else {
            
            juego.estado --
            
            error.add(letra)
        }
    }

    window.onkeypress = function adivinarLetra(e){
        var letra = e.key
        letra = letra.toUpperCase()
        if(/[^A-ZÑ]/.test(letra)){
            return
        }
        adivinar(juego, letra)
        var estado = juego.estado
        if (estado === 8 && !finalizado) {
            setTimeout(alertaGanado, 0)
            finalizado = true
        }else if (estado === 1 && !finalizado) {
            setTimeout(alertaPerdido, 0)


            finalizado = true
        }
        dibujar(juego)
    }

    window.juegoNuevo = function juegoNuevo(){
        var palabra = palabraAleatoria()
        juego = {}
        juego.palabra = palabra
        juego.estado = 7
        juego.acertaste = new Set()
        juego.error = new Set()
        finalizado = false

        var letras = new Set()
        for (let letra of palabra) {
            letras.add(letra)
        }
        juego.letras = letras
        juego.restante = letras.size

        dibujar(juego)
        console.log(juego)
    }

    
    function palabraAleatoria() {
        var index = Math.trunc(Math.random() * palabras.length)
        return palabras[index]
    }

    function alertaGanado(){
        alert("Felicidades ganaste!")        
    }

    function alertaPerdido(){
        let palabra = juego.palabra
        alert("Lo siento, perdiste... la palabra era: " + palabra)
    }

    juegoNuevo()

}());

function rendirse(){
    let respuesta = confirm("¿Estás seguro de rendirte?")
    if(respuesta == true) {
        juegoNuevo()
    }
}

document.getElementById('openKeyboard').addEventListener('click', function(){
    var inputElement = document.getElementById('hiddenInput');
    inputElement.style.visibility = 'visible'; // unhide the input
    inputElement.focus(); // focus on it so keyboard pops
    inputElement.style.visibility = 'hidden'; // hide it again
});