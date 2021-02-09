'use strict'

import './media/style.scss'
import { getFormData, reportValidaty, addListerforError } from './form'

const submitbtn = document.querySelector('button') as HTMLButtonElement
const form = document.querySelector('form') as HTMLFormElement
    
submitbtn?.addEventListener('click', (event: Event)=> {
    event.preventDefault()
    const form = document.querySelector('form')
    if (form){
        if (! form?.checkValidity() ){
            reportValidaty(form)
        } else {
            const data = getFormData(form)
            console.log(data)
        }
    }
})

addListerforError(form)

const foo = (name: string) => {
    console.log(name)
}

foo(' Rahul das ....')

if(module.hot) {
    console.log('HOT RELOAD ENABLED')
	module.hot.accept()
}