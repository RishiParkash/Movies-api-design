const express=require('express');
const app=express();
app.use(express.json());
const {generateToken,verifyToken,hashPassword,comparePassword}=require('./auth.js');
let users=[
     {id:1,username:'alice',password:hashPassword('password1')},
     {id:2,username:'bob',password:hashPassword('password2')},
];
let movies=[
    { id: 1, title: 'The Shawshank Redemption', director: 'Frank Darabont' },
  { id: 2, title: 'The Godfather', director: 'Francis Ford Coppola' },
  { id: 3, title: 'The Godfather: Part II', director: 'Francis Ford Coppola' },
  { id: 4, title: 'The Dark Knight', director: 'Christopher Nolan' },
  { id: 5, title: '12 Angry Men', director: 'Sidney Lumet' },
];
app.post('/login',(req,res)=>{
    const {username,password}=req.body;
    const user=users.find((u)=>u.username===username);
    if(!user||!comparePassword(password,user.password)){
        return res.status(401).send('Invalid username or password');
    }
    const token=generateToken(user);
    res.json({token});
});
function authenticateUser(req,res,next){
    const authorizationHeader=req.headers.authorization;
    if(!authorizationHeader){
        return res.status(401).send('Authorization header missing');
    }
    const token=authorizationHeader.split(' ')[1];
    try{
        const payload=verifyToken(token);
        req.user=payload;
        next();
    }catch(err){
        res.status(401).send('Invalid token');
    }
}
app.get('/movies',authenticateUser,(req,res)=>{
    res.json(movies);
});
app.get('/movies/:id',authenticateUser,(req,res)=>{
    const id=parseInt(req.params.id);
    const movie=movies.find((m)=>m.id===id);
    if(!movie){
        return res.status(404).send('Movies Not found');
    }
    res.json(movie);

});
app.post('/movies',authenticateUser,(req,res)=>{
    const {title,director}=req.body;
    const id=movies.length+1;
    const movie={id,title,director};
    movies.push(movie);
    res.status(201).json(movie);
});
app.put('/movies/:id',authenticateUser,(req,res)=>{
    const id=parseInt(req.params.id);
    const movie=movies.find((m)=>m.id===id);
    if(!movie){
        return res.status(404);
    }
    const {title,director}=req.body;
    movie.title=title;
    res.json(movie);
});
app.delete('/movies/:id',authenticateUser,(req,res)=>{
    const id=parseInt(req.params.id);
    const index=movies.findIndex((m)=>m.id===id);
    if(index===-1){
        return res.status(404).send('movie not found');
    }
    movies.splice(index,1);
    res.sendStatus(204);

});
app.listen(3000,()=>console.log('server started on the port 3000 '));

