const assert = require ('chai').assert;
const expect = require ('chai').expect;
const app = require('../index.js');
const request = require('supertest');
const config = require('../config/config.js');

describe ('calcular pólizas', () => {
    
    after(() => {
      console.log("finish test..........");
    })

    contador = 0;
    describe('get endpoint calcular...', function()
    {        
        it ('OK, Creando un request', function(done) 
        {
            request(app).get('/calcular').then((res) => 
            {                 
              //  console.log(res);
                var outputJson  = JSON.parse(res.text); 
                console.log(outputJson);
                expect(outputJson).to.contain.property('calculo_nomina');
                expect(outputJson).to.contain.property('costo_contrato_empresa');
                var perc_employe = 100 - config.perc_company ;
                for (value in outputJson.detalle_empleados)
                {
                   
                    expect(outputJson.detalle_empleados[value]).to.contain.property('edad');  
                    expect(outputJson.detalle_empleados[value]).to.contain.property('hijos');  
                    expect(outputJson.detalle_empleados[value]).to.contain.property('copago_empleado');  
             
                    if (outputJson.detalle_empleados[value] < 66 )
                    {
                                    
                        outputJson.detalle_empleados[value].copago_empleado 
                        if (outputJson.detalle_empleados[value].hijos < 1)
                        {
                            var prima_employe = config.no_child * perc_employe / 100;                                    
                            expect(outputJson.detalle_empleados[value].copago_empleado).to.contain.equals(prima_employe); 
                                    
                        }
                        if (outputJson.detalle_empleados[value].hijos == 1)
                        {

                            var prima_employe = config.one_child * perc_employe / 100;                                    
                            expect(outputJson.detalle_empleados[value].copago_empleado).to.contain.equals(prima_employe); 
                                    
                        }
                        if (outputJson.detalle_empleados[value].hijos > 1)
                        {

                            var prima_employe = config.two_childs * perc_employe / 100;                                    
                            expect(outputJson.detalle_empleados[value].copago_empleado).to.contain.equals(prima_employe); 
                                    
                        }
                    }                   
                }                             
                        
             done();

            }).catch((err) => done(err));
                               

        });
             
    });

});