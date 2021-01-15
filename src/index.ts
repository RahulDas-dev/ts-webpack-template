'use strict'

import './media/style.scss'
import { getFormData, reportValidaty, addListerforError } from './form'

const submitbtn = document.querySelector('button')
const form = document.querySelector('form')
    
submitbtn?.addEventListener('click',(event: Event)=> {
    event.preventDefault()
    const form = document.querySelector('form')
    if (! form?.checkValidity() ){
        reportValidaty(form!)
    } else {
        const data = getFormData(form!)
        console.log(data)
    }
})

addListerforError(form!)
