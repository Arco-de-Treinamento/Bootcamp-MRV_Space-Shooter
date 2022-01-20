
<h1 align = "center">
  <img src= "https://github.com/JosManoel/Bootcamp-MRV_Nave-Game/blob/main/assets/img/UI/banner1.png" width = "400"/>
  
  <p align="center">
    <img src="https://img.shields.io/github/last-commit/JosManoel/Bootcamp-MRV_Space-Shooter">
    <img src="https://img.shields.io/github/license/JosManoel/Bootcamp-MRV_Space-Shooter">
    <img src="https://img.shields.io/github/repo-size/JosManoel/Bootcamp-MRV_Space-Shooter">
  </p>
</h1>

<p align ="center">
<a href= "#sobre-este-projeto">👨🏻‍💻 Sobre este projeto</a> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#space-shotter">🛸 O Space Shooter</a> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#controles">🎮 O Controles</a> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#desenvolvimento">💻 Desenvolvimento</a> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#conclusao">📝 Conclusão</a> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#leitura">📚 Leitura e links recomendados</a> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#licenca">📝 Licença</a>
</p>

***

<h2 id = "sobre-este-projeto">👨🏻‍💻 Sobre este projeto</h2>

Este projeto foi desenvolvido durante o Bootcamp MRV Fullstack Developer, oferecido em conjunto com a [MRV](https://www.mrv.com.br/), a [DIO (Digital Inovation One)](https://digitalinnovation.one/) e a [Órbi Conecta](https://orbi.co/). Durante a produção deste game foram utilizados vários conceitos apredendidos durante o curso, como o uso da orientação a objetos e o JQuery, com o intuito de facilitar o desenvolvimento.

***

<h2 id="space-shotter">🛸 O Space Shooter</h2>
O jogo produzido consiste em um game retrô semelhante ao Asteroids, desenvolvido em 1979 pela Atari. Sua gameplay consiste em destruir os asteroides antes que eles cheguem a nave, utilizando uma arma que lança bolas de energia. Conforme os asteroides são destruídos a pontuação total cresce, aumentando também a dificuldade do game de forma exponencial.
 
<p align = "center">
  <img src= "https://github.com/JosManoel/Bootcamp-MRV_Nave-Game/blob/main/assets/img/UI/banner4.png" width = "700"/>
</p> 

***

<h2 id="controles">🎮 O Controles</h2>

A movimentação e combate do game é feita exclusivamente pelo mouse, onde a movimentação da nave no eixo X é realizada pelo translado do mouse e o laser é lançado pelo botão esquerdo. Quando o game é iniciado o ponteiro do mouse é automaticamente ocultado, liberando toda a tela para visualização do combate com os asteroides. 

<p align = "center">
  <img src= "https://github.com/JosManoel/Bootcamp-MRV_Nave-Game/blob/main/assets/img/UI/banner2.png" width = "700"/>
</p> 

***

<h2 id="desenvolvimento">💻 Desenvolvimento</h2>

O game foi desenvolvimento inteiramente com JavaScript (Vanilla e JQuery), CSS3 e HTML5, utilizando o conhecimento adquirido durante o bootcamp. O projeto original, ministrado pelo instrutor Denilson Bonatti, na atividade "Construindo o seu primeiro jogo de naves", também foi utilizado a biblioteca collision, para JQuery, que verifica a colisão entre dois elementos na tela. No entanto, a sua utilização se tornou problemática no desenvolvimento deste game, levando a construção de um colissor próprio. 

<h3>O Colissor</h3>

O colisor desenvolvido utiliza as coordenadas em tempo real do elemento na tela para produzir um "box collider", que pode ser acrescido através do parâmetro de _offsetBoxCollider_, retornando um valor booleano **true** quando um elemento que contém a classe informada no parâmetro _selectedClass_ é detectado. A verificação de detecção funciona através de um querySelectorAll, que seleciona todos os elementos com a classe informada na tela e testa a sua colisão com o objeto através de um laço de repetição. 

```
function collider(object, selectedClass, offsetBoxCollider = 0, blackList = null){
    const objectBoxCollider = object.getBoundingClientRect();
    
    const topCollider = objectBoxCollider.top - offsetBoxCollider;
    const bottomCollider = objectBoxCollider.bottom + offsetBoxCollider;
    const leftCollider = objectBoxCollider.left - offsetBoxCollider;
    const rightCollider = objectBoxCollider.right + offsetBoxCollider;

    var elementList = document.querySelectorAll(selectedClass);

    if(elementList.length > 0){
        for (element of elementList){
            const laserObject = document.getElementById(element.id);
            const laserValues = laserObject.getBoundingClientRect();
            if(
                laserValues.top >= topCollider && 
                laserValues.bottom <= bottomCollider &&
                laserValues.left >= leftCollider &&
                laserValues.right <= rightCollider &&
                !blackListCheck(blackList, element.id)
            ){
                return true;
            }
        }
    } 
    return false; 
}
```

Além disso, o sistema de colisão funciona em conjunto com uma blackList, que quando informada no parâmetro _blackList_, realiza a checagem do ID do elemento colidido, evitando múltiplas colisões com o mesmo objeto. Neste game esta função tem o objetivo de permitir que o player fique "invisível" para um asteroide que já foi detectado, eliminando as múltiplas colisões com um único asteroide.

```
function blackListCheck(blackList, objectID){
    if(blackList != null){
        if(blackList.length > 0){
            for(element of blackList){
                if(element == objectID){
                    return true;
                } 
            }
        }  
        blackList.push(objectID);  
    }
    return false;
}

```
<h3>Pontuação</h3>

Além de um colisor próprio, também foi desenvolvido um sistema de pontuação, que salva maior pontuação utilizando o localStorage, que mantém os dados de score na máquina. Deste modo é possível observar a sua pontuação adquirida em game e a maior pontuação obtida entre as partidas. 
 
```
function getHighScore(currentScore){
    var highScore = localStorage.getItem("HighScore");
    
    if (highScore == null){
        localStorage.setItem("HighScore", currentScore);
        return currentScore; 
    } else if (currentScore >= highScore){
        localStorage.setItem("HighScore", currentScore);
        return currentScore; 
    } else {
        return highScore;
    }
}
```

<p align = "center">
  <img src= "https://github.com/JosManoel/Bootcamp-MRV_Nave-Game/blob/main/assets/img/UI/banner3.png" width = "700"/>
</p> 

***

<h2 id="conclusao">📝 Conclusão</h2>

Durante o desenvolvimento do game pude aprofundar meus conhecimentos com o desenvolvimento web, utilizando o JavaScript, CSS3 e HTML5, de maneira a fixar o conhecimento adquirido durante parte do BootCamp MRV Fullstack Developer. Foi uma experiência bastante edificante e espero continuar estudando o desenvolvimento web ou com multiplataformas através de framework's como o React Native e o Flutter.

***

<h2 id="leitura">📚 Leitura e links recomendados</h2>

* [JQuery](https://jquery.com/)
* [KENNEY](https://www.kenney.nl/assets)

***

<h2 id="licenca">📝 Licença</h2>

- Este projeto está sob a licença [MIT](https://github.com/JosManoel/NLW_Together-Flutter/blob/main/LICENSE).
- Todos as imagens e sons utilizados no game foram retirados do pacote de assets gratuítos KENNEY.

***

<div align = "center">

  👋 Feito por [JosManoel](https://github.com/JosManoel) com ☕ , 🎧 e 💻.

</div>
