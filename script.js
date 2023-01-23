const nome = prompt('Qual o seu nome de usuário?');

let lista = {
    'name':nome
};

function testarNomeUsuario(){

    const testeUsuario = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    testeUsuario.then(testeDeUsuario);
}

function testeDeUsuario(resposta){

    let nomesDeUsuario = resposta.data;
    let primeiroUsuario;

    for(let i=0;i<nomesDeUsuario.length;i++){
        primeiroUsuario = nomesDeUsuario[i].name;
        if(primeiroUsuario === nome){
            document.location.reload(true);
        }
    }

    conectando();

}   

testarNomeUsuario();


function conectando(){
    const promessa = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants",lista);
    promessa.then(respostaChegou);
}

function respostaChegou(){

    setInterval(statusDoUsuario,5000);
    
    buscarMensagem();

    setInterval(buscarMensagem,mensagensChegaram, 3000);

}

function statusDoUsuario(){
    const status = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', lista);
}

function buscarMensagem(){

    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(mensagensChegaram);
    promise.catch();

}

let corpoDasMensagens = document.querySelector('.conversas');

function mensagensChegaram(resposta){

    corpoDasMensagens.innerHTML = "";

    let todasMensagens = resposta.data;

    for(let i=0;i<todasMensagens.length;i++){
        if(todasMensagens[i].type === 'status'){
            corpoDasMensagens.innerHTML = corpoDasMensagens.innerHTML + `<div class ='entrada-saida cinza' data-test="message">
            <span class='horario'>(${todasMensagens[i].time}) </span><span class='usuario'>${todasMensagens[i].from}</span> para <span class='usuario'>${todasMensagens[i].to}</span>:  <span>${todasMensagens[i].text}</span>
            </div>`;            
        }else if(todasMensagens[i].type === 'message'){ 
            corpoDasMensagens.innerHTML = corpoDasMensagens.innerHTML + `<div class ='mensagem-todos branca' data-test="message">
            <span class='horario'>(${todasMensagens[i].time}) </span><span class='usuario'>${todasMensagens[i].from}</span> para <span class='usuario'>${todasMensagens[i].to}</span>:  <span>${todasMensagens[i].text}</span>
            </div>`;
        }else if(todasMensagens[i].type === 'private_message' && (nome === todasMensagens[i].to || nome === todasMensagens[i].from)) {  
            corpoDasMensagens.innerHTML = corpoDasMensagens.innerHTML + `<div class ='mensagem-reservada rosa' data-test="message">
            <span class='horario'>(${todasMensagens[i].time}) </span><span class='usuario'>${todasMensagens[i].from}</span> reservadamente para <span class='usuario'>${todasMensagens[i].to}</span>:  <span>${todasMensagens[i].text}</span>
            </div>`;
        }
        
        corpoDasMensagens.lastChild.scrollIntoView(); 
    }

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
    enviarMensagem.then(deuCertoMensagem);
    enviarMensagem.catch(deuErradoEnviarMensagem);

}

function deuCertoMensagem(){

    buscarMensagem();
}

function deuErradoEnviarMensagem(){

    window.location.reload();
}