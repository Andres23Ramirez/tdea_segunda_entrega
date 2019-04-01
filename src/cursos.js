const id = {
    demand: true,
    alias: 'i'
}

const nombreCurso = {
    demand: true,
    alias: 'nc'
}

const descripcion = {
    demand: true,
    alias: 'd'
}

const valor = {
    demand: true,
    alias: 'v'
}

const creacion = {
    id,
    nombreCurso,
    descripcion,
    valor
}

const argv = require('yargs')
            .command('crear','Crear un curso')
            .argv;

module.exports = {
    argv
};