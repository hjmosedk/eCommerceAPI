import { PersonalInformationModel } from './personalInformationModel';
import { AddressModel } from './addressModel';

export interface CustomerModel {
  personalInformation: PersonalInformationModel;
  shippingAddress: AddressModel;
  billingAddress: AddressModel;
}
