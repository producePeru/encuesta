function reproducirMensaje() {
    const mensaje = "Bienvenidos al cuestionario de PRODUCE, hacer click en iniciar encuesta para medir tu nivel de digitalización";

    const utterance = new SpeechSynthesisUtterance(mensaje);
    utterance.lang = 'es-MX';
    utterance.voice = getVoiceByLang('es-MX');

    window.speechSynthesis.speak(utterance);
}

function getVoiceByLang(lang) {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(voice => voice.lang === lang) || voices[0];
}

window.onload = function () {
    reproducirMensaje();
    document.getElementById("comenzarBtn").addEventListener("click", comenzarEncuesta);
};

let currentQuestion = 0;
const preguntas = [
    {
        pregunta: "Yo soy:",
        opciones: [
            { texto: "Emprendedor", valor: 2 },
            { texto: "Servidor Público", valor: 2 },
            { texto: "Comerciante", valor: 2 },
            { texto: "Otros (Profesional, estudiante, docente y más)", valor: 2 }
        ]
    },
    {
        pregunta: "Las herramientas digitales que utilizo más:",
        opciones: [
            { texto: "Redes sociales", valor: 2 },
            { texto: "Páginas web (Marketplace, blogs, otros)", valor: 3 },
            { texto: "Aplicaciones moviles", valor: 4 },
            { texto: "No uso herramientas digitales", valor: 1 }
        ]
    },
    {
        pregunta: "Para comunicarme en mi trabajo utilizo más:",
        opciones: [
            { texto: "Mensajeria instantánea (WhatsApp, Telegram, otros)", valor: 4 },
            { texto: "Llamadas", valor: 1 },
            { texto: "Correo electronico", valor: 3 },
            { texto: "SMS", valor: 2 }
        ]
    },
    {
        pregunta: "Para realizar mis pagos utilizo más:",
        opciones: [
            { texto: "Billeteras digitales (Yape, Plin, BIM, otros)", valor: 4 },
            { texto: "Transferencias bancarias", valor: 2 },
            { texto: "P.O.S (Niubiz, Visa, Izipay, otros", valor: 3 },
            { texto: "Efectivo", valor: 1 }
        ]
    },
   /* {
        pregunta: "¿Cuentas con una página web para tu negocio?",
        opciones: [
            { texto: "Sí", valor: 1 },
            { texto: "No", valor: 2 },
            { texto: "Planeo hacerlo", valor: 3 },
            { texto: "No es necesario", valor: 4 }
        ]
    }*/
];

let respuestas = [];
let total = 0;

function comenzarEncuesta() {
    mostrarPregunta();
    document.getElementById("comenzarBtn").style.display = "none"; // Ocultar el botón de comenzar
}

function mostrarPregunta() {
    if (currentQuestion < preguntas.length) {
        const pregunta = preguntas[currentQuestion];
        const encuestaContainer = document.getElementById("encuestaContainer");

        encuestaContainer.innerHTML = ''; // Limpiar contenido anterior

        // Título de la pregunta
        const preguntaElement = document.createElement("h3");
        preguntaElement.textContent = pregunta.pregunta;
        encuestaContainer.appendChild(preguntaElement);

        // Agregar las imágenes debajo de la pregunta (antes de las opciones)
        const imagenesContainer = document.createElement("div");
        imagenesContainer.classList.add("imagenes-container");

        // Definir las imágenes específicas para cada pregunta
        const imagenes = [
            `imagen/pregunta${currentQuestion + 1}_imagen1.jpg`, // Ruta local para la primera imagen
            `imagen/pregunta${currentQuestion + 1}_imagen2.jpg`, // Ruta local para la segunda imagen
            `imagen/pregunta${currentQuestion + 1}_imagen3.jpg`, // Ruta local para la tercera imagen
            `imagen/pregunta${currentQuestion + 1}_imagen4.jpg`  // Ruta local para la cuarta imagen
        ];

        // Crear las imágenes y añadirlas al contenedor
        imagenes.forEach((imagenRuta) => {
            const img = document.createElement("img");
            img.src = imagenRuta; // Usar la ruta local
            img.classList.add("imagen");
            imagenesContainer.appendChild(img);
        });

        encuestaContainer.appendChild(imagenesContainer);

        // Contenedor de opciones (usamos la clase de flexbox)
        const opcionesContainer = document.createElement("div");
        opcionesContainer.classList.add("opciones-container"); // Aplicamos la clase que tiene el estilo de flexbox
        encuestaContainer.appendChild(opcionesContainer);

        // Crear los botones para las opciones
        pregunta.opciones.forEach((opcion) => {
            const button = document.createElement("button");
            button.textContent = opcion.texto;
            button.classList.add("btn", "btn-outline-primary", "opcion-btn"); // Aplicamos la clase de los botones
            button.setAttribute("data-value", opcion.valor);

            button.onclick = function () {
                respuestas[currentQuestion] = opcion.valor;
                total += opcion.valor;
                currentQuestion++;
                mostrarPregunta();
            };

            opcionesContainer.appendChild(button);
        });

    } else {
        mostrarResultado();
    }
}



function mostrarResultado() {
    const encuestaContainer = document.getElementById("encuestaContainer");
    encuestaContainer.innerHTML = ''; // Limpiar contenido anterior

    // Mostrar el botón "Enviar Encuesta"
    const submitButton = document.createElement("button");
    submitButton.textContent = "Enviar Encuesta";
    submitButton.classList.add("btn", "btn-success", "mt-3");
    submitButton.onclick = function () {
        enviarEncuesta();
        mostrarImagenResultado(); // Mostrar la imagen correspondiente al presionar el botón
    };
    encuestaContainer.appendChild(submitButton);
}

// Esta función se llama al presionar "Enviar Encuesta"
function mostrarImagenResultado() {
    const encuestaContainer = document.getElementById("encuestaContainer");
    encuestaContainer.innerHTML = ''; // Limpiar contenido anterior

    // Títulos
    const nivelElement = document.createElement("h3");
    nivelElement.textContent = "Nivel de digitalización";
    nivelElement.classList.add("nivel-text"); // Añadir la clase para el estilo
    encuestaContainer.appendChild(nivelElement);

    const resultadoTextElement = document.createElement("p");
    resultadoTextElement.textContent = "Tu resultado según el formulario es:";
    resultadoTextElement.classList.add("resultado-texto"); // Añadir la clase para el estilo
    encuestaContainer.appendChild(resultadoTextElement);

    // Crear la imagen según el resultado (en base al total)
    const img = document.createElement("img");
    let imagenRuta = '';

    if (total < 8) {
        imagenRuta = 'imagen/normal.jpg'; // Imagen para "baja"
    } else if (8 <=total  && total < 11) {
        imagenRuta = 'imagen/bueno.jpg'; // Imagen para "media"
    } else {
        imagenRuta = 'imagen/excelente.jpg'; // Imagen para "alta"
    }

    img.src = imagenRuta; // Ruta a la imagen
    img.alt = "Resultado"; // Texto alternativo para la imagen

    // Contenedor para la imagen y centrarla
    const imagenContainer = document.createElement("div");
    imagenContainer.classList.add("imagen-container");
    imagenContainer.appendChild(img);
    img.classList.add("resultado-imagen"); // Clase para la imagen
    encuestaContainer.appendChild(img);

    // Botón "Volver al inicio"
    const volverButton = document.createElement("button");
    volverButton.textContent = "Volver al inicio";
    volverButton.classList.add("volver-boton"); // Clase para el botón
    volverButton.onclick = function () {
        window.location.reload(); // Recargar la página para volver al inicio
    };
    encuestaContainer.appendChild(volverButton);
}


function enviarEncuesta() {
    const data = {
        answers: respuestas,  // Array con las respuestas
        total: total,         // Total calculado
        result: total < 8 ? 'Baja' : total < 11 ? 'Media' : 'Alta'  // Resultado basado en el total
    };

    fetch('https://programa.soporte-pnte.com/api/public/survey', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)  // Enviar los datos como JSON
    })
    .then(response => response.json())
    .then(data => {
        alert("Gracias por participar");  // Muestra el mensaje de éxito recibido desde el servidor
    })
    .catch((error) => {
        console.error('Error:', error);  // Muestra el error en consola si ocurre
    });
}

function obtenerDatosDeEncuesta() {

    fetch('https://programa.soporte-pnte.com/api/public/surveys', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); 
    })
    .then(data => {
        const tablaBody = document.querySelector('#tabla-resultados tbody');

        tablaBody.innerHTML = '';

        data.data.forEach((item, idx) => {
            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>${idx + 1}</td>
                <td>${item.question1}</td>
                <td>${item.question2}</td>
                <td>${item.question3}</td>
                <td>${item.question4}</td>
                <td>${item.total}</td>
                <td>${item.status}</td>
                <td>${item.created_at}</td>
            `;

            tablaBody.appendChild(fila);
        });

        // const resultado = document.getElementById('resultado');
        // resultado.textContent = JSON.stringify(data, null, 2); 
    })
    .catch(error => {
        console.error('Error:', error); // Muestra el error en consola si ocurre
        const resultado = document.getElementById('resultado');
        resultado.textContent = 'Ocurrió un error al obtener los datos.';
    });
}



pregunta.opciones.forEach((opcion) => {
    const button = document.createElement("button");
    button.classList.add("btn", "btn-outline-primary", "opcion-btn");
    button.setAttribute("data-value", opcion.valor);

    // Crear un contenedor para la opción
    const spanContainer = document.createElement("span");

    // Agregar el ícono dentro del botón al lado del texto
    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-check-circle"); // El ícono que deseas usar (puedes cambiarlo)

    // Crear un contenedor para el texto
    const textoOpcion = document.createElement("span");
    textoOpcion.textContent = opcion.texto;

    // Agregar el ícono y el texto al contenedor
    spanContainer.appendChild(icon);
    spanContainer.appendChild(textoOpcion);

    // Agregar el contenedor de texto e ícono al botón
    button.appendChild(spanContainer);

    button.onclick = function () {
        respuestas[currentQuestion] = opcion.valor;
        total += opcion.valor;6
        currentQuestion++;
        mostrarPregunta();
    };

    opcionesContainer.appendChild(button);
});