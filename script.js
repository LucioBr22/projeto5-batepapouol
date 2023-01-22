
const nome = prompt('Qual o seu nome de usuário?');

const lista = {
    'name':nome
};

const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",lista);
promessa.then(respostaChegou);
promessa.catch(deuRuim);

function respostaChegou(resposta){
    console.log('reposta do servidor chegou');
    console.log(resposta);
}

function deuRuim(){
    console.log('Deu ruim A receita nao foi salva');
}

function buscarMensagem(){
    const url = "https://mock-api.driven.com.br/api/v6/uol/messages";
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET",url,false);
    xhttp.send();
    console.log(xhttp.responseText);
}


let mensagem;

function enviarMensagem(){

    const mensagemGuardada = document.querySelector('.texto-enviado');

    mensagem = mensagemGuardada.value;

    mensagemGuardada.value='';

    const mensagemEnviada = {
        "from": nome,
        "to": "Todos",
        "text": mensagem,
        "type": "message"
    }

    const enviarMensagem = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",mensagemEnviada);
    enviarMensagem.then(respostaChegou);
    enviarMensagem.catch(deuRuim);

}

