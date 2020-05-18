const assert = require ('chai').assert;
const expect = require ('chai').expect;
const app = require('../index.js');
const request = require('supertest');
const config = require('../config/config.js');
var  price_policy = 0;
var company_perc = 0;



describe ('calcular pólizas', () => {
    
    after(() => {
      console.log("finish test..........");
    })
 
    describe('get endpoint calcular...', function()
    {        
        it ('calculo de copago empleado y verificación de campos', function(done) 
        {
            request(app).get('/calcular').then((res) => 
            {                 
              //  console.log(res);
                var outputJson  = JSON.parse(res.text); 
                console.log(outputJson);
                expect(outputJson).to.contain.property('calculo_nomina');
                expect(outputJson).to.contain.property('costo_contrato_empresa');
                expect(outputJson).to.contain.property('porcentaje_cobertura_empresa');
                var perc_employe = 100 - outputJson.porcentaje_cobertura_empresa;
                
                for (value in outputJson.detalle_empleados)
                {
                   
                    expect(outputJson.detalle_empleados[value]).to.contain.property('edad');  
                    expect(outputJson.detalle_empleados[value]).to.contain.property('hijos');  
                    expect(outputJson.detalle_empleados[value]).to.contain.property('copago_empleado');  
             
                    if (outputJson.detalle_empleados[value].edad < 66 )
                    {
                                    
                        outputJson.detalle_empleados[value].copago_empleado 
                       
                        if (outputJson.detalle_empleados[value].hijos < 1)
                        {
                            var prima_employe = config.no_child * perc_employe / 100;
                            price_policy += config.no_child;
                            console.log("costo poliza sin hijos: " + config.no_child);                                           
                            expect(outputJson.detalle_empleados[value].copago_empleado).to.contain.equals(prima_employe); 
                                    
                        }
                        if (outputJson.detalle_empleados[value].hijos == 1)
                        {

                            var prima_employe = config.one_child * perc_employe / 100; 
                            price_policy += config.one_child;   
                            console.log("costo poliza 1 hijo: " +config.one_child);                                 
                            expect(outputJson.detalle_empleados[value].copago_empleado).to.contain.equals(prima_employe); 
                                    
                        }
                        if (outputJson.detalle_empleados[value].hijos > 1)
                        {

                            var prima_employe = config.two_childs * perc_employe / 100;  
                            price_policy += config.two_childs;    
                            console.log("costo poliza más de 1 hijo: " + config.two_childs);                                         
                            expect(outputJson.detalle_empleados[value].copago_empleado).to.contain.equals(prima_employe); 
                                    
                        }
                    }                   
                }
                   
                done();

            }).catch((err) => done(err));
                               

        });
             
    });

});

describe('get endpoint calcular...', function()
{        
        it ('Calculo de costo de empresa', function(done) 
        {
            request(app).get('/calcular').then((res) => 
            {                 
              //  console.log(res);
                var outputJson  = JSON.parse(res.text);
                var costo = price_policy * outputJson.porcentaje_cobertura_empresa/100;         
                expect(outputJson.costo_contrato_empresa).to.contain.equals(costo)              
                   
                done();

            }).catch((err) => done(err));                               

        });
});


