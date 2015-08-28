var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: 3000, perMessageDeflate: false });
var webSockets = {};


function broadcast(data) {
	wss.clients.forEach(function each(client) {
		client.send(JSON.stringify(data));
	});
}

wss.on('connection', function connection(ws) {
	var userID 		    = ws.upgradeReq.url.substr(1).trim();
	webSockets[userID]  = ws;
	console.log('Novo cliente conectado: ' + userID);


	ws.on('message', function incoming(messagemJSON) {
		console.log(messagemJSON);
		var mensagem = JSON.parse(messagemJSON);
		if (mensagem.destino == "servidor" && mensagem.tipo != "conexao") {
			if(webSockets["ws/freescale"] != undefined){
				console.log("-- ENVIANDO");
				console.log(mensagem);
				webSockets["ws/freescale"].send(messagemJSON);
			}
		} else {
			if(webSockets["ws/cliente"] != undefined){
				console.log("-- RECEBENDO");
				console.log(mensagem);
				webSockets["ws/cliente"].send(messagemJSON);
			}
		}

		// mensagens do client
		switch (mensagem.mensagem) {
			case "comida":
				break;

			case "reservatorio":
				break;

			case "toca_audio":
				break;

			case "temp_humidade":
				break;
		}

		// mensagens da placa
		switch (mensagem.mensagem) {
			case "resp_comida":
				break;

			case "resp_reservatorio":
				break;

			case "resp_toca_audio":
				break;

			case "resp_temp_humidade":
				break;
		}
	});
});
