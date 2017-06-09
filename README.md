[checkmark]: https://raw.githubusercontent.com/mozgbrasil/mozgbrasil.github.io/master/assets/images/logos/logo_32_32.png "MOZG"
![valid XHTML][checkmark]

[psr4]: http://www.php-fig.org/psr/psr-4/
[getcomposer]: https://getcomposer.org/
[uninstall-mods]: https://getcomposer.org/doc/03-cli.md#remove

# Mozg\IWD_Opc

## Sinopse

Checkout da compra em 1 passo para Magento

## Motivação

Automação para a instalação do módulo

Para mais informações, visite 

https://www.iwdagency.com/extensions/one-step-page-checkout.html

Note que não somos o desenvolvedor desta extensão

Esse repositório foi criado com o intuito de instalar o módulo via composer

Neste repositório foi adicionado somente o suporte ao composer e modman.

## Suporte / Dúvidas

Para obter o devido suporte entre em contato com a desenvolvedora do módulo

## Instalação - Atualização - Desinstalação - Desativação

Esta biblioteca destina-se a ser instalado usando o [Composer][getcomposer].

Autoloading compatível é [PSR-4][psr4]

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
	      "url": "https?://packages.firegento.com"
	    }
	  ],
	  "extra": {
	    "magento-root-dir": "./",
	    "magento-deploystrategy": "copy",
	    "magento-force": true
	  }
	}

Caso não exista o arquivo composer.json na raiz do projeto Magento, crie o mesmo adicionado o conteúdo acima

--

Para qualquer atualização no Magento sempre mantenha o Compiler e o Cache desativado

--

### Para instalar o módulo execute o comando a seguir no terminal do seu servidor

	composer require mozgbrasil/magento-iwd-opc:dev-master

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

	composer remove mozgbrasil/magento-iwd-opc && composer clear-cache && composer update

--

### Para desativar o módulo

Renomeie a pasta do módulo

Cada módulo tem a sua pasta no diretório /vendor/mozgbrasil/

--

## Perguntas mais frequentes "FAQ"

### Permitir Checkout como Visitante

Acesse no backend em:

	Sistema -> Configurações -> Vendas -> Fechar Pedido -> Permitir Checkout como Visitante -> Informe Não

### Erro: Target already exists (set extra.magento-force to override)

Na tentativa de instalar o módulo IWD_Opc via composer em um ambiente onde o mesmo já encontrava-se instalado é exibido o erro informando a existencia do módulo

Você precisa ativar a opção "extra.magento-force" no arquivo composer.json

Dessa forma será forçado a instalação do módulo, sobreescrevendo os arquivos

Fonte: <a href="https://mage2.pro/t/topic/42">https://mage2.pro/t/topic/42</a>

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
