export const getFormData = (form: HTMLFormElement) => {
    const inputs = form.querySelectorAll('input');
    let values: { [prop:string]: string} = {};
    form.querySelectorAll('input').forEach( (element: HTMLInputElement)=>{
        values[element.id] = element.value;
    });
    return values;
}

export const reportValidaty = (form: HTMLFormElement) => {
    form.querySelectorAll('input').forEach( (element: HTMLInputElement)=>{
        if ( !element.checkValidity() ) {
            element.classList.add('error');
            element.classList.remove('mb-4');
            console.dir(element.validationMessage);
            if (element.nextElementSibling)
                element.nextElementSibling.innerHTML = `<small>${element.validationMessage}</small>`;
        }
    });
}

export const addListerforError = (form: HTMLFormElement) => {
    form.querySelectorAll('input').forEach( (element: HTMLInputElement )=>{
       element.addEventListener('input',(event)=>{           
        element.classList.remove('error');
        element.classList.add('mb-4');
        if (element.nextElementSibling)
            element.nextElementSibling.innerHTML = '';
       });
    });
}