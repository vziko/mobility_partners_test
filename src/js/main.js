import { Dropdown } from 'bootstrap'

const TakeIdeaForm = document.querySelector('.take-idea-form');
const formEmail = TakeIdeaForm.querySelector('input[name="email"]');

TakeIdeaForm.addEventListener('submit', (e) => {
	e.preventDefault();
	e.stopPropagation();

	let errorMessage = document.querySelector('.error-message');

	if (!errorMessage) {
		errorMessage = document.createElement('div');
		errorMessage.classList.add('error-message');
		errorMessage.textContent = 'Invalid email';
	}

	if(validateEmail(formEmail.value)) {
		formEmail.classList.remove('is-invalid');
		if (errorMessage) {
			errorMessage.remove();
		}

		success();
	} else {
		if (!document.contains(errorMessage)) {
			formEmail.after(errorMessage);
		}
		formEmail.classList.add('is-invalid');
	}
})

const success = () => {
	const successMessage = document.createElement('div');
	successMessage.classList.add('success-message');
	successMessage.textContent = 'Thank You. Check You Email';
	TakeIdeaForm.after(successMessage);
	TakeIdeaForm.style.display = 'none';
}


const validateEmail = (email) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};