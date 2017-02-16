import {IContactBase} from '../../../api/contact/models.d';
import {IObjectCtor} from '../../../main';
import {IUserBase} from '../../../api/user/models.d';
import {user_mocks} from '../user/user_mocks';

declare const Object: IObjectCtor;

export const contact_mocks: (users: Array<IUserBase>) => { successes: Array<IContactBase>, failures: Array<{}> } =
    (users: Array<IUserBase>) => ({
        "failures": [
            {},
            {"email": "foo@bar.com "},
            {"password": "foo "},
            {"email": "foo@bar.com", "password": "foo", "bad_prop": true}
        ],
        "successes": <Array<IContactBase>>((ob: Array<IContactBase> = []) => [
            `can ${Math.random()} count`, `can ${Math.random()} count`
        ].forEach(msg => ((date: Date) =>
            users.forEach((user: IUserBase, idx: number) => ob.push(<IContactBase>{
                email: user.email,
                owner: users[idx === 0 ? 1 : 0].email
            })))(new Date())
        ) || ob)()
    });

if (require.main === module) {
    console.info(contact_mocks(user_mocks.successes.slice(20, 30)));
}
