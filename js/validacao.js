export function valida(input){
    const tipoDeInput = input.dataset.tipo
    // Chama o input que desejamos através do data atributes criado no HTML, é uma função que serve para
    // todo tipo de input que teremos//

    if(validadores[tipoDeInput]) {
        validadores[tipoDeInput](input)
    } //valida se dentro de validores tem um tipo de input, se sim ele executa o input certo//

    if(input.validity.valid){
        input.parentElement.classList.remove('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''
    } else{
        input.parentElement.classList.add('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro(tipoDeInput,input)
    } //validação se o campo Nome está preenchido ou não, se tiver não aplica estilo e nem mensagem de erro  
      // se estiver vazio, apresenta mensagem de erro e fica vermelho
}

const tiposDeErros = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
] //listamos todos os erros que estamos validando nesta lista para que na hora da validação seja mostrado
//a mensagem de erro correta para cada tipo de input

const mensagensDeErro = {
    nome: { 
        valueMissing:'O nome deve ser preenchido.'
    },
    email: {
        valueMissing:'O email deve ser preenchido.',
        typeMismatch: 'O email digitado não é válido.'
    },   
    senha: {
        valueMissing: 'O campo de senha não pode estar vazio',
        patternMismatch: 'A senha deve conter de 6 a 12 caracteres, uma letra maiúscula, número e não deve conter caracteres especiais'
    },
    dataNascimento: {
        valueMissing: 'A data de nascimento deve ser preenchida.',
        customError: 'Você deve ser maior de 18 anos para se cadastrar'
    },
    cpf: {
        valueMissing: 'O CPF deve ser preenchido.',
        customError: 'O CPF digitado não é válido.'
    },
    cep: {
        valueMissing: 'O CEP deve ser preenchido.',
        patternMismatch: 'O CEP digitado não é válido',
        customError: 'Não foi possível buscar o CEP' 
    },
    logradouro: {
        valueMissing: 'O campo logradouro deve ser preenchido.'
    },
    cidade: {
        valueMissing: ' O campo cidade deve ser preenchido.'
    },
    estado: {
        valueMissing: 'O campo estado deve ser preenchido.'
    },
    preco: {
        valueMissing: 'O campo de preço deve ser preenchido.'
    }
}

const validadores = {
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCPF(input),
    cep:input => recuperarCEP(input)
}

function mostraMensagemDeErro(tipoDeInput, input) {
    let mensagem = ''
    tiposDeErros.forEach(erro =>{
        if(input.validity[erro]) {
            mensagem = mensagensDeErro[tipoDeInput][erro]
        }
    })
// criamos a função para que realize a checagem do tipo de input que está sendo validado e verifique se ele
// apresenta algum erro e se sim mostre a mensagem personalizada de cada de tipo de erro p/ cada tipo de input


    return mensagem
} //mensagem de erro personalizada

function validaDataNascimento(input){
    const dataRecebida = new Date(input.value)
//pega a data recebida do formulário, que vem em formato string e transforma em um calendário//
    let mensagem = ''

    if(!maiorQue18(dataRecebida)){
        mensagem = 'Você deve no mínimo 18 anos para se cadastrar.'
    }
    // valida se a data recebida condiz com uma pessoa de maior idade e caso não seja recebe a msg de erro//
   

    input.setCustomValidity(mensagem) //se a pessoa for maior de 18 ela não recebe nenhuma msg de erro//
    //setCustom = função do input para customizar uma mensagem de erro//
}

//Para realizar a comparação da data de hoje e a idade minima permitida que é 18 anos, e validar assim se
//se a pessoa pode realizar o cadastro//
function maiorQue18(data){
    const dataAtual = new Date()
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate())

    return dataMais18 <= dataAtual
}

function validaCPF(input) {
    const  cpfFormatado = input.value.replace(/\D/g, '')
    let mensagem = ''

    if(!checaCPFrepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)) {
        mensagem = 'O CPF digitado não é válido'
    }
    input.setCustomValidity(mensagem)
} //Para validar o CPF primeiro devemos formatá-lo, para ser escrito com . - ou tudo junto, e retornar
// mensagem de erro caso não esteja escrito corretamente//

function checaCPFrepetido(cpf) {
    const valoresRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999',
    ]
    let cpfValido = true

    valoresRepetidos.forEach(valor => {
        if(valor == cpf) {
            cpfValido = false
        }
        if(cpf.length  > 11) {
            cpfValido = false
        }
    })

    return cpfValido
} // Checamos se o CPF é valido checando tambem se só há o mesmo número digitado no input//

function checaEstruturaCPF(cpf) {
    const multiplicador = 10

    return checaDigitoVerificador(cpf, multiplicador)
}

function checaDigitoVerificador(cpf, multiplicador) {
    if(multiplicador >= 12) {
        return true
    }

    let multiplicadorInicial = multiplicador 
    let soma = 0
    const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('') 
    const digitoVerificador = cpf.charAt(multiplicador - 1)
    for(let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--) {
        soma = soma + cpfSemDigitos [contador] * multiplicadorInicial
        contador++
    }

    if(digitoVerificador == confirmaDigito(soma)) {
        return checaDigitoVerificador(cpf, multiplicador + 1)
    }

    return false
}

function confirmaDigito(soma) {
    return 11 - (soma % 11)
}

function recuperarCEP(input) {
    const cep = input.value.replace(/\D/g, '')
    const url = `http://viacep.com.br/ws/${cep}/json/`
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }

    if(!input.validity.patternMismatch && !input.validity.valueMissing){
        fetch(url, options).then(
            response => response.json()
        ).then(
            data => {
                if(data.erro) {
                    input.setCustomValidity('Não foi possível buscar o CEP')
                    return
                }
                input.setCustomValidity('')
                preencheCamposComCEP(data)
                return
            }
        )
    }
}

function preencheCamposComCEP(data) {
    const logradouro = document.querySelector('[data-tipo="logradouro"]')
    const cidade = document.querySelector('[data-tipo="cidade"]')
    const estado = document.querySelector('[data-tipo="estado"]')

    logradouro.value = data.logradouro
    cidade.value = data.localidade
    estado.value = data.uf
}