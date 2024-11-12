import { Dropdown } from 'bootstrap'
import { FormHandler } from './formHandler'

const $takeIdeaForm = document.querySelector('[data-form="pre-registration"]');

const formHandler = new FormHandler($takeIdeaForm);

formHandler.afterSubmit(() => {
	const successMessage = document.createElement('div');

	successMessage.classList.add('success-message');
	successMessage.textContent = 'Thank You. Check You Email';

	$takeIdeaForm.after(successMessage);
	$takeIdeaForm.style.display = 'none';
});