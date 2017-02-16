import { IUserBase } from '../../../api/user/models.d';
import * as faker from 'faker';

export const user_mocks: {successes: Array<IUserBase>, failures: Array<{}>} = {
    "failures": [
        {},
        {"email": "foo@bar.com "},
        {"password": "foo "},
        {"email": "foo@bar.com", "password": "foo", "bad_prop": true}
    ],
    "successes": (() => {
        const a: Array<IUserBase> = [];
        for (let i = 0; i < 50; i++)
            a.push({"email": faker.internet.email(), "password": faker.internet.password()});
        return a;
    })()
};

if (require.main === module) {
    console.info(user_mocks.successes);
}
