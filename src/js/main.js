import Game from "./Game"
import LoadingScreenTemplate from "./templates/LoadingScreen.html"
import TestModeScreenTemplate from "./templates/TestModeScreen.html"
import CreativeModeScreenTemplate from "./templates/CreativeModeScreen.html"
import NormalModeScreenTemplate from "./templates/NormalModeScreen.html"
import * as d3 from "d3"
import "./css/style.css"

let app = d3.select("#app")
let loadingScreen = app.html(LoadingScreenTemplate);
let game = null;

/** Remove this code to put back loading screen */
app.html(TestModeScreenTemplate)
game = new Game(0);
game.create()

loadingScreen.select("[name='test']").on("click", () => {
    app.html(TestModeScreenTemplate)
    game = new Game(0);
    game.create()

})

loadingScreen.select("[name='creative']").on("click", () => {
    app.html(CreativeModeScreenTemplate)
    game = new Game(1);
    game.create()
})

loadingScreen.select("[name='normal']").on("click", () => {
    app.html(NormalModeScreenTemplate)
    game = new Game(2);
    game.create()
})



