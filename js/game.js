let Game =  {
  // Cards group.
  kalod: [],
  // 1=> Sirt, 2 => Qyap, 3=> Khach, 4 => Ghar.
  cardsType: ['1', '2', '3', '4'],
  // Card balues.
  valuse: {
    '2' => 2,
    '3' => 3,
    '4' => 4,
    '5' => 5,
    '6' => 6,
    '7' => 7,
    '8' => 8,
    '9' => 9,
    '10' => 10,
    'J' => 10,
    'Q' => 10,
    'K' => 10,
    'T' => 11
  },
  playerMove: true,

  playerPoints: 0,
  playerCards: [],

  dealerPoints: 0,
  dealerCards: [],

  //Generate initial state.
  generate: function(){},
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
  startGame: function(){},
}
