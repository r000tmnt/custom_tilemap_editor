import tutorial_1 from './level/tutorial_1_en.json'
import ui from './ui/ui_en.json'
import potion from './item/item_potion_en.json'
import weapon from './item/item_weapon_en.json'
import armor from './item/item_armor_en.json'
import material from './item/item_material_en.json'
import key from './item/item_key_en.json'
import other from './item/item_other_en.json'
import skill_sword from './skill/sword_en.json'
import buff from './skill/buff_en.json'
import debuff from './skill/debuff_en.json'
import job from './class/class_en.json'

export default {
    tutorial_1,
    ui,
    job,
    "item": {
        potion,
        weapon,
        armor,
        material,
        key,
        other
    },
    "skill":{
        skill_sword,
        buff,
        debuff
    },
    "demo": "This is the end of the demo.\nThank you for playing the game.",
    "loading": "Loading...",
    "tap": "TAP TO CONTINUE",
    "back": "Back"
}