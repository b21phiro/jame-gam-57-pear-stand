import './style.css';
import PearStand from "./PearStand.ts";

(() => {

    const rootElement = document.getElementById('app');
    if (!rootElement) {
        console.error('Root element not found');
        return;
    }

    const game = new PearStand(rootElement);
    game.init();
    game.start();

})();