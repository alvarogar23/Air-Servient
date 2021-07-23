var Servient = require("@node-wot/core").Servient;
var MqttClientFactory = require("@node-wot/binding-mqtt").MqttClientFactory;
var pairing = require('./pairing.js');
const express = require('express');
const app = express();


Helpers = require("@node-wot/core").Helpers;

//Creamos el Servient y el protocolo MQTT

let servient = new Servient();
servient.addClientFactory(new MqttClientFactory(null));

//Thing description

let td = `{
    "@context": "https://www.w3.org/2019/wot/td/v1",
    "title": "AireAcondicionado",
    "id": "urn:dev:wot:mqtt:AireAcondicionado",
    "actions" : {
        "OnOff": {
            "forms": [
                {"href": "mqtt://test.mosquitto.org:1883/AireAcondicionado/actions/OnOff"}
            ]
        },
        "incrementar": {
            "forms": [
                {"href": "mqtt://test.mosquitto.org:1883/AireAcondicionado/actions/incrementar"}
            ]
        },
        "decrementar": {
            "forms": [
                {"href": "mqtt://test.mosquitto.org:1883/AireAcondicionado/actions/decrementar"}
            ]
        },
        "leerTemperatura": {
            "forms": [
                {"href": "mqtt://test.mosquitto.org:1883/AireAcondicionado/actions/leerTemperatura"}
            ]
        }
    }, 
    "events": {
        "estadoTemperatura": {
            "type": "integer",
            "forms": [
                {"href": "mqtt://test.mosquitto.org:1883/AireAcondicionado/events/estadoTemperatura"}
            ]
        } 
    } 
}`;

/*if(pairing.airServientID == pairing.controllerID){
    console.log('Emparejamiento correcto');*/
    try {
        servient.start().then((WoT) => {
            WoT.consume(JSON.parse(td)).then((thing) => {
                console.info(td);
    
                
    
                thing.subscribeEvent(
                    "estadoTemperatura",
                    (temperatura) => console.info("value:", temperatura),
                    (e) => console.error("Error: %s", e),
                    () => console.info("Completado")
                )
    
                console.info("Suscrito");
    
                app.set('view engine', 'jade');
    
                app.get("/mando", function (req, res) {
                    res.render("mando", {
                        title: "Mando del aire"
                    });
                });
    
                app.get("/subirTemperatura", function (req, res) {
                    if(pairing.airServientID == pairing.controllerID){
                        res.render("mando", {
                            title: "Mando del aire",
                            subirTemperatura: thing.invokeAction('incrementar')
                        });
                    }else{
                        console.log('Emparejamiento fallido');
                        res.redirect('mando');
                    }
                    
                });
    
                app.get("/bajarTemperatura", function (req, res) {
                    if(pairing.airServientID == pairing.controllerID){
                        res.render("mando", {
                            title: "Mando del aire",
                            subirTemperatura: thing.invokeAction('decrementar')
                        });
                    }else{
                        console.log('Emparejamiento fallido');
                        res.redirect('mando');
                    }
                });
    
                app.get("/mostrarTemperatura", function (req, res) {
                    res.render("mando");
                });
    
                app.listen(4000);
            });
        });
    } catch (err) {
        console.error("Error en el script: ", err);
    }

/*}else{

    pairing.errorDifferentId(pairing.controllerID);

}*/


