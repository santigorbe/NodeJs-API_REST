//http://localhost:3000/api/articulos/

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

let app = express();

app.use(express.json());
//Cors para poder pedir la informacion desde una pagina externa 
app.use(cors());
//Armamos la conexion
var conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'articulosdb'
});

conexion.connect(function(err){
    if(err){
        throw err;
    }else{
        console.log('Conexion con la bd exitosa')
    }
});
app.get('/', function(req,res){
    res.send('Api de Santiago Gorbea');    
});
app.listen('3000', function(){
    console.log('Servidor iniciado ' );
});

//Operaciones de la api

//Pedimos todos los articulos
app.get('/api/articulos', (req,res) => {
conexion.query('SELECT * FROM articulos', (err,filas)=>{
if(err){
    throw err;
}else{
    res.send(filas);
}
}); });
//Pedimos un articulos en particular
app.get('/api/articulos/:id', (req,res) => {
conexion.query('SELECT * FROM articulos where id = ?',[req.params.id],(err,fila)=>{
    if(err){
        throw err;
    }else{
        res.send(fila);
        //Para pedir un dato en especifico
        //res.send(fila[0].descripcion);
    }
    }); });

//Crear un articulo
app.post('/api/articulos', (req,res) =>{
    let data = {descripcion: req.body.descripcion ,precio:req.body.precio ,stock: req.body.stock};
    let sql = 'INSERT INTO articulos SET ?';
    conexion.query(sql, data, function(err,results){
        if(err){
            throw err;
        }else{
            res.send(results);
        }
    });
});

//Editar articulos
app.put('/api/articulos/:id',(req,res)=>{
    let id = req.params.id;
    let descripcion = req.body.descripcion;
    let precio = req.body.precio;
    let stock = req.body.stock;
    let sql = 'UPDATE articulos SET descripcion=?,precio=?, stock=? WHERE id=?';

    conexion.query(sql,[descripcion,precio,stock,id], function(err,results){
        if(err){
            throw err;
        }else{
            res.send(results);
        }
    });
});

//Eliminar articulos
app.delete('/api/articulos/:id', (req,res) =>{
conexion.query('DELETE FROM articulos WHERE id = ?', [req.params.id], (err,filas) =>{
        if(err){
            throw err;
        }else{
            res.send(filas);
        }
    });
});

//Agregar el cors para que pueda usarlo con otras paginas 