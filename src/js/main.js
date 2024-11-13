import { Dropdown } from 'bootstrap'
//import { FormHandler } from './formHandler'
//import { FormHandler } from './formHandler.prototype'
import { FormHandler } from './formHandler.class'

const $takeIdeaForm = document.querySelector('[data-form="pre-registration"]');

const formHandler = new FormHandler($takeIdeaForm, {
	validators: {
		phone: value => ({
			isValid: value.length === 4, // Todo Switch to proper validation
			errorMessage: 'phone phone phone phone',
		}),
	}
});

formHandler.afterSubmit(() => {
	const successMessage = document.createElement('div');

	successMessage.classList.add('success-message');
	successMessage.textContent = 'Thank You. Check You Email';

	$takeIdeaForm.after(successMessage);
	$takeIdeaForm.style.display = 'none';
});