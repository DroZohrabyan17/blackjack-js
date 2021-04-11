/*
  @constructor
    Весь процесс игры
*/

let Game =  {
  /*
    @param array
      Сохраняется калода карт (52 карт)
  */
  deck: [],
  /*
    @param array
      Сохраняется масты карт от 1 до 4
  */
  cardsType: ['1', '2', '3', '4'],
  /*
    @param array
      Значение карт от 2 до туза
  */.
  values: {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'J': 10,
    'Q': 10,
    'K': 10,
    'T': 11
  },
  /*
    @param bool
      Выграл игрок или нет?
  */
  win: false,
  /*
    @param bool
      Ничья или нет?
  */
  draw: false,
  /*
    @param bool
      Игра в поцесе или нет?
  */
  ingame: true,
  /*
    @param bool
      ход игрока или нет?
  */
  playerMove: true,
  /*
    @param let
      содержит очки игрока
  */
  playerPoints: 0,
  /*
    @param array
      содержит карты игрока
  */
  playerCards: [],
  /*
    @param let
      содержит очки дилера
  */
  dealerPoints: 0,
  /*
    @param array
      содержит карты дилера
  */
  dealerCards: [],

  /*
    @constructor
      генерирует калода карт
  */
  generate: function(){
    let that = this;
    for(let key in that.values){
      that.cardsType.forEach((mast) => {
        that.deck.push( mast + ':' + key);
      });
    }
  },
  /*
    @constructor
    @param array card
      разбирает карты
  */
  parseCard: function(card){
    let cardParts = card.split(':');
    let cardDetails = {
      type: cardParts[0],
      key: cardParts[1],
      value: this.values[cardParts[1]],
      onBoard: false
    }
    return cardDetails;
  },

   // раздаёт карты дилеру до тех пор, пока очки дилера не удут больше 17

  next: function(){
    let that = this;
    if(!that.playerMove){
      while(that.ingame){
        that.dealerCards.push(that.getCard());
        that.calculate();
        that.checkWinner();
        if(that.dealerPoints > 17){
          that.ingame = false;
        }
        that.showAll();
      }
    }
    if(!that.ingame){
      that.finish();
    }
    that.showAll();
  },


    //Вычесляет кто выграл
  checkWinner: function(){
    let that = this;
    that.draw = false;
    that.calculate();
    if(that.playerCards.length == 2 && that.playerPoints == 21){
      that.win = true;
      that.ingame = false;
      return;
    }
    if(that.playerPoints > 21){
      that.win = false;
      that.ingame = false;
      return;
    }
    if(that.dealerPoints > 21){
      that.win = true;
      that.ingame = false;
      return;
    }
    if(that.playerPoints > that.dealerPoints){
      that.win = true;
    }else if(that.playerPoints == that.dealerPoints){
      that.win = true;
      that.draw = true;
    }else {
      that.win = false;
    }

  //Нажатье на кнопку "deal"

  },
  dealBtnClick: function(){
    this.playerCards.push(this.getCard());
    this.calculate();
    // this.calculatePoints();  XI CHI ASHXATUM??
    this.checkWinner();
    this.next();
  },
  //Нажатье на кнопку "stop"
  stopBtnClick: function(){
    this.removeEmptyCard();

    this.playerMove = false;
    this.setBtnDisabled('deal');
    this.setBtnDisabled('stop');
    this.next();
  },


  //Нажатье на кнопку "reset"
  resetBtnClick: function(){
    this.playerCards = [];
    this.dealerCards = [];
    this.playerPoints = 0;
    this.dealerPoints = 0;
    this.deck = [];
    this.ingame = true;
    this.playerMove = true;
    document.querySelector('#player .card-wrapper').innerHTML = '';
    document.querySelector('#dealer .card-wrapper').innerHTML = '';
    document.querySelector('#actions').innerHTML = '';
    let pointWrapper = document.querySelectorAll('.points-wrapper');
    for(let point of pointWrapper){
      point.innerHTML = '0';
    }
    let winner = document.querySelector('.winner');
    let draw = document.querySelector('.draw');
    if(winner){
      winner.classList.remove('winner');
    }
    if(draw){
      draw.classList.remove('draw');
    }
    this.init();
  },

  // Считает очки игрока и дилера
  calculate: function(){
    this.playerPoints = this.calculatePoints(this.playerCards);
    this.dealerPoints = this.calculatePoints(this.dealerCards);
  },

   // Считает очки игрока и дилера с тузом (значения Туза может быть 11 или 1)
  calculatePoints: function(cards){
    let tCount = 0;
    let points = 0;
    cards.forEach((card) => {
      points += card.value;
      if(card.key === 'T'){
        tCount++;
      }
    });
    // Вычесляет 10 очков если очки больше 21 и есть туз
    while(points > 21 && tCount > 0){
      points -= 10;
      tCount--;
    }
    return points;
  },
  //Раздаёт рандомные карты
  getCard: function(){
    let that = this;
    let itemKey = Math.floor(Math.random() * that.deck.length);
    let cards = that.deck.splice(itemKey, 1);
    return that.parseCard(cards.pop());
  },
  // Начало игры
  startGame: function(){
    let that = this;
    that.generate();
    that.setBtnDisabled('start');
    that.removeBtnDisabled('deal');
    that.removeBtnDisabled('stop');
    that.removeBtnDisabled('reset');

    that.drawCard(false);
    that.playerCards.push(that.getCard());
    that.playerCards.push(that.getCard());
    that.dealerCards.push(that.getCard());
    that.checkWinner();
    that.next();
  },
  // Завершение игры
  finish: function(){
    let that = this;
    that.showAll();
    that.drawWinner(that.win, that.draw);
    this.setBtnDisabled('deal');
    this.setBtnDisabled('stop');
  },
  /*
  @param bool is Player
    Возврашает кто выграл
  @param bool draw
    Ничья или нет
  */
  drawWinner: function(isPlayer, draw){
    let id;
    if(draw){
      document.getElementById('table').classList.add('draw');
      return;
    }
    if(isPlayer){
      id = 'player';
    }else{
      id = 'dealer';
    }
    document.getElementById(id).classList.add('winner');
  },

  //Удаляет закрытую карту дилера
  removeEmptyCard: function(){
    let emptyCard = document.querySelector('.empty');
    if(emptyCard){
      emptyCard.remove();
    }

  },

  /*
  Рисует кнопки

  @param object id
    id кнопки
  @param text text
    название кнопки
  */
  drawBtn: function(id, text){
    text = text || id;
    let aHtml  = `<a class="btn" data-id="${id}" href="#">${text}</a>`;
    document.querySelector('#actions').innerHTML += aHtml;
  },

   /*
    отключает кнопки

  @param object id
    id кнопки
  */
  setBtnDisabled: function(id){
    let a = document.querySelector('a[data-id="' + id + '"]');
    if(a.classList !== undefined){
      a.classList.add('disabled');
    }
  },

  /*
    Включает кнопки

  @param object id
    id кнопки
  */
  removeBtnDisabled: function(id){
    let a = document.querySelector('a[data-id="' + id + '"]');
    if(a.classList !== undefined){
      a.classList.remove('disabled');
    }
  },

  // Рисует кнопки, и отключает
  init: function(){
    this.drawBtn('start');
    this.drawBtn('deal');
    this.drawBtn('stop');
    this.drawBtn('reset');
    this.setBtnDisabled('deal');
    this.setBtnDisabled('stop');
    this.setBtnDisabled('reset');
  },

  /*
  Показывает карты и очки
  @constructor
  */
  showAll: function(){
    let that = this;
    that.playerCards.forEach((card) => {
      if(!card.onBoard){
        card.onBoard = true;
        that.drawCard(true, card);
      }
    });
    that.dealerCards.forEach( (card) => {
      if(!card.onBoard){
        card.onBoard = true;
        that.drawCard(false, card);
      }
    });
    that.drawPoint(true);
    that.drawPoint(false);


  },

  /**
      рисует очки для игрока и дилера

   * @param bool forPlayer
   *   для игрока или для дилера
   */
  drawPoint: function(forPlayer){
    let  id, point;
    if(forPlayer){
      point = this.playerPoints;
      id = '#player';
    } else{
      point = this.dealerPoints;
      id = '#dealer';
    }
    document.querySelector(id + ' .points-wrapper').innerHTML = point;
  },
  /**
    Рисует карты

   * @param bool forPlayer
   *   для игрока или для дилера
   * @param object card
   *   Содержит информацию о карте.

   @constructor
   */
  drawCard: function(forPlayer, card){
    let cardHtml = '<div class="card ';
    if(card !== undefined){
      cardHtml +=  't' + card.type;
      cardHtml += ' k' + card.key;
    } else{
      cardHtml += 'empty';
    }
    cardHtml += '"></div>';

    let  id;
    if(forPlayer){
      id = '#player';
    } else{
      id = '#dealer';
    }
    document.querySelector(id + ' .card-wrapper').innerHTML += cardHtml;
  }

}
