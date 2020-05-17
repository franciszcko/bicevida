
const express = require('express');
const app = express();
const https = require('https');
const config = require('./config/config.js');


var price_policy = 0;
let output;
let outputJson;

app.get('/calcular', function (req, res) {
    price_policy = 0;
    let data;  
    let myArray;  

    https.get(config.endpoint_policy, (resp) => { 
        output = "<p>Lista detallada Póliza con Copago de empleados</p></br>"

        outputJson = { calculo_nomina: "Nomina con detalle copago empleado",
                       detalle_empleados: [],      
                       costo_contrato_empresa:0};

        resp.on('data', (chunk) => {            
            
            data = JSON.parse(chunk);  
            myArray = data.policy.workers; 
            console.log(myArray); 
            getPricePolicy(myArray).then(price_policy => {
                console.log(price_policy);         
            });                  

        });
        resp.on('end', () => {
            var costo = price_policy * config.perc_company/100;
            outputJson.costo_contrato_empresa = costo;
            res.send(JSON.stringify(outputJson));  
        });
    });
  
})

let getPricePolicy = ((myArray) => {
    return new Promise ((resolve, reject) =>{
        var perc_employe = 100 - config.perc_company ;
        var prima_employe = 0;
        myArray.forEach(function(value){               
            
            
            console.log("age: " + value.age + "child: " + value.childs );
           
            if (value.age < 66){
                
                if (value.childs < 1){
                    price_policy += config.no_child;                     
                    prima_employe = config.no_child * perc_employe / 100;
                }
                else if (value.childs == 1){
                    price_policy += config.one_child;
                    prima_employe = config.one_child * perc_employe / 100;      
                } 
                else if (value.childs > 1){
                    price_policy += config.two_childs;
                    prima_employe = config.two_childs * perc_employe / 100;          
     
                }
                console.log("prima pagada: " + prima_employe );
             
            }
            else {
                prima_employe= 0;
            } 
            output += "<p>" +  "edad: " + value.age + " hijos: " + value.childs + " valor copago empleado: " + prima_employe + "</p>" 
            outputJson.detalle_empleados.push({edad: value.age, hijos: value.childs, copago_empleado: prima_employe });
            
        });     
        resolve(price_policy);
    });
});



app.listen(config.port, ()=>{
    console.log("Habilitado puerto: " + config.port);
});

//module.exports.handler = serverless(app);

module.exports = app;