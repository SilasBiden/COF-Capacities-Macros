import { CapacityMacros } from "./macros/macros.js"

Hooks.once("init", async function () {

    // Create a namespace within the game global
    game.cofcapacity = {
        macros : CapacityMacros
    };
});
