//http://localhost:3000/api/articulos/

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
require('dotenv').config();
let app = express();


app.use(express.json());
app.use(express.urlencoded({extended:false}));
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
    res.send('Api de Santiago Gorbea.');    
});

// app.get('/login', (req,res)=>{
//     res.send(`
//     <html>
//     <head>
//     <title>Login</title>
//     </head>
//     <body>
//     <form method='POST' action='/auth'>
//         Nombre de usuario:<input type='text' name='text'/> <br/>
//         Contraseña:<input type='password' name='password'/> <br/>
//         <input type='submit' value='Iniciar seción'/>
//     </form>
//     </body>
//     </html>   
//     `)
// });
// app.post('/auth', (req,res) =>{
//     const {username,password} = req.body;
//     //Consulatar a la base de datos
    
//     const user = {username:username};
    
//     const accessToken = generateAccessToken(user);
    
//     res.header('authorization', accessToken).json({
//         message:'Usuario autenticado',
//         token: accessToken
//     });
//     });
    
//     //Nos pide la info a encriptar y la clave para desencriptarla
//     function generateAccessToken(user){
//         return jwt.sign(user, process.env.token, {expiresIn: '5m'});
//     }
    
//     function validateToken(req,res,next){
//         const accessToken = req.headers['authorization'] || req.query.accessToken;
//         if(!accessToken) res.send('Access denied');
//         jwt.verify(accessToken, process.env.token, (err,user) =>{
//             if(err){
//                 res.send('Access denied, token expired or incorrect');
//             }else{
//             req.user = user;
//             next();
//             }
//         })
//     }



app.listen('3000', function(){
    console.log('Servidor iniciado en puerto 3000 ' );
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
app.put('/api/articulos/:id' ,(req,res)=>{
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
