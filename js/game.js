let Game =  {
  // Cards group. foramt: type:value
  deck: [],
  // 1=> Sirt, 2 => Qyap, 3=> Khach, 4 => Ghar.
  cardsType: ['1', '2', '3', '4'],
  // Card balues.
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
  win: false,
  draw: false,
  ingame: true,
  playerMove: true,

  playerPoints: 0,
  playerCards: [],

  dealerPoints: 0,
  dealerCards: [],

  //Generate initial state.
  generate: function(){
    let that = this;
    // create deck.
    for(let key in that.values){
      that.cardsType.forEach((mast) => {
        that.deck.push( mast + ':' + key);
      });
    }
  },
  // Parse cart nominal value.
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
  // Next step.
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

  // Check WIN or not.
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

  },
  dealBtnClick: function(){
    this.playerCards.push(this.getCard());
    this.calculate();
    // this.calculatePoints();  XI CHI ASHXATUM??
    this.checkWinner();
    this.next();
  },
  stopBtnClick: function(){
    // this.dealerCards.delete(this.getCard());     //2 qaric avel chi tali...
    this.removeEmptyCard();

    this.playerMove = false;
    this.setBtnDisabled('deal');
    this.setBtnDisabled('stop');
    this.next();
  },
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

  // Calculate
  calculate: function(){
    this.playerPoints = this.calculatePoints(this.playerCards);
    this.dealerPoints = this.calculatePoints(this.dealerCards);
  },
  // Calculate helper.
  calculatePoints: function(cards){
    let tCount = 0;
    let points = 0;
    cards.forEach((card) => {
      points += card.value;
      if(card.key === 'T'){
        tCount++;
      }
    });
    // remove T values when points greate than 21.
    while(points > 21 && tCount > 0){
      points -= 10;
      tCount--;
    }
    return points;
  },
  //Gett random card from deck.
  getCard: function(){
    let that = this;
    let itemKey = Math.floor(Math.random() * that.deck.length);
    let cards = that.deck.splice(itemKey, 1);
    return that.parseCard(cards.pop());
  },

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

  finish: function(){
    let that = this;
    that.showAll();
    that.drawWinner(that.win, that.draw);
    this.setBtnDisabled('deal');
    this.setBtnDisabled('stop');
  },

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

  removeEmptyCard: function(){
    let emptyCard = document.querySelector('.empty');
    if(emptyCard){
      emptyCard.remove();
    }

  },

  drawBtn: function(id, text){
    text = text || id;
    let aHtml  = `<a class="btn" data-id="${id}" href="#">${text}</a>`;
    document.querySelector('#actions').innerHTML += aHtml;
  },
  setBtnDisabled: function(id){
    let a = document.querySelector('a[data-id="' + id + '"]');
    if(a.classList !== undefined){
      a.classList.add('disabled');
    }
  }
  ,
  removeBtnDisabled: function(id){
    let a = document.querySelector('a[data-id="' + id + '"]');
    if(a.classList !== undefined){
      a.classList.remove('disabled');
    }
  },
  init: function(){
    this.drawBtn('start');
    this.drawBtn('deal');
    this.drawBtn('stop');
    this.drawBtn('reset');
    this.setBtnDisabled('deal');
    this.setBtnDisabled('stop');
    this.setBtnDisabled('reset');
  },
  showAll: function(){
    // Show player cards.
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
   * @param bool forPlayer
   *   flag for draing position.
   * @param object card
   *   contain card information.
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
   * @param bool forPlayer
   *   flag for draing position.
   * @param object card
   *   contain card information.
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
