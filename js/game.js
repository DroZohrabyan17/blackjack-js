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
      value: this.values[cardParts[1]]
    }
    return cardDetails;
  },
  // Next step.
  next: function(){},
  // Dealer need move or note?
  needMove: function(){},
  // Check WIN or not.
  checkWinner: function(){},
  // view Card value.
  viewCard: function(card){},

  nextBtnClick: function(){},
  stopBtnClick: function(){},

  // Calculate
  calculate: function(){

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

    that.playerCards.push(that.getCard());
    that.playerCards.push(that.getCard());

    that.dealerCards.push(that.getCard());

  },
}
