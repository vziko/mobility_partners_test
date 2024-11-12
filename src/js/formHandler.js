function FormHandler(form) {
	this.form = form;
	this.inputLists = [];
	this.validators = {};

	this.init = () => {
		this.form.setAttribute('novalidate', true);
		this.createInputsList();
		this.events();
	}

	this.createInputsList = () => {
		Array.from(this.form.elements).forEach(input => {
			if (input.tagName.toLowerCase() === 'input' && input.name) {

				const errorMessage = document.createElement('div');
				errorMessage.classList.add('error-message');

				this.inputLists.push({
					input,
					isRequired: input.required,
					validationType: input.dataset.validationType,
					get isValid() {
						return !(this.isRequired || this.validationType)
					},
					errorElement: errorMessage,
				});
			}
		});
	}

	this.events = () => {
		this.form.addEventListener('submit', this.submit.bind(this));
	}

	this.submit = e => {
		e.preventDefault();
		e.stopPropagation();

		let correctInputCounter = 0;

		this.inputLists.forEach((element) => {
			if(element.validationType) {
				this.checkValidationType(element) && correctInputCounter++;
			} else if(element.isRequired) {
				this.validators.required(element) && correctInputCounter++;
			} else {
				correctInputCounter++
			}
		})

		if (correctInputCounter === this.inputLists.length) {
			this.successValidation();
		}
	}

	this.checkValidationType = element => {
		switch (element.validationType) {
			case 'email':
				return this.validators.email(element);
			case 'phone':
				return this.validators.phone(element);
			default: return false
		}
	}

	this.validators.required = element => {
		const isValid = element.input.value.trim() !== '';
		return this.checkError(element, isValid, 'This field is required.');
	}

	this.validators.email = element => {
		if (this.validators.required(element)) {
			const isValid = String(element.input.value)
				.toLowerCase()
				.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				);
			return this.checkError(element, isValid, 'Please enter a valid email.');
		} else {
			return false;
		}
	}

	this.validators.phone = element => {
		if (this.validators.required(element)) {
			const isValid = element.input.value.length === 13; // Todo Switch to proper validation
			return this.checkError(element, isValid, 'Please enter a valid phone number.');
		} else {
			return false;
		}
	}

	this.checkError = (element, isValid, errorMessage) => {
		if(!isValid) {
			this.addError(element, errorMessage);
			return false;
		} else {
			this.removeError(element);
			return true;
		}
	}

	this.addError = (element, errorMessage) => {
		element.input.classList.add('is-invalid');
		element.errorElement.textContent = errorMessage;
		element.input.after(element.errorElement)
	}

	this.removeError = element => {
		element.input.classList.remove('is-invalid');
		element.errorElement.remove();
	}

	this.successValidation = () => {
		this.onAfterSubmit();
	}

	this.afterSubmit = callback => {
		this.onAfterSubmit = callback;
	}

	this.init();
}

export { FormHandler };