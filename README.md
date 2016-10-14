![valid XHTML][checkmark]
[checkmark]: https://raw.githubusercontent.com/mozgbrasil/mozgbrasil.github.io/master/assets/images/logos/Red_star_32_32.png "MOZG"
[url-method]: https://www.clearsale.com/contas/criar/GH5THM/
[requerimentos]: http://mozgbrasil.github.io/requerimentos/
[contact-clearsale]: http://api.docs.dev.clearsale.com/intro.html
[tickets]: https://cerebrum.freshdesk.com/support/tickets/new
[preco]: http://www.cerebrum.com.br/preco/
[github-boxpacker]: https://github.com/mozgbrasil/magento-boxpacker-php56#mozgboxpacker
[getcomposer]: https://getcomposer.org/
[uninstall-mods]: https://getcomposer.org/doc/03-cli.md#remove

# Mozg\Clearsale

## Sinopse

Integração a [Clearsale][url-method]

## Motivação

Atender o mercado de módulos para Magento oferecendo melhorias e um excelente suporte

## Suporte / Dúvidas

Para obter o devido suporte [Clique aqui][tickets], relatando o motivo da ocorrência o mais detalhado possível e anexe o print da tela para nosso entendimento

## Preço

[Clique aqui][preco]

## Recursos

Análise de registro

## Característica técnica

No frontend no /checkout/ é carregado o profiling onde é passado o session_id

No backend na visualização do pedido é possivel disparar analise do registro do pedido

## Instalação - Atualização - Desinstalação - Desativação

Este módulo destina-se a ser instalado usando o [Composer][getcomposer]

Antes de executar os processos, [clique aqui][requerimentos] e leia os pré-requisitos e sugestões

--

Certique se da existencia do arquivo composer.json na raiz do projeto Magento e que o mesmo tenha os trechos "minimum-stability", "prefer-stable", "repositories" e '"magento-root-dir":"./"', conforme https://gist.github.com/mozgbrasil/0c9bb8792ea6273ea24aed30b0fbcfba

Caso não exista o arquivo composer.json na raiz do projeto Magento, efetue o download

	wget https://gist.githubusercontent.com/mozgbrasil/0c9bb8792ea6273ea24aed30b0fbcfba/raw/b53c403620c111c43834fec9aa025809d1cb96b1/composer.json

--

Para qualquer atualização no Magento sempre mantenha o Compiler e o Cache desativado

--

### Para instalar o módulo execute o comando a seguir no terminal do seu servidor

	composer require mozgbrasil/magento-clearsale-php56

Você pode verificar se o módulo está instalado, indo ao backend em:

	STORES -> Configuration -> ADVANCED/Advanced -> Disable Modules Output

--

### Para atualizar o módulo execute o comando a seguir no terminal do seu servidor

	composer clear-cache && composer update

Na ocorrência de erro, renomeie a pasta /vendor/mozgbrasil e execute novamente

Para checar a data do módulo execute o seguinte comando

	grep -ri --include=*.json 'time": "' ./vendor/mozgbrasil

--

### Para [desinstalar][uninstall-mods] o módulo execute o comando a seguir no terminal do seu servidor

	composer remove mozgbrasil/magento-clearsale-php56 && composer clear-cache && composer update

--

### Para desativar o módulo

Renomeie a pasta do módulo

Cada módulo tem a sua pasta no diretório /vendor/mozgbrasil/

--

### Para desativar o módulo

Renomeie a pasta do módulo

Cada módulo tem a sua pasta no diretório /vendor/mozgbrasil/

## Como configurar o método de entrega

Antes de configurar o módulo você deve cadastrar o CEP de origem, indo ao backend em:

	STORES -> Configuration -> Sales/Shipping Settings -> Origin

Para configurar o método de entrega, acesse no backend em:

	STORES -> Configuration -> Sales/Shipping Methods -> Clearsale (powered by MOZG)

Você terá os campos a seguir

### • **Ativar**

Para "ativar" ou "desativar" o uso do método

## Perguntas mais frequentes "FAQ"

## Fluxo de integração

Este fluxo é responsável por demonstrar a integração entre o cliente e a ClearSale:

    Loja                                                                 ClearSale
     |                                                                       |
     |----- (A) solicitação de análise de risco (sendOrders) --------------->|
     |                                                                       | (B) realiza processamento
     |<---- (C) envia resposta ----------------------------------------------|
     |                                                                       |
     |----- (D) realiza a cobrança / cancela a compra / tenta novamente ---->|

* (A) A loja realiza uma solicitação de análise de risco, informando os dados da compra e do comprador.
* (B) A ClearSale processa a requisição.
* (C) A ClearSale responde a requisição.
* (D) Caso a resposta de (C) seja aprovada, a loja deverá realizar a cobrança.
* (D) Caso a resposta de (C) seja reprovada, a loja não deverá realizar a cobrança.
* (D) Caso a resposta de (C) seja aguardando aprovação, a loja deverá realizar novas consultas na plataforma na
ClearSale até que o status da análise mude para aprovado ou reprovado.

## Processo de Homologação

No Frontend, efetue a geração de 10 novos pedidos, na finalização de cada pedido efetue o logout da conta e repita novamente o processo de geração do novo pedido e nova conta.

Obs. No formulário de cadastro, caso o nosso módulo de clientes esteja ativo o mesmo tem automação de criação de conta ficticia para isso segure a tecla "Shift" em seguido de um "Duplo click" sobre o campo "Cidade", dessa forma deve ser auto-preenchido o formulário de cadastro com dados ficticios.

Se possível utilize o máximo de browsers simultâneo para agilizar o processo da criação dos pedidos.

Ao selecionar o(s) pedido(s) é possível disparar o processo para a "checagem de fraude"

Sendo exibido o retorno da ClearSale

Em seguida envie e-mail para o setor de integrações da ClearSale para que seja realizado a validação dos pedidos enviados

Caso não seja exibido o retorno da ClearSale, informe para que seja feita analise da ocorrência

O parâmetro "Fingerprint" deve ser enviado para todos os pedidos pois o script é integrado no /checkout/ se o mesmo não foi recebido é que pode ter ocorrido alguma instabilidade no serviço da ClearSale

O parâmetro "Prazo de Entrega" deve ser enviado, caso no método de entrega houver o registro do prazo  

Os parâmetros para "Dados do Cartão" deve ser enviado caso o método de pagamento armazene o número do cartão de crédito e suas demais informações no padrão da plataforma Magento como é o caso do método nativo "Cartão de crédito salvo", mas posso mapear atributos de módulos de terceiros

### Dados de contato - Clearsale

Para entrar em contato com a [Clearsale][contact-clearsale]

http://portal.clearsale.com.br/solucoes/e-commerce/total

Tel.: + 55 11 3728-8788 Ramal 1351
Cel.: + 55 11 8750-5764

Danilo Camargo | Departamento Comercial | ClearSale danilo.camargo@clearsale.com.br  

Indira Marcela Borges O. dos Santos | Sustentação Técnica | Integração | + 55 11 3728-8788 ramal 1332 | indira.santos@clearsale.com.br

Gilberto C. S. Júnior | Sustentação Técnica | Integração | + 55 11 3728-8788 ramal 1322 | gilberto.junior@clearsale.com.br

## Manual

http://portal.clearsale.com.br/downloads/total-tg-application-manual-integracao.pdf

## Contribuintes

Equipe Mozg

## License

[Comercial License] (LICENSE.txt)

## Badges

[![Join the chat at https://gitter.im/mozgbrasil](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mozgbrasil/)
[![Latest Stable Version](https://poser.pugx.org/mozgbrasil/magento-clearsale-php56/v/stable)](https://packagist.org/packages/mozgbrasil/magento-clearsale-php56)
[![Total Downloads](https://poser.pugx.org/mozgbrasil/magento-clearsale-php56/downloads)](https://packagist.org/packages/mozgbrasil/magento-clearsale-php56)
[![Latest Unstable Version](https://poser.pugx.org/mozgbrasil/magento-clearsale-php56/v/unstable)](https://packagist.org/packages/mozgbrasil/magento-clearsale-php56)
[![License](https://poser.pugx.org/mozgbrasil/magento-clearsale-php56/license)](https://packagist.org/packages/mozgbrasil/magento-clearsale-php56)
[![Monthly Downloads](https://poser.pugx.org/mozgbrasil/magento-clearsale-php56/d/monthly)](https://packagist.org/packages/mozgbrasil/magento-clearsale-php56)
[![Daily Downloads](https://poser.pugx.org/mozgbrasil/magento-clearsale-php56/d/daily)](https://packagist.org/packages/mozgbrasil/magento-clearsale-php56)

:cat2:
