/*
 * Declaracao do servidor websocket, utilizacao da biblioteca WS, este servidor apenas irá receber e 
 * transimitir a mensagem ao seu destinatario, toda inteligencia esta implementada no lado do cliente
 * e no lado do equipamento Freescale
 */
var porta = 3000;
var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({ port: porta, perMessageDeflate: false });

/*
 * Variavel para amarzenar as conexoes client e server
 */
var webSockets = {};

/*
 * Funcao para enviar mensagem de broadcast para todas as conexoes
 */
function broadcast(data) {
	wss.clients.forEach(function each(client) {
		client.send(JSON.stringify(data));
	});
}

/*
 * Inicio do servidor WebSocket
 */
wss.on('connection', function connection(ws) {
	//### Pega o identificador da conecao
	var userID 		    = ws.upgradeReq.url.substr(1).trim();
	webSockets[userID]  = ws;
	console.log('Novo cliente conectado: ' + userID);

	/*
	 * Evento de recebimento de mensagem
	 */
	ws.on('message', function incoming(messagemJSON) {
		//### Recebe a mensagem e parse para um objeto JSON
		var mensagem = JSON.parse(messagemJSON);
		console.log("Mensagem recebida: " + messagemJSON + " - Destino da mensagem: " + mensagem.destino);

		/*
		 * Verifica qual o destino da mensagem
		 */
		if (mensagem.destino == "servidor" && mensagem.tipo != "conexao") {
			//### Mensagem do aplicativo do cliente para o servidor
			if(webSockets["ws/freescale"] != undefined){
				console.log("-- ENVIANDO MSG PARA FREESCALE");
				webSockets["ws/freescale"].send(messagemJSON);
			}
		} else {
			//### Mensagem do aplicativo do servidor para o cliente
			if(webSockets["ws/cliente"] != undefined){
				console.log("-- RECEBENDO MENSAGEM DO APLICATIVO CLIENTE");
				webSockets["ws/cliente"].send(messagemJSON);

			}
		}
	});
});

/*
 * Memsagem de inicio do servidor para fins de log
 */
 console.log("Iniciando servidor WebSocket server na porta: " + porta);