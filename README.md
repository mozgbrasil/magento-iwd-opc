[checkmark]: https://raw.githubusercontent.com/mozgbrasil/mozgbrasil.github.io/master/assets/images/logos/logo_32_32.png "MOZG"
![valid XHTML][checkmark]

[psr4]: http://www.php-fig.org/psr/psr-4/
[getcomposer]: https://getcomposer.org/
[uninstall-mods]: https://getcomposer.org/doc/03-cli.md#remove
[artigo-composer]: http://mozg.com.br/ubuntu/composer
[ioncube-loader]: http://www.ioncube.com/loaders.php
[acordo]: http://mozg.com.br/acordo-licenca-usuario-final/

# IWD\Opc

## Sinopse

Checkout da compra em 1 passo para Magento

## Motivação

Automação para a instalação do módulo

Para mais informações, visite

https://www.iwdagency.com/extensions/magento-1-one-page-checkout-suite.html

Note que não somos o desenvolvedor desta extensão

Esse repositório foi criado com o intuito de instalar o módulo via composer

Neste repositório foi adicionado somente o suporte ao composer e modman.

## Suporte / Dúvidas

Para obter o devido suporte entre em contato com a desenvolvedora do módulo

## Testando na Heroku

Gostaria de apresentar o aplicativo que disponibilizei para a plataforma Heroku

Com apenas 1 clique, o aplicativo cria sua loja virtual usando a plataforma de comércio eletrônico Magento e instala os módulos da MOZG

[https://github.com/mozgbrasil/heroku-magento#descrição](https://github.com/mozgbrasil/heroku-magento#descrição)

## Instalação - Atualização - Desinstalação - Desativação

--

Este módulo destina-se a ser instalado usando o [Composer][getcomposer]

Execute o seguinte comando no terminal, para visualizar a existencia do Composer e sua versão

	composer --version

Caso não tenha o Composer em seu ambiente, sugiro ler o seguinte artigo [Clique aqui][artigo-composer]

--

Sugiro manter um ambiente de testes para efeito de testes e somente após os devidos testes aplicar os devidos procedimento no ambiente de produção

--

Sugiro efetuar backup da plataforma Magento e do banco de dados

--

Antes de efetuar qualquer atualização no Magento sempre mantenha o Compiler e o Cache desativado

--

Certique se da presença do arquivo composer.json na raiz do seu projeto Magento e que o mesmo tenha os parâmetros semelhantes ao modelo JSON abaixo

	{
	  "minimum-stability": "dev",
	  "prefer-stable": true,
	  "license": [
	    "proprietary"
	  ],
	  "repositories": [
	    {
	      "type": "composer",
	      "url": "https://packages.firegento.com"
	    }
	  ],
	  "extra": {
	    "magento-root-dir": "./",
	    "magento-deploystrategy": "copy",
	    "magento-force": true
	  }
	}

Caso não exista o arquivo composer.json na raiz do projeto Magento, crie o mesmo adicionado o conteúdo acima

### Para instalar o módulo execute o comando a seguir no terminal do seu servidor

	composer require mozgbrasil/magento-iwd-opc:dev-master

Você pode verificar se o módulo está instalado, indo ao backend em:

	STORES -> Configuration -> ADVANCED/Advanced -> Disable Modules Output

--

### Para atualizar o módulo execute o comando a seguir no terminal do seu servidor

	composer update

Na ocorrência de erro, renomeie a pasta /vendor/mozgbrasil e execute novamente

Para checar a data do módulo execute o seguinte comando

	grep -ri --include=*.json 'time": "' ./vendor/mozgbrasil

--

### Para [desinstalar][uninstall-mods] o módulo execute o comando a seguir no terminal do seu servidor

	composer remove mozgbrasil/magento-iwd-opc

--

### Para desativar o módulo

1. Antes de efetuar qualquer processo que envolva atualização sobre o Magento é necessário manter o Compiler e Cache desativado

2. Caso queira desativar os módulos da MOZG renomeie a seguinte pasta app/code/community/IWD

A desativação do módulo pode ser usado para detectar se determinada ocorrência tem relação com o módulo

--

## Perguntas mais frequentes "FAQ"

### Sobre personalização

O checkout IWD_Opc é de código aberto, entre em contato com o seu desenvolvedor para o mesmo efetuar as personalizações

### Permitir Checkout como Visitante

Acesse no backend em:

	Sistema -> Configurações -> Vendas -> Fechar Pedido -> Permitir Checkout como Visitante -> Informe Não

### Erro: Target already exists (set extra.magento-force to override)

Na tentativa de instalar o módulo IWD_Opc via composer em um ambiente onde o mesmo já encontrava-se instalado é exibido o erro informando a existencia do módulo

Você precisa ativar a opção "extra.magento-force" no arquivo composer.json

Dessa forma será forçado a instalação do módulo, sobreescrevendo os arquivos

Fonte: <a href="https://mage2.pro/t/topic/42">https://mage2.pro/t/topic/42</a>

### FIX: IE 8

Não estava funcionando a seleção do radio quando clicado no label

Encontrei a solução abaixo em

https://stackoverflow.com/questions/1252690/ie-hidden-radio-button-not-checked-when-the-corresponding-label-is-clicked

	FIX:
		Replace
			style="display:none;"
		with
			style="-moz-opacity:0;filter:alpha(opacity:0);opacity:0;"

Alterado o CSS

/skin/frontend/base/default/css/iwd/opc/opc.css

DE

.opc-wrapper-opc .payment-block dt input{display:block;position:absolute;height:44px; width:100%;left:0;top:0; opacity:0;cursor:pointer;margin:0 !important;display:none;}

Para

.opc-wrapper-opc .payment-block dt input{display:block;position:absolute;height:44px; width:100%;left:0;top:0; opacity:0;cursor:pointer;margin:0 !important;-moz-opacity:0;filter:alpha(opacity:0);opacity:0;}

## Badges

[![Join the chat at https://gitter.im/mozgbrasil](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mozgbrasil/)
[![Latest Stable Version](https://poser.pugx.org/mozgbrasil/magento-iwd-opc/v/stable)](https://packagist.org/packages/mozgbrasil/magento-iwd-opc)
[![Total Downloads](https://poser.pugx.org/mozgbrasil/magento-iwd-opc/downloads)](https://packagist.org/packages/mozgbrasil/magento-iwd-opc)
[![Latest Unstable Version](https://poser.pugx.org/mozgbrasil/magento-iwd-opc/v/unstable)](https://packagist.org/packages/mozgbrasil/magento-iwd-opc)
[![License](https://poser.pugx.org/mozgbrasil/magento-iwd-opc/license)](https://packagist.org/packages/mozgbrasil/magento-iwd-opc)
[![Monthly Downloads](https://poser.pugx.org/mozgbrasil/magento-iwd-opc/d/monthly)](https://packagist.org/packages/mozgbrasil/magento-iwd-opc)
[![Daily Downloads](https://poser.pugx.org/mozgbrasil/magento-iwd-opc/d/daily)](https://packagist.org/packages/mozgbrasil/magento-iwd-opc)
[![Reference Status](https://www.versioneye.com/php/mozgbrasil:magento-iwd-opc/reference_badge.svg?style=flat-square)](https://www.versioneye.com/php/mozgbrasil:magento-iwd-opc/references)
[![Dependency Status](https://www.versioneye.com/php/mozgbrasil:magento-iwd-opc/1.0.0/badge?style=flat-square)](https://www.versioneye.com/php/mozgbrasil:magento-iwd-opc/1.0.0)

:cat2:
