import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const OrganizationsCollection = new Mongo.Collection('organizations');
const ContactsCollection = new Mongo.Collection('contacts');
ContactsCollection.schema = new SimpleSchema({
  name: {
    type: String,
    label: 'name',
  },
  name: {
    type: String,
    label: 'email',
  },
  tagIds: {
    type: Array,
    label: 'Tags',
    optional: true,
  },
  'tagIds.$': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
});
const TagsCollection = new Mongo.Collection('tags');
TagsCollection.schema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
  },
  organization: {
    type: String,
    label: 'Organization',
  },
});

export { OrganizationsCollection, ContactsCollection, TagsCollection };
