import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AddressService {

    getStateArray() {
        return [
            'AL', 'AK', 'AZ', 'AR', 'CA',
            'CO', 'CT', 'DE', 'DC', 'FL',
            'GA', 'HI', 'ID', 'IL', 'IN',
            'IA', 'KS', 'KY', 'LA', 'ME',
            'MD', 'MA', 'MI', 'MN', 'MS',
            'MO', 'MT', 'NE', 'NV', 'NH',
            'NJ', 'NM', 'NY', 'NC', 'ND',
            'OH', 'OK', 'OR', 'PA', 'RI',
            'SC', 'SD', 'TN', 'TX', 'UT',
            'VT', 'VA', 'WA', 'WV', 'WS',
            'WY'
          ];
    }
}
