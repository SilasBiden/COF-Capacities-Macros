// Import Modules
import { CofActor } from "../../systems/cof/module/actors/actor.js";
import { CofItem } from "../../systems/cof/module/items/item.js";

import { CofItemSheet } from "../../systems/cof/module/items/item-sheet.js";
import { CofActorSheet } from "../../systems/cof/module/actors/actor-sheet.js";

import { preloadHandlebarsTemplates } from "../../systems/cof/module/system/templates.js";
import { registerHandlebarsHelpers } from "../../systems/cof/module/system/helpers.js";
import { registerSystemSettings } from "../../systems/cof/module/system/settings.js";

import { System, COF } from "../../systems/cof/module/system/config.js";
import { Macros } from "../../systems/cof/module/system/macros.js";
import registerHooks from "../../systems/cof/module/system/hooks.js";
import { CofLootSheet } from "../../systems/cof/module/actors/loot-sheet.js";
import { COFActiveEffectConfig } from "../../systems/cof/module/system/active-effect-config.js";
import { EffectsModifications, customizeStatusEffects } from "../../systems/cof/module/effects/effects.js";
import { CapaMacros } from "./macros/macros.js";


Hooks.once("init", async function () {
    // Create a namespace within the game global
    game.cof = {
        capamacros : CapaMacros
    };
});
