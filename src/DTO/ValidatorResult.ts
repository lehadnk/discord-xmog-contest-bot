export class ValidatorResult {
    public readonly isValid: boolean;
    public readonly errorMessage: string;
    public readonly fields: any;

    constructor(isValid: boolean, errorMessage?: string, fields: object = {}) {
        this.isValid = isValid;
        this.errorMessage = errorMessage;
        this.fields = fields;
    }
}