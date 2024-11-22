const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));


let currentID = 1; // ID inicial

// Ruta para servir el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para recibir los resultados de la encuesta
// Ruta para recibir los resultados de la encuesta
app.post('/submit', (req, res) => {
    const { answers, total, result } = req.body;
    console.log('Respuestas recibidas:', answers); // Verificar si los datos están llegando correctamente
    console.log('Total:', total);
    console.log('Resultado:', result);

    const filePath = path.join(__dirname, 'resultados.xlsx');
    
    // Verificar si el archivo existe
    let workbook;
    if (fs.existsSync(filePath)) {
        workbook = xlsx.readFile(filePath); // Si existe, leerlo
    } else {
        workbook = xlsx.utils.book_new(); // Si no existe, crear uno nuevo
    }

    // Crear la hoja "Encuesta" si no existe
    let sheet = workbook.Sheets['Encuesta'];
    if (!sheet) {
        sheet = xlsx.utils.aoa_to_sheet([['ID', 'Pregunta 1', 'Pregunta 2', 'Pregunta 3', 'Pregunta 4', 'Total', 'Resultado']]);
        xlsx.utils.book_append_sheet(workbook, sheet, 'Encuesta');
    }

    // Aquí añades las respuestas y los resultados al archivo
    //const newRow = [currentID, ...answers, total, result];
    const newRow = [currentID, ...answers.slice(0, 4), total, result];
    xlsx.utils.sheet_add_aoa(sheet, [newRow], { origin: -1 });
    
    // Guardar el archivo actualizado
    xlsx.writeFile(workbook, filePath);

    currentID++; // Incrementar el ID para la próxima encuesta

    //res.send({ message: 'Encuesta guardada exitosamente' }); Responder al cliente
});



// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});