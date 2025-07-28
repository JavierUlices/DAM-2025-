class Calculadora {
    constructor(valorPrevioTextElement, valorActualTextElement) {
        this.valorPrevioTextElement = valorPrevioTextElement
        this.valorActualTextElement = valorActualTextElement
        this.borrarTodo()
    }

    borrarTodo() {
        this.valorActual = ''
        this.valorPrevio = ''
        this.operacion = undefined
        this.finOperacion = false //  Se añadió nuevo codigo
        this.operacionCompleta = '' // Se añadió nuevo codigo
    }

    borrar() {
        this.valorActual = this.valorActual.toString().slice(0, -1)
    }

    agregarNumero(numero) {
        if (this.finOperacion) {           // Limpia después de presionar "="
            this.valorActual = ''
            this.finOperacion = false
        }
        if (numero === '.' && this.valorActual.includes('.')) return
        if (this.valorActual.length >= 11) return // Limite a 11 caracteres
        this.valorActual = this.valorActual.toString() + numero.toString()
    }

    elejirOperacion(operacion) {
        if (this.valorActual === '') return
        if (this.valorPrevio !== '') {
            this.calcular()
        }
        this.operacion = operacion
        this.valorPrevio = this.valorActual
        this.valorActual = ''
    }

    calcular() {
        let resultado
        const valor_1 = parseFloat(this.valorPrevio)
        const valor_2 = parseFloat(this.valorActual)
        if (isNaN(valor_1) || isNaN(valor_2)) return

        switch (this.operacion) {
            case '+':
                resultado = valor_1 + valor_2
                break
            case '-':
                resultado = valor_1 - valor_2
                break
            case 'x':
                resultado = valor_1 * valor_2
                break
            case '÷':
                resultado = valor_1 / valor_2
                break
            default:
                return
        }

        this.operacionCompleta = `${this.obtenerNumero(this.valorPrevio)} ${this.operacion} ${this.obtenerNumero(this.valorActual)} =` // Muestra la operación
        this.valorActual = resultado
        this.operacion = undefined
        this.valorPrevio = ''
        this.finOperacion = true // Marca que se presionó "="
    }

    porcentaje() { // agregando Nuevo método
        if (this.valorActual === '') return
        this.valorActual = (parseFloat(this.valorActual) / 100).toString()
    }

    obtenerNumero(numero) {
        const cadena = numero.toString()
        const enteros = parseFloat(cadena.split('.')[0])
        const decimales = cadena.split('.')[1]
        let mostrarEnteros

        if (isNaN(enteros)) {
            mostrarEnteros = ''
        } else {
            mostrarEnteros = enteros.toLocaleString('en', { maximumFractionDigits: 0 })
        }

        if (decimales != null) {
            return `${mostrarEnteros}.${decimales}`
        } else {
            return mostrarEnteros
        }
    }

    actualizarPantalla() {
        this.valorActualTextElement.innerText = this.obtenerNumero(this.valorActual)
        if (this.finOperacion) {
            this.valorPrevioTextElement.innerText = this.operacionCompleta // Aqui Muestra operación completa tras "="
        } else if (this.operacion != null) {
            this.valorPrevioTextElement.innerText = `${this.obtenerNumero(this.valorPrevio)} ${this.operacion}`
        } else {
            this.valorPrevioTextElement.innerText = ''
        }
    }
}

// Inicialización
const numeroButtons = document.querySelectorAll('[data-numero]')
const operacionButtons = document.querySelectorAll('[data-operacion]')
const igualButton = document.querySelector('[data-igual]')
const porcentajeButton = document.querySelector('[data-porcentaje]')
const borrarButton = document.querySelector('[data-borrar]')
const borrarTodoButton = document.querySelector('[data-borrar-todo]')
const valorPrevioTextElement = document.querySelector('[data-valor-previo]')
const valorActualTextElement = document.querySelector('[data-valor-actual]')

const calculator = new Calculadora(valorPrevioTextElement, valorActualTextElement)

// Eventos
numeroButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.agregarNumero(button.innerText)
        calculator.actualizarPantalla()
    })
})

operacionButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.elejirOperacion(button.innerText)
        calculator.actualizarPantalla()
    })
})

igualButton.addEventListener('click', _button => {
    calculator.calcular()
    calculator.actualizarPantalla()
})

borrarTodoButton.addEventListener('click', _button => {
    calculator.borrarTodo()
    calculator.actualizarPantalla()
})

borrarButton.addEventListener('click', _button => {
    calculator.borrar()
    calculator.actualizarPantalla()
})

// Agregando Botón de porcentaje funcional
porcentajeButton.addEventListener('click', () => {
    calculator.porcentaje()
    calculator.actualizarPantalla()
})

/*Laboratorio:
1. Arreglar bug que limite los numeros en pantalla
2. Funcionabilidad de boton de porcentaje
3. Si lo que se presiona despues de igual es un numero entonces que borre el resultado anterior e inicie una nueva operacion
4. Muestre la operacion completa en el display superior
*/