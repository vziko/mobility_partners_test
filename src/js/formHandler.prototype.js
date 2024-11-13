function FormHandler(form, option = {}) {
	this.form = form;
	this.option = option;
	this.inputLists = [];
	this.validators = {};
	this.onAfterSubmit = () => {};
	this.init();
}

FormHandler.prototype.init = function() {
	this.form.setAttribute('novalidate', true);

	this.createInputsList();
	this.events();

	const defaultValidators = {
		email: this.emailValidator.bind(this),
		phone: this.phoneValidator.bind(this),
	};

	this.validators = {
		...defaultValidators,
		...this.option.validators
	}
}

FormHandler.prototype.createInputsList = function() {
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

FormHandler.prototype.events = function() {
	this.form.addEventListener('submit', this.submit.bind(this));
}

FormHandler.prototype.submit = function(event) {
	event.preventDefault();
	event.stopPropagation();

	let correctInputCounter = 0;

	this.inputLists.forEach(element => {
		if(element.validationType) {
			this.checkValidation(element) && correctInputCounter++;
		} else if(element.isRequired) {
			this.validationRequired(element) && correctInputCounter++;
		} else {
			correctInputCounter++
		}
	})

	if (correctInputCounter === this.inputLists.length) {
		this.successValidation();
	}
}

FormHandler.prototype.checkValidation = function(element) {
	if (this.validationRequired(element)) {
		if (this.validators[element.validationType]) {
			const validationResult = this.validators[element.validationType](element.input.value);
			return this.checkError(element, validationResult);
		} else {
			console.warn(`Validator for type "${element.validationType}" is not defined.`);
			return true;
		}
	} else {
		return false;
	}
}

FormHandler.prototype.validationRequired = function(element) {
	const validationResult = {
		isValid: element.input.value.trim() !== '',
		errorMessage: 'This field is required.',
	};
	return this.checkError(element, validationResult);
}

FormHandler.prototype.emailValidator = value => {
	return {
		isValid: String(value)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			),
		errorMessage: 'Please enter a valid email.',
	}
}

FormHandler.prototype.phoneValidator = value => {
	return {
		isValid: value.length === 13, // Todo Switch to proper validation
		errorMessage: 'Please enter a valid phone number.',
	}
}

FormHandler.prototype.checkError = function(element, {isValid, errorMessage}){
	if(!isValid) {
		this.addError(element, errorMessage);
		return false;
	} else {
		this.removeError(element);
		return true;
	}
}

FormHandler.prototype.addError = (element, errorMessage) => {
	element.input.classList.add('is-invalid');
	element.errorElement.textContent = errorMessage;
	element.input.after(element.errorElement)
}

FormHandler.prototype.removeError = element => {
	element.input.classList.remove('is-invalid');
	element.errorElement.remove();
}

FormHandler.prototype.successValidation = function() {
	this.onAfterSubmit();
}

FormHandler.prototype.afterSubmit = function(callback) {
	this.onAfterSubmit = callback;
}

export { FormHandler };