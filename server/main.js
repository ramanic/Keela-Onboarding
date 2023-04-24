import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { OrganizationsCollection } from '../imports/api/collections';
import '../imports/api/methods';

// Creating  Permissions

var users = [
  { username: 'KeelaAdmin', role: 'KeelaAdmin' },
  { username: 'Admin', role: 'Admin' },
  { username: 'Coordinator', role: 'Coordinator' },
];
Meteor.publish(null, function () {
  return Meteor.users.find(
    {
      _id: this.userId,
    },
    {
      fields: {
        role: 1,
        organization: 1,
      },
    }
  );
});
Meteor.startup(() => {
  users.forEach((user) => {
    if (!Accounts.findUserByUsername(user.username)) {
      id = Accounts.createUser({
        username: user.username,
        password: '123456',
      });
      Meteor.users.update(id, {
        $set: {
          role: user.role,
        },
      });
    }
  });
});
