// Import Modules
import { CofActor } from "./actors/actor.js";
import { CofItem } from "./items/item.js";

import { CofItemSheet } from "./items/item-sheet.js";
import { CofActorSheet } from "./actors/actor-sheet.js";

import { preloadHandlebarsTemplates } from "./system/templates.js";
import { registerHandlebarsHelpers } from "./system/helpers.js";
import { registerSystemSettings } from "./system/settings.js";

import { System, COF } from "./system/config.js";
import { Macros } from "./system/macros.js";
import registerHooks from "./system/hooks.js";
import { CofLootSheet } from "./actors/loot-sheet.js";
import { COFActiveEffectConfig } from "./system/active-effect-config.js";
import { EffectsModifications, customizeStatusEffects } from "./effects/effects.js";
import { CapaMacros } = "../../systems/cof/module/system/macros".js


Hooks.once("init", async function () {
    // Create a namespace within the game global
    game.cof = {
        skin : "base",
        capamacros : CapaMacros,
        config: COF
    };
});
