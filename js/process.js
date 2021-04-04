document.addEventListener('DOMContentLoaded', () => {
  Game.init();
  document.getElementById('actions').addEventListener('click', (event) => {
    event.preventDefault();
    let btn = event.target;
    let classes = btn.className;
    if(classes.indexOf('disabled') !== -1){  // chem haskacel??
      return;
    }
    let id = btn.dataset.id;
    switch(id){
      case 'start':
        Game.startGame();
        break;
      case 'deal':
        Game.dealBtnClick();
        break;
      case 'stop':
        Game.stopBtnClick();
        break;
      case 'reset':
        Game.resetBtnClick();
        break;
    }
  });


});
