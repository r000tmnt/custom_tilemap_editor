import { defineStore } from "pinia";
// import { ref } from "vue";

export const useRuleStore = defineStore('rule', () => {
    const selectRules = [
        (value: any) => {
            if(value) return true
    
            return 'You must make a choice'
        }
    ]

    const selectMultipleRules = [
        (value: any) => {
            if(value || value.length) return true
    
            return 'You must make a choice'
        }
    ]
    
    const inputRules = [
        (value: any) => {
            if(value) return true
    
            return 'You must type something'
        }
    ]

    const numberRules = [
        (value: any) => {
            if(Number(value) >= 1) return true
    
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
        selectMultipleRules,
        inputRules,
        numberRules,
        fileRules
    }
})