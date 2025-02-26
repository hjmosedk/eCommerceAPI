// istanbul ignore file
// This file is not being tested because it is only a custom validator
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Ecommerce } from 'ckh-typings';

@ValidatorConstraint({ async: true })
export class isCurrencyConstraint implements ValidatorConstraintInterface {
  validate(currency: any) {
    const currencies = Object.values(Ecommerce.CurrencyType);

    return currencies.includes(currency);
  }
}

export const IsCurrency = (validationsOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationsOptions,
      constraints: [],
      validator: isCurrencyConstraint,
    });
  };
};
