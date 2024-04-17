import { defineStore } from "pinia";
// import { ref } from "vue";

export const useRuleStore = defineStore('rule', () => {
    const selectRules = [
        (value: any) => {
            if(value) return true
    
            return 'You must make a choice'
        }
    ]
    
    const inputRules = [
        (value: any) => {
            if(value) return true
    
            return 'You must provide a number'
        }
    ]

    const numberRules = [
        (value: any) => {
            if(value <= 0) return true
    
            return 'The minimum number must be equal to 1'
        }
    ]

    const fileRules = [
        (value: any) => {
            if(value.length) return true
    
            return 'You must select an image'
        }
    ]

    return {
        selectRules,
        inputRules,
        numberRules,
        fileRules
    }
})