/**
 *   Весь процесс игры
 */
let Game =  {

  /**
   *  Масив в котором сохраняется калоду карт (52 карт).
   */
  deck: [],

  /**
   *  Мвсив в котором сохраняется масты карт от 1 до 4.
   */
  cardsType: ['1', '2', '3', '4'],

  /**
   *  Масив в котором сохраняется Значение карт от 2 до туза.
   */
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

  /**
   *  Решает выграл игрок или нет.
   */
  win: false,

  /**
   *  Решает ничья или нет.
   */
  draw: false,

  /**
   *  Решает игра в поцесе или нет.
   */
  ingame: true,

  /**
   *  Решает ход игрока или нет.
   */
  playerMove: true,

  /**
   *  Содержит очки игрока.
   */
  playerPoints: 0,

  /**
   *   Содержит карты игрока.
   */
  playerCards: [],

  /**
   *   Содержит очки дилера.
   */
  dealerPoints: 0,

  /**
   *   Содержит карты дилера.
   */
  dealerCards: [],

  /**
   *   Генерирует калода карт.
   */
  generate: function(){
    let that = this;
    for(let key in that.values){
      that.cardsType.forEach((mast) => {
        that.deck.push( mast + ':' + key);
      });
    }
  },

  /**
   * param {array} card
   * return {cardDetails} Детали карт.
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

  /**
   *
   *
   */
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

  /**
   *  Функция которая определяет кто выгал.
   */
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

  /**
   *  Фукция кнопки "Deal".
   */
  },
  dealBtnClick: function(){
    this.playerCards.push(this.getCard());
    this.calculate();
    this.checkWinner();
    this.next();
  },

  /**
   *  Фукция кнопки "Stop".
   */
  stopBtnClick: function(){
    this.removeEmptyCard();

    this.playerMove = false;
    this.setBtnDisabled('deal');
    this.setBtnDisabled('stop');
    this.next();
  },

  /**
   *  Фукция кнопки "Reset".
   */
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

  /**
   * Считает очки с помощю функции calculatePoints, и держит число в playerPoints
   * и в dealerPoints.
   *
   * @see calculatePoints
   */
  calculate: function(){
    this.playerPoints = this.calculatePoints(this.playerCards);
    this.dealerPoints = this.calculatePoints(this.dealerCards);
  },

  /**
   *  Считает очки, где туз имеет 2 значение (11 или 1).
   *
   *  @param {array} cards
   *    Содержит в себе карты игрока и карты дилера отдельно.
   *  @return {points} Очки игрока или дилера.
   */
  calculatePoints: function(cards){
    let tCount = 0;
    let points = 0;
    cards.forEach((card) => {
      points += card.value;
      if(card.key === 'T'){
        tCount++;
      }
    });
    while(points > 21 && tCount > 0){
      points -= 10;
      tCount--;
    }
    return points;
  },

  /**
   * Берёт рандомный карт из deck.
   *
   * @see deck
   */
  getCard: function(){
    let that = this;
    let itemKey = Math.floor(Math.random() * that.deck.length);
    let cards = that.deck.splice(itemKey, 1);
    return that.parseCard(cards.pop());
  },

  /**
   * После нажати на кнопку Start начинается игра.
   */
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

  /**
   *  Окончание игры, после победы или поражения.
   */
  finish: function(){
    let that = this;
    that.showAll();
    that.drawWinner(that.win, that.draw);
    this.setBtnDisabled('deal');
    this.setBtnDisabled('stop');
  },

  /**
   *  @param bool is Player
   *    Возврашает кто выграл
   *  @param bool draw
   *    Ничья или нет
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

  /**
   *  Удаляет закрытую карту дилера.
   */
  removeEmptyCard: function(){
    let emptyCard = document.querySelector('.empty');
    if(emptyCard){
      emptyCard.remove();
    }

  },

  /**
   *  Рисует кнопки
   *
   *  @param object id
   *    id кнопки
   *  @param text text
   *    название кнопки
   */
  drawBtn: function(id, text){
    text = text || id;
    let aHtml  = `<a class="btn" data-id="${id}" href="#">${text}</a>`;
    document.querySelector('#actions').innerHTML += aHtml;
  },

  /**
   * отключает кнопки
   *
   *  @param object id
   *    id кнопки
   */
  setBtnDisabled: function(id){
    let a = document.querySelector('a[data-id="' + id + '"]');
    if(a.classList !== undefined){
      a.classList.add('disabled');
    }
  },

  /**
   *  Включает кнопки
   *
   *  @param object id
   *    id кнопки
   */
  removeBtnDisabled: function(id){
    let a = document.querySelector('a[data-id="' + id + '"]');
    if(a.classList !== undefined){
      a.classList.remove('disabled');
    }
  },

  /**
   *  Рисует кнопки, и когда нужно их отключает.
   */
  init: function(){
    this.drawBtn('start');
    this.drawBtn('deal');
    this.drawBtn('stop');
    this.drawBtn('reset');
    this.setBtnDisabled('deal');
    this.setBtnDisabled('stop');
    this.setBtnDisabled('reset');
  },

  /**
   *  Показывает на экране карты и очки.
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
   *   рисует очки для игрока и дилера
   *
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
   * Рисует карты
   *
   * @param bool forPlayer
   *   для игрока или для дилера
   * @param object card
   *   Содержит информацию о карте.
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
