/*
// Import Modules
import { CofActor } from "../../../systems/cof/module/actors/actor.js";
import { CofItem } from "../../../systems/cof/module/items/item.js";

import { CofItemSheet } from "../../../systems/cof/module/items/item-sheet.js";
import { CofActorSheet } from "../../../systems/cof/module/actors/actor-sheet.js";

import { preloadHandlebarsTemplates } from "../../../systems/cof/module/system/templates.js";
import { registerHandlebarsHelpers } from "../../../systems/cof/module/system/helpers.js";
import { registerSystemSettings } from "../../../systems/cof/module/system/settings.js";

import { System, COF } from "../../../systems/cof/module/system/config.js";
import { Macros } from "../../../systems/cof/module/system/macros.js";
import registerHooks from "../../../systems/cof/module/system/hooks.js";
import { CofLootSheet } from "../../../systems/cof/module/actors/loot-sheet.js";
import { COFActiveEffectConfig } from "../../../systems/cof/module/system/active-effect-config.js";
import { EffectsModifications, customizeStatusEffects } from "../../../systems/cof/module/effects/effects.js"; */


export class CapacityMacros {

    /**
     * @name convertToCapacityDescription
     * @description
     * 
     * @param {*} html
     * @returns 
     */
    static convertToCapacityDescription = async function (html){ 
        // Create a new div element
        let tempDivElement = document.createElement("div");
    
        // Set the HTML content with the given value and remove the Description word
        tempDivElement.innerHTML = html.replace('Description','');
    
        // Retrieve the text property of the element 
        return tempDivElement.textContent || tempDivElement.innerText || "";
    }
    
    /**
     * @name CapacityDescriptionMacro
     * @description
     * 
     * @param {*} capacityname
     * @param {*} description_flag
     * @returns 
     */
    static CapacityDescriptionMacro = async function (capacityname, description_flag){
        // si la fonction est lancée sans de nom de capacité, on ne fait rien
        if (capacityname === undefined) return;

                // description_setting devra être sélectionnable depuis le module setting, alors dans les paramétres de la fonction description_flag = description_setting
        const description_setting = true;
        // si description_flag n'est pas dans les paramètres, on prend le setting général
        if (description_flag === undefined | description_flag === null) description_flag = description_setting;
        // si description_flag est à la valeur false, c'est que la description n'est pas désirée ni dans les paramètres de config, nidans les paramètres de la macro
        if (description_flag === false) return;

        // on récupère l'objet actor
        const actor = game.cof.macros.getSpeakersActor();
     
        // Several tokens selected
        if (actor === null) return;
        // Aucun acteur cible
        if (actor === undefined) return ui.notifications.error(game.i18n.localize("COF.notification.MacroNoActorAvailable"));

        // on récupère l'objet capacity de l'objet actor d'après son nom
        let capacity = actor.getItemByName(capacityname);
        // !!! pas trouver où sont définis les notifications...
        if (capacity === undefined) return ui.notifications.error(game.i18n.localize("COF.notification.MacroNoActorAvailable"));

        // Si on veut afficher la description, on récupère la description stockée dans capacity et on enlève le header Description qui s'y trouve
        let description_data = description_flag ? this.convertToCapacityDescription(capacity.data.data.description) : "";
        // On crée le message affichant le nom de la capacité et sa description si désirée
        let msg_capa = "<h2>"+ capacityname + "</h2>" + description_data;
        // Affiche le message indiquant la capacité sélectionnée
        ChatMessage.create({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({token: actor}),
            content: msg_capa
        });
    }

    /**
     * @name COFrollCapacityMacro
     * @description
     * 
     * @param {*} capacityname
     * @param {*} stat 
     * @param {*} bonus 
     * @param {*} malus
     * @param {*} byrank
     * @param {*} critRange
     * @param {*} isSuperior
     * @param {*} overload_flag
     * @param {*} dialog
     * @param {*} difficulty
     * @returns 
     */
    static rollCapacityMacro = async function (capacityname, stat, bonus=0, malus=0, byrank = false, critRange, isSuperior = false,  overload_flag = true, dialog= false, difficulty){
        
        // si la fonction est lancée sans de nom de capacité, on ne fait rien
        if (capacityname === undefined) return;

        // on récupère l'objet actor
        const actor = game.cof.macros.getSpeakersActor();

        /* Si une caractéristique est indiquée dans les paramètres 
        alors on doit faire en plus un test de compétence (pour l'instant cela ne marche 
        qu'avec une seule stat, on pourra voir si il y a besoin de plus) */

        if (stat !== null && stat !== undefined){

            
            let bonusfinal = bonus; // par défaut le bonus final sera le bonus des paramètres
            let description_rank = ""; //par défaut, il n'y a pas besoin d'afficher le rang dans la voie
                 
            // si le bonus est en fonction du rang
            if (byrank){
                let pathname = capacity.data.data.path.name; // on indentifie la voie
                let rank = actor.getPathRank(pathname); // on récupère le rang de cette voie
                if (rank !== undefined) bonusfinal = bonus * rank; // on calcule le bonus final
                description_rank = "Rang dans la " + pathname + " : " + rank + "\n"; // on crée le message correspondant
            }
            
            // on crée le message affiché lors du jet
            let description_roll = description_rank + "Bonus de " + stat.toUpperCase() + " : +" + bonus;

            // copier de rollStatMacro
            let statObj; // on récupère l'objet correspondant à la caractéristique
            switch(stat){
            case "for" :
            case "str" : statObj = eval(`actor.data.data.stats.str`); break;
            case "dex" : statObj = eval(`actor.data.data.stats.dex`); break;
            case "con" : statObj = eval(`actor.data.data.stats.con`); break;
            case "int" : statObj = eval(`actor.data.data.stats.int`); break;
            case "sag" :
            case "wis" : statObj = eval(`actor.data.data.stats.wis`); break;
            case "cha" : statObj = eval(`actor.data.data.stats.cha`); break;
            case "atc" :
            case "melee" : statObj = eval(`actor.data.data.attacks.melee`); break;
            case "atd" :
            case "ranged" : statObj = eval(`actor.data.data.attacks.ranged`); break;
            case "atm" :
            case "magic" : statObj = eval(`actor.data.data.attacks.magic`); break;
            default :
                ui.notifications.error(game.i18n.localize("COF.notification.MacroUnknownStat")); 
                break;
            }
            // on en récupère la valeur de Mod.
            let mod = statObj.mod;

            // Pour les caractéristiques Force et Dextérité
            if (stat === "for" || stat === "str" || stat === "dex") {
            
                // Prise en compte de la notion de PJ incompétent
                if (game.settings.get("cof", "useIncompetentPJ")) {
                malus += actor.getIncompetentSkillMalus(stat);
                }

                // Prise en compte de la notion d'encombrement si voulu dans les paramètres (par défaut)
                if (overload_flag) malus += actor.getOverloadedSkillMalus(stat);

                // Prise en compte des bonus ou malus liés à la caractéristique
                let skillBonus = statObj.skillbonus;
                if (skillBonus) bonus += skillBonus;
                let skillMalus = statObj.skillmalus;
                if (skillMalus) malus += skillMalus;
            }

            // Détermination des valeurs pour les succès critiques
            let crit = parseInt(critRange);
            crit = !isNaN(crit) ? crit : 20;

            // Détermination si le jet est avec avantage
            let superior_flag = statObj.superior | isSuperior;

            // Si on désire la boîte de dialogue
            if (dialog){
            CofRoll.skillRollDialog(actor, capacityname, mod, bonus, malus, crit, superior_flag , onEnter, description_roll, actor.isWeakened());
            }
            else{
                // Sinon il faut déterminer le type de lancer
                let type_dice = actor.isWeakened() ? "d12" : "d20"; // si joueur affaibli, on lance des d12
                let dice = superior_flag ? "2" + type_dice + "kh" : "1" + type_dice; // si avantage, on lance 2d

                return new CofSkillRoll(capacityname, dice, "+" + mod, bonus, malus, difficulty, crit, description_roll).roll();
            }
        }
        else {
            return;
        }  
    }  

}

