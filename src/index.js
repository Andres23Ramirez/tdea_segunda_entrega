const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const { argv } = require('./cursos');
const fs = require('fs');
/*require('../helpers/helpers');*/

const app = express();
app.use(bodyParser.urlencoded({extended: false}));

cursos=[];
estudiantes=[];
let mensaje = '';

const datos = JSON.stringify(cursos);
fs.writeFile('./cursos.json', datos, error => {
    if (error)
      console.log(error);
    else
      console.log('El archivo datos cursos fue creado');
  });

const datos_estudiante = JSON.stringify(estudiantes);
fs.writeFile('./inscritos.json', datos_estudiante, error => {
    if (error)
    console.log(error);
    else
    console.log('El archivo inscritos fue creado');
});
/*const directorio_publico = path.join(__dirname, '../public' );
const directorio_partials = path.join(__dirname,'../partials');
app.use(express.static(directorio_publico));
app.use(bodyParser.urlencoded({extended: false}));
hbs.registerPartials(directorio_partials);

*/
app.set('view engine', 'hbs');

app.get('/', (req, res) =>{
    res.render('index', {
        estudiante: 'sebastian'
    });
});

app.get('/cursos/crear', (req, res) =>{
    res.render('./cursos/crear', {
        estudiante: 'sebastian'
    });
});

app.get('/cursos/ver', (req, res) =>{
    cursos = require('../cursos.json');
    console.log(cursos);
    res.render('./cursos/ver', {
        cursos: cursos
    });
});

app.get('/cursos/inscribir', (req, res) =>{
    cursos = require('../cursos.json');
    res.render('./cursos/inscribir', {
        cursos: cursos
    });
});

app.post('/cursos/inscribir', (req, res) =>{
    cursos = require('../cursos.json');
    const estudiantes1 = require('../inscritos.json');
    console.log('inscribir: ',req.body);
    
    const est = estudiantes1.find(nom => nom.id == req.body.id)

    if(!est){
        const estudiante = {
            id: req.body.id,
            nombre: req.body.nombre,
            correo: req.body.correo,
            telefono: req.body.telefono,
            cursos: []
        }
        const curso_ins = cursos.find(nom => nom.id == req.body.curso)
        estudiante.cursos.push(curso_ins);
        estudiantes1.push(estudiante);
        const datos = JSON.stringify(estudiantes1);
        fs.writeFile('./inscritos.json', datos, error => {
            if (error)
            console.log(error);
            else
            console.log('El archivo fue creado');
        });
        mensaje = 'Curso inscrito';
    }else{
        const est_curso = est.cursos.find(nom => nom.id == req.body.curso);

        if(!est_curso){
            const curso_ins = cursos.find(nom => nom.id == req.body.curso);
            est.cursos.push(curso_ins);
            const datos = JSON.stringify(estudiantes);
            fs.writeFile('./inscritos.json', datos, error => {
                if (error)
                console.log(error);
                else
                console.log('El archivo fue creado');
            });
            mensaje = 'Curso inscrito';
        }else{
            mensaje = 'Ya esta registrado en este curso';
        }        
    }    

    res.render('./cursos/inscribir', {
        cursos: cursos,
        mensaje: mensaje
    });
});

app.get('/cursos/inscritos', (req, res) =>{
    cursos = require('../cursos.json');
    estudiantes = require('../inscritos');
    cursos_env = [];

    estudiantes.forEach(estudiante => {
        estudiante.cursos.forEach(curso =>{
            const curso_ins = cursos_env.find(nom => nom.id == curso.id);
            if(!curso_ins){
                curso.inscritos.push(estudiante);
                cursos_env.push(curso);                
            }            
        });
    });

    res.render('./cursos/inscritos', {
        cursos: cursos_env
    });
});

app.post('/cursos/crear', (req, res) =>{
    const curso = {
        id: req.body.id,
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        valor: req.body.valor,
        modalidad: req.body.modalidad,
        intensidad: req.body.intensidad,
        estado: 'disponible',
        inscritos: []
    }

    cursos = require('../cursos.json');

    const duplicado = cursos.find(nom => nom.id == curso.id)
    
    if(!duplicado){
        cursos.push(curso);
        console.log('lista de cursos',cursos);
        const datos = JSON.stringify(cursos);
        fs.writeFile('./cursos.json', datos, error => {
            if (error)
            console.log(error);
            else
            console.log('El archivo fue creado');
        });
        mensaje = 'Curso creado';
    }else{
        mensaje = 'El curso ya exite';
    }
    
    res.render('./cursos/crear', {
        mensaje: mensaje
    });
});


/*
app.post('/calculos',(req, res)=>{
    res.render('calculos', {
        estudiante: req.body.nombre,
        nota1: parseInt(req.body.nota1),
        nota2: parseInt(req.body.nota2),
        nota3: parseInt(req.body.nota3)
    });
});

app.get('*',(req, res)=>{
    res.render('error',{
        estudiante: 'error'
    });
});
*/

console.log(argv);

app.listen(3000, ()=>{
    console.log('Corriendo en el puerto 3000')
});