/*
    CE DOSSIER CONTIENT LE CORPS DES ROUTES POUR LES USERS.
*/ 
const bcrypt=require('bcrypt');// crypter les mots de passe
const jwt=require('jsonwebtoken');
const client = require('../connection.js')



const privateKey=`-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQCZlQvL+H1Ltro1bMGe30cJCNUUEAxVQRfOwsNKPdIhU470n1/t
YtQ4FIpypHSsbDXn3MwoQlm61SJJ3b1JRlfhoFq7CZIgce1lOyvaFvQLvfHpPUiJ
FBaf0CcA4ks07awocqWTc46oxw+uFONxmdx8PLNCUGjDl5bQD2CZpASeFQIDAQAB
AoGACAy62I8GqjBCpEg2Aci8JWoUGQAaVWGbCNhGeh6xY9PIW2P7GCsk6meRNh8O
incFgEifXsDTiSpgqLR5llycgH8FcPtslfNQhlQtqG8DgZZnjklmwT+EfQQ+9Ir0
LP8FdIwshYhBRVk2jS+v9tLK06kS7JglcNZPGeVGim1RnQUCQQDejvqSokM2hg/A
uV8it6uIr0I1XIO1yBmxm9UmLI2/RigjICXBGvgDe5JHxd3aJOPTz+L5efU8LSyJ
HQDEhWgDAkEAsKjMZiBHXaaPLy0M0+VIlvRZASMMR3JU4Hb9Ysht2vgbKv9zc8oY
xHr2mDCxR5sXonQz9awuJJDACksSb9pCBwJADyYyXjrXUmXLurWjiSxxa6tqWVGD
0aLeRN2zo5aSy3tODh4JE9zvFuWZbnNEh63NKETVUWAA1mjIyEiGHdpq2wJADJdL
UjAUxhD7/ZHJa0TZQqERwun7kxAMCp+QebztT4EFdrAUS3lpAH//GWPHDuJ38cU0
etsVwtdqSJGHM9+rewJARkV6jvqOZ0EpfCWW0xTKg4yOb6dhxTKAm58S8Y5bV3eA
lwsHP6eqgkiTIFEWFGRj6e6Uo3NGNsG8VF5kIJybTw==
-----END RSA PRIVATE KEY-----`
const publicKey=`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZlQvL+H1Ltro1bMGe30cJCNUU
EAxVQRfOwsNKPdIhU470n1/tYtQ4FIpypHSsbDXn3MwoQlm61SJJ3b1JRlfhoFq7
CZIgce1lOyvaFvQLvfHpPUiJFBaf0CcA4ks07awocqWTc46oxw+uFONxmdx8PLNC
UGjDl5bQD2CZpASeFQIDAQAB
-----END PUBLIC KEY-----`





exports.signup=(req,res,next)=>{
    const user = req.body;
    bcrypt.hash(user.password,10).then(hash=>{
        delete req.body.password;
        let insertQuery = `insert into users(id, nom, prenom, identifiant,password) 
        values(${user.id}, '${user.nom}', '${user.prenom}', '${user.identifiant}', '${hash}')`

        client.query(insertQuery, (err, result)=>{
        if(!err){
        res.status(201).json({message:'Utilisateur créé!'})
        }
        else{ console.log(err.message) }
        })
        client.end;
            })
            .catch(error=>res.status(500).json({error}));

};
exports.login = (req, res, next) => {
    client.query(`Select * from users where "identifiant"='${req.body.identifiant}'`, (err, result)=>{
        if(!err){
            
            const user={
                id:result.rows[0].id,
                identifiant:result.rows[0].identifiant,
                nom:result.rows[0].nom,
                prenom:result.rows[0].prenom
            };
            // bcrypt.compare(req.body.password, result.rows[0].password).then(
            //     (valid) => {
            //       if (!valid) {
            //         return res.status(401).json({
            //           error: new Error('Incorrect password!')
            //         });
            //       }
            //       else{
            //         const token = jwt.sign({user}, privateKey, {algorithm:'RS256'})
            //         req.headers.authorization=token
            //         res.send(user);
            //       }
            //     }
            //   ).catch(
            //     (error) => {
            //       res.status(500).json({
            //         error: error
            //       });
            //     }
            //   );
        }
        else{
            return res.status(401).json({
                error: new Error('Utilisateur inexistant!')
              });
        }
    });
  }

exports.getAllUsers= (req, res, next) => {
    const idToken=req.headers.authorization;
    jwt.verify(idToken,publicKey, (err,decoded)=>{
        if(err){
            res.status(401).send('Unauthorized')
        }
        else{
            client.query(`Select * from users`, (err, result)=>{
                if(!err){
                    res.send(result.rows);
                }
            });
            client.end;
           
        }
    })
  };
exports.getOneUser=(req,res,next)=>{
    client.query(`Select * from users where id=${req.params.id}`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
};

exports.modifyUser=(req,res,next)=>{
    let user = req.body;
    let updateQuery = `update users
                       set firstname = '${user.firstname}',
                       lastname = '${user.lastname}',
                       location = '${user.location}'
                       where id = ${user.id}`

    client.query(updateQuery, (err, result)=>{
        if(!err){
            res.send('Update was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
};

exports.deleteUser=(req,res,next)=>{
    let insertQuery = `delete from users where id=${req.params.id}`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Deletion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
};